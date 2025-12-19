const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { Dropbox } = require("dropbox");
const { buku: Book } = require("../../../models");
const { getDropboxAccessToken } = require("../../../utils/dropboxHelper");

exports.createBook = async (req, res) => {
  try {
    const { judul, penulis, penerbit, tahun_terbit, deskripsi, kategori, tipe, stok, lokasi_rak } = req.body;

    const file = req.files?.file_buku?.[0] || null;
    const cover = req.files?.cover?.[0] || null;

    const isDigital = tipe === "digital";

    if (!judul || !kategori || !tipe) {
      req.flash("error", "Field wajib belum lengkap");
      return res.redirect("/admin/books");
    }

    if (isDigital && !file) {
      req.flash("error", "Buku digital wajib upload file");
      return res.redirect("/admin/books");
    }

    if (!isDigital && (!stok || !lokasi_rak)) {
      req.flash("error", "Stok dan lokasi rak wajib untuk buku fisik");
      return res.redirect("/admin/books");
    }
    let filePathLocal = null;
    let filePathDropbox = null;

    if (isDigital && file) {
      filePathLocal = "/Public/uploads/books/" + file.filename;
    }

    if (isDigital && file) {
      const accessToken = await getDropboxAccessToken();
      if (!accessToken) throw new Error("Dropbox access token kosong");

      const dbx = new Dropbox({ accessToken, fetch });

      const fileContent = fs.readFileSync(file.path);
      filePathDropbox = `/books/${file.filename}`;

      await dbx.filesUpload({
        path: filePathDropbox,
        contents: fileContent,
        mode: "overwrite",
      });
    }

    await Book.create({
      judul,
      penulis,
      penerbit,
      tahun_terbit,
      deskripsi,

      kategori_idkategori: kategori,
      tipe_idtipe: isDigital ? 2 : 1,

      stok_tersedia: isDigital ? null : stok,
      lokasi_rak: isDigital ? null : lokasi_rak,

      file_path: filePathLocal,
      file_path_dropbox: filePathDropbox,

      cover_image: cover
        ? "/Public/uploads/covers/" + cover.filename
        : null
    });

    req.flash("success", "Buku berhasil ditambahkan");
    res.redirect("/admin/books");

  } catch (err) {
    console.error("Error createBook:", err);
    req.flash("error", err.message || "Gagal menambahkan buku");
    res.redirect("/admin/books/create");
  }
};

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

    res.redirect("/admin/books");
  } catch (err) {
    console.error("Error updateBook:", err);
    res.status(500).send("Gagal update buku");
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.destroy({ where: { id_buku: req.params.id } });
    res.redirect("/admin/books");
  } catch (err) {
    console.error("Error deleteBook:", err);
    res.status(500).send("Gagal menghapus buku");
  }
};