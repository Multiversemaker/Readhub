const {
  buku: Buku,
  peminjaman_fisik: PeminjamanFisik,
  kategori: Kategori, tipe: Tipe
} = require("../../../models");

exports.getABookDetailMember = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Buku.findByPk(id, {
      include: [
        { model: Kategori, as: "kategori" },
        { model: Tipe, as: "tipe" }
      ]
    });

    if (!book) return res.status(404).send("Buku tidak ditemukan");

    const mappedBook = {
      id: book.id_buku,
      title: book.judul,
      author: book.penulis,
      publisher: book.penerbit,          // ← poin 2
      cover: book.cover_image,
      year: book.tahun_terbit,
      description: book.deskripsi,
      category: book.kategori?.kategori || "-",
      type: book.tipe?.tipe || "-"
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