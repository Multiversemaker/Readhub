const { buku: Book, kategori: Kategori, tipe: Tipe } = require("../../../models");

exports.getCreateBook = async (req, res) => {
  try {
    const kategoriList = await Kategori.findAll();
    const tipeList = await Tipe.findAll();

    res.render("admin/pages/create/create-book", {
      layout: "admin/layouts/create-update/crup-layout",
      title: "Add Buku",
      kategoriList,
      tipeList
    });
  } catch (err) {
    console.error("Error getCreateBook:", err);
    res.status(500).send("Gagal membuka form tambah buku");
  }
};

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
      layout: "admin/layouts/create-update/crup-layout",
      title: "Edit Buku",
      buku: buku.toJSON()
    });
  } catch (err) {
    console.error("Error getEditBook:", err);
    res.status(500).send("Gagal mengambil data buku");
  }
};
