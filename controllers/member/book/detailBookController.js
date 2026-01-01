const {
  buku: Buku,
  peminjaman_fisik: PeminjamanFisik,
  kategori: Kategori, tipe: Tipe
} = require("../../../models");

exports.getABookDetailMember = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari buku beserta kategori dan tipe
   const book = await Buku.findByPk(id, {
  include: [
    { model: Kategori, as: "kategori" },
    { model: Tipe, as: "tipe" }
  ]
});


    if (!book) return res.status(404).send("Buku tidak ditemukan");

    // Mapping agar view bisa pakai nama properti yang mudah
    const mappedBook = {
      id: book.id_buku,
      title: book.judul,
      author: book.penulis,
      cover: book.cover_image,
      year: book.tahun_terbit,
      description: book.deskripsi,
      category: book.kategori_idkategori_kategori?.nama_kategori || "-",
      type: book.tipe_idtipe_tipe?.tipe || "-"
    };

    res.render("member/pages/detail/detail-catalog", {
      layout: "member/layouts/detail/book-detail-layout",
      title: book.judul,
      book: mappedBook,
      user: req.session.user
    });
  } catch (err) {
    console.error("Error getABookDetailMember:", err);
    res.status(500).send("Gagal memuat detail buku");
  }
};