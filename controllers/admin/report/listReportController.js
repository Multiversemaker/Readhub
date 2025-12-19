const { Op } = require("sequelize");
const { peminjaman_fisik: Peminjaman, denda: Denda, buku: Buku, sequelize } = require("../../../models");
const { formatDate } = require("../../../utils/dateFormatter");

const DATE_FIELD = "tanggal_pinjam";

exports.getReport = async (req, res) => {
  try {
    const { startDate: rawStartDate, endDate: rawEndDate, page = 1 } = req.query;

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDate = rawStartDate || firstDay.toISOString().split("T")[0];
    const endDate = rawEndDate || today.toISOString().split("T")[0];

    // Filter tanggal
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const whereDate = {
      [DATE_FIELD]: { [Op.between]: [start, end] }
    };

    // Total transaksi
    const totalTransaksi = await Peminjaman.count({ where: whereDate });

    const totalDendaData = await Denda.sum('jumlah_denda', {
      where: {
        '$peminjaman_fisik.tanggal_pinjam$': { [Op.between]: [start, end] }
      },
      include: [{
        model: Peminjaman,
        as: 'peminjaman_fisik',
        attributes: [] // jangan ambil kolom apapun
      }]
    });


    // Top 5 buku paling banyak dipinjam
    const topBooksRaw = await Peminjaman.findAll({
      attributes: [
        "buku_id_buku",
        [sequelize.fn("COUNT", sequelize.col("buku_id_buku")), "jumlah_pinjam"]
      ],
      include: [{
        model: Buku,
        as: "buku",
        attributes: ["judul"]
      }],
      where: whereDate,
      group: ["buku_id_buku"],
      order: [[sequelize.literal("jumlah_pinjam"), "DESC"]],
      limit: 5
    });

    const topBooks = topBooksRaw.map(item => ({
      judul: item.buku.judul,
      tipe_buku: "Fisik",
      jumlah_pinjam: item.dataValues.jumlah_pinjam
    }));

    res.render("admin/pages/report", {
      layout: "admin/layouts/report/report-layout", // bisa disesuaikan
      title: "Laporan Peminjaman",
      summary: {
        total_transaksi: totalTransaksi,
        total_denda: totalDendaData || 0
      },
      topBooks,
      startDate: formatDate(start),
      endDate: formatDate(end),
      page: "reports",
      noReportsFound: topBooks.length === 0
    });

  } catch (err) {
    console.error("Error getReport:", err);
    res.status(500).send("Gagal memuat laporan");
  }
};

exports.filterReport = (req, res) => {
  const { start_date, end_date } = req.body;
  res.redirect(`/admin/reports?startDate=${start_date}&endDate=${end_date}`);
};
