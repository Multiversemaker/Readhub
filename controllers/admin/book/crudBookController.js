// controllers/admin/book/crudController.js
const { buku: Book } = require("../../../models");

// CREATE
exports.createBook = async (req, res) => {
  try {
    const { judul, penulis, stok_tersedia, kategori, tipe } = req.body;

    await Book.create({
      judul,
      penulis,
      stok_tersedia: parseInt(stok_tersedia) || null,
      kategori_idkategori: parseInt(kategori) || null,
      tipe_idtipe: parseInt(tipe) || null,
      file_path: req.file ? `/uploads/buku/${req.file.filename}` : null,
      cover_image: req.file ? `/uploads/buku/${req.file.filename}` : null,
    });

    res.redirect("/admin/book");
  } catch (err) {
    console.error("Error createBook:", err);
    res.status(500).send("Gagal menambah buku");
  }
};

// UPDATE
exports.updateBook = async (req, res) => {
  try {
    const { judul, penulis, stok_tersedia, kategori, tipe } = req.body;

    const updatedData = {
      judul,
      penulis,
      stok_tersedia: parseInt(stok_tersedia) || null,
      kategori_idkategori: parseInt(kategori) || null,
      tipe_idtipe: parseInt(tipe) || null,
    };

    if (req.file) {
      updatedData.file_path = `/uploads/buku/${req.file.filename}`;
      updatedData.cover_image = `/uploads/buku/${req.file.filename}`;
    }

    await Book.update(updatedData, { where: { id_buku: req.params.id } });

    res.redirect("/admin/book");
  } catch (err) {
    console.error("Error updateBook:", err);
    res.status(500).send("Gagal update buku");
  }
};

// DELETE
exports.deleteBook = async (req, res) => {
  try {
    await Book.destroy({ where: { id_buku: req.params.id } });
    res.redirect("/admin/book");
  } catch (err) {
    console.error("Error deleteBook:", err);
    res.status(500).send("Gagal menghapus buku");
  }
};