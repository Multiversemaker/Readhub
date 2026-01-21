const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { Dropbox } = require("dropbox");
const { buku: Book } = require("../../../models");
const { getDropboxAccessToken } = require("../../../utils/dropboxHelper");

exports.createBook = async (req, res) => {
  try {
    const {
      judul, penulis, penerbit,
      tahun_terbit, deskripsi,
      kategori, tipe,
      stok, lokasi_rak
    } = req.body;

    const file = req.files?.file_buku?.[0] || null;
    const cover = req.files?.cover_image?.[0] || null;

    const isDigital = tipe === "digital";

    if (!judul || !kategori || !tipe) {
      req.flash("error", "Field wajib belum lengkap");
      return res.redirect("/admin/books");
    }

    if (!stok || stok <= 0) {
      req.flash("error", "Stok wajib diisi dan lebih dari 0");
      return res.redirect("/admin/books");
    }

    if (isDigital && !file) {
      req.flash("error", "Buku digital wajib upload file");
      return res.redirect("/admin/books");
    }

    if (!isDigital && !lokasi_rak) {
      req.flash("error", "Lokasi rak wajib untuk buku fisik");
      return res.redirect("/admin/books");
    }

    let filePathLocal = null;
    let filePathDropbox = null;

    if (isDigital && file) {
      filePathLocal = "/uploads/books/" + file.filename;

      const accessToken = await getDropboxAccessToken();
      if (accessToken) {
        const dbx = new Dropbox({ accessToken, fetch });
        const fileContent = fs.readFileSync(file.path);

        filePathDropbox = `/books/${file.filename}`;
        await dbx.filesUpload({
          path: filePathDropbox,
          contents: fileContent,
          mode: "overwrite",
        });
      }
    }

    const coverPath = cover ? "/uploads/covers/" + cover.filename : null;

    await Book.create({
      judul,
      penulis,
      penerbit,
      tahun_terbit,
      deskripsi,
      kategori_idkategori: kategori,
      tipe_idtipe: isDigital ? 2 : 1,
      stok_tersedia: parseInt(stok),
      lokasi_rak: isDigital ? "DIGITAL" : lokasi_rak,
      file_path: filePathLocal,
      file_path_dropbox: filePathDropbox,
      cover_image: coverPath,
    });

    req.flash("success", "Buku berhasil ditambahkan");
    res.redirect("/admin/books");

  } catch (err) {
    console.error("Error createBook:", err);
    req.flash("error", "Gagal menambahkan buku");
    res.redirect("/admin/books/create");
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      judul, penulis, penerbit,
      tahun_terbit, deskripsi,
      kategori, tipe,
      stok, lokasi_rak
    } = req.body;

    const file = req.files?.file_buku?.[0];
    const cover = req.files?.cover_image?.[0];

    const isDigital = tipe === "digital";

    const book = await Book.findByPk(id);
    if (!book) {
      req.flash("error", "Buku tidak ditemukan");
      return res.redirect("/admin/books");
    }

    if (!stok || stok <= 0) {
      req.flash("error", "Stok wajib diisi dan lebih dari 0");
      return res.redirect("/admin/books");
    }

    if (isDigital && !book.file_path && !file) {
      req.flash("error", "Buku digital wajib memiliki file");
      return res.redirect("/admin/books");
    }

    if (!isDigital && !lokasi_rak) {
      req.flash("error", "Lokasi rak wajib untuk buku fisik");
      return res.redirect("/admin/books");
    }

    let filePathLocal = book.file_path;
    let filePathDropbox = book.file_path_dropbox;

    if (isDigital && file) {
      const accessToken = await getDropboxAccessToken();
      if (accessToken) {
        const dbx = new Dropbox({ accessToken, fetch });

        // Hapus file lama di Dropbox
        if (filePathDropbox) {
          await dbx.filesDeleteV2({ path: filePathDropbox });
        }

        const fileContent = fs.readFileSync(file.path);
        filePathDropbox = `/books/${file.filename}`;

        await dbx.filesUpload({
          path: filePathDropbox,
          contents: fileContent,
          mode: "overwrite",
        });

        filePathLocal = "/uploads/books/" + file.filename;
      }
    }

    await Book.update({
      judul,
      penulis,
      penerbit,
      tahun_terbit,
      deskripsi,
      kategori_idkategori: parseInt(kategori),
      tipe_idtipe: isDigital ? 2 : 1,
      stok_tersedia: parseInt(stok),
      lokasi_rak: isDigital ? "DIGITAL" : lokasi_rak,
      file_path: isDigital ? filePathLocal : null,
      file_path_dropbox: isDigital ? filePathDropbox : null,
      cover_image: cover ? "/uploads/covers/" + cover.filename : book.cover_image,
    }, { where: { id_buku: id } });

    req.flash("success", "Buku berhasil diperbarui");
    res.redirect("/admin/books");

  } catch (err) {
    console.error("Error updateBook:", err);
    req.flash("error", "Gagal update buku");
    res.redirect("/admin/books");
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.redirect("/admin/books");

    if (book.tipe_idtipe === 2 && book.file_path_dropbox) {
      const accessToken = await getDropboxAccessToken();
      if (accessToken) {
        const dbx = new Dropbox({ accessToken, fetch });
        await dbx.filesDeleteV2({ path: book.file_path_dropbox });
      }
    }

    await Book.destroy({ where: { id_buku: req.params.id } });
    res.redirect("/admin/books");

  } catch (err) {
    console.error("Error deleteBook:", err);
    res.status(500).send("Gagal menghapus buku");
  }
};