// controllers/admin/book/formController.js
const { buku: Book, kategori: Kategori, tipe: Tipe } = require("../../../models");

// GET Create Form
exports.getCreateBook = (req, res) => {
  res.render("admin/pages/create/create-book", {
    title: "Add Buku",
  });
};

// GET Edit Form
exports.getEditBook = async (req, res) => {
  try {
    const buku = await Book.findOne({
      where: { id_buku: req.params.id },
      include: [
        { model: Kategori, as: "kategori" },
        { model: Tipe, as: "tipe" }
      ]
    });

    if (!buku) return res.status(404).send("Buku tidak ditemukan");

    res.render("admin/pages/edit/edit-book", {
      title: "Edit Buku",
      buku: buku.toJSON()
    });
  } catch (err) {
    console.error("Error getEditBook:", err);
    res.status(500).send("Gagal mengambil data buku");
  }
};
