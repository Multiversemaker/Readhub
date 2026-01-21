const { buku: Book, user: User, peminjaman_fisik: F, peminjaman_digital: D } = require("../../models");

exports.homePage = async (req, res) => {
  try {
    const totalBuku = await Book.count();
    const totalAnggota = await User.count();

    const totalFisik = await F.count();
    const totalDigital = await D.count();

    const totalPeminjaman = totalFisik + totalDigital;

    res.render("admin/pages/dashboard", {
      layout: "admin/layouts/main-layout",
      title: "Admin Readhub",
      nama: req.session.nama,
      totalBuku,
      totalAnggota,
      totalPeminjaman
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memuat dashboard");
  }
};