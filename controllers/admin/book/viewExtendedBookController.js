const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

// Ambil model via initModels
const initModels = require("../../../models/init-models");
const sequelize = require("../../../models/index").sequelize;
const { buku: Buku, tipe: Tipe } = initModels(sequelize);


exports.downloadBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Buku.findByPk(id, {
      include: [{ model: Tipe, as: "tipe_idtipe_tipe" }]
    });

    if (!book) return res.status(404).send("Buku tidak ditemukan");
    if (book.tipe?.tipe.toLowerCase() === "digital") 
      return res.status(400).send("Buku bukan tipe digital");

    if (!book.file_path) return res.status(404).send("File PDF tidak tersedia");

    const filePath = path.join(__dirname, "../../../public/uploads/books", path.basename(book.file_path));
    if (!fs.existsSync(filePath)) return res.status(404).send("File PDF tidak ditemukan");

    return res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
};

exports.viewBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Buku.findByPk(id);

    if (!book) {
      return res.status(404).send("Buku tidak ditemukan");
    }

    // Pastikan buku digital
    if (book.tipe_idtipe !== 2) {
      return res.status(400).send("Buku bukan tipe digital");
    }

    if (!book.file_path) {
      return res.status(404).send("File PDF tidak tersedia");
    }

    // ⚠️ file_path HARUS: /uploads/books/xxx.pdf
    res.render("admin/pages/detail/view-pdf-buku", {
      title: book.judul,
      layout: "admin/layouts/catalog/book-detail-layout",
      pdfUrl: book.file_path
    });

  } catch (err) {
    console.error("viewBook error:", err);
    res.status(500).send("Terjadi kesalahan server");
  }
};


exports.openBookLocal = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Buku.findByPk(id, {
      include: [{ model: Tipe, as: "tipe_idtipe_tipe" }]
    });

    if (!book) return res.status(404).send("Buku tidak ditemukan");
    if (book.tipe?.tipe.toLowerCase() === "digital") 
      return res.status(400).send("Buku bukan tipe digital");
    if (!book.file_path) return res.status(404).send("File PDF tidak tersedia");

    const filePath = path.join(__dirname, "../../../public/uploads/books", path.basename(book.file_path));
    if (!fs.existsSync(filePath)) return res.status(404).send("File PDF tidak ditemukan di server");

    exec(`start "" "${filePath}"`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Gagal membuka PDF lokal");
      }
      res.redirect("/admin/books");
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
};