const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { Dropbox } = require("dropbox");
const { buku: Book } = require("../../../models");
const { getDropboxAccessToken } = require("../../../utils/dropboxHelper");

exports.createBook = async (req, res) => {
  try {
    // 1️⃣ Ambil semua field dari form
    const {
      judul, penulis, penerbit,
      tahun_terbit, deskripsi,
      kategori, tipe,
      stok, lokasi_rak
    } = req.body;

    console.log("===== REQ.BODY =====");
    console.log(req.body);

    // 2️⃣ Ambil file dari multer (sesuai field name)
    const file = req.files?.file_buku?.[0] || null;
    const cover = req.files?.cover_image?.[0] || null;

    console.log("===== REQ.FILES =====");
    console.log(req.files);
    console.log("file_buku:", file);
    console.log("cover_image:", cover);

    const isDigital = tipe === "digital";

    // 3️⃣ Validasi wajib
    if (!judul || !kategori || !tipe) {
      console.log("Validation failed: field wajib belum lengkap");
      req.flash("error", "Field wajib belum lengkap");
      return res.redirect("/admin/books");
    }

    if (isDigital && !file) {
      console.log("Validation failed: buku digital wajib upload file");
      req.flash("error", "Buku digital wajib upload file");
      return res.redirect("/admin/books");
    }

    if (!isDigital && (!stok || !lokasi_rak)) {
      console.log("Validation failed: stok/lokasi rak wajib untuk buku fisik");
      req.flash("error", "Stok dan lokasi rak wajib untuk buku fisik");
      return res.redirect("/admin/books");
    }

    // 4️⃣ Path file lokal & Dropbox
    let filePathLocal = null;
    let filePathDropbox = null;

    if (isDigital && file) {
      filePathLocal = "/uploads/books/" + file.filename;

      // Optional: upload ke Dropbox
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
      } else {
        console.log("Dropbox token kosong, skip upload Dropbox");
      }
    }

    // 5️⃣ Cover image path
    const coverPath = cover ? "/uploads/covers/" + cover.filename : null;

    // 6️⃣ Simpan ke database
    const newBook = await Book.create({
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
      cover_image: coverPath,
    });

    console.log("Book created successfully:", newBook);

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
    console.log("=== Multer req.files ===");
    console.log(req.files); // lihat semua file yang di-upload

    const { judul, penulis, penerbit, tahun_terbit, deskripsi, kategori, tipe, stok, lokasi_rak } = req.body;

    const file = req.files?.file_buku?.[0];
    const cover = req.files?.cover_image?.[0];

    if (file) console.log("File buku terupload:", file.filename);
    else console.log("File buku tidak ada");

    if (cover) console.log("Cover image terupload:", cover.filename);
    else console.log("Cover image tidak ada");

    // Update database
    const updatedData = {
      judul,
      penulis,
      penerbit,
      tahun_terbit,
      deskripsi,
      kategori_idkategori: parseInt(kategori),
      tipe_idtipe: tipe === "digital" ? 2 : 1,
      stok_tersedia: tipe === "digital" ? null : parseInt(stok),
      lokasi_rak: tipe === "digital" ? null : lokasi_rak,
      file_path: file ? "/Public/uploads/books/" + file.filename : undefined,
      cover_image: cover ? "/Public/uploads/covers/" + cover.filename : undefined,
    };

    // Hapus field undefined supaya tidak menimpa
    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

    await Book.update(updatedData, { where: { id_buku: req.params.id } });

    console.log("Update berhasil:", updatedData);

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