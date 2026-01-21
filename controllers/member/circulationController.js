const { peminjaman_fisik, buku, peminjaman_digital } = require("../../models");

exports.index = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");

    const fisik = await peminjaman_fisik.findAll({
      where: { user_id_user: user.id_user },
      include: [{ model: buku, as: "buku" }],
      order: [["tanggal_pinjam", "DESC"]]
    });

    const digital = await peminjaman_digital.findAll({
      where: { user_id_user: user.id_user },
      include: [{ model: buku, as: "buku" }],
      order: [["tanggal_akses", "DESC"]]
    });

    res.render("member/pages/circulation", {
      title: "Riwayat Peminjaman Saya",
      loansFisik: fisik,
      loansDigital: digital,
      layout: "member/layouts/main-layout",
      currentUser: user
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


exports.pinjamBuku = async (req, res) => {
  try {
    console.log("=== PINJAM MEMBER MASUK ===");

    console.log("PARAMS:", req.params);
    console.log("SESSION USER:", req.session.user);

    const user = req.session.user;
    const { id_buku } = req.params;

    if (!user) {
      console.log("❌ USER TIDAK LOGIN");
      return res.redirect("/login");
    }

    console.log("User ID:", user.id_user);
    console.log("Buku ID:", id_buku);

    const bookData = await buku.findByPk(id_buku, {
      include: ["tipe"]
    });

    console.log("BOOK DATA:", bookData?.toJSON());

    if (!bookData) {
      console.log("❌ BUKU TIDAK DITEMUKAN");
      return res.redirect("/member/catalog");
    }

    const tipe = bookData.tipe?.tipe?.toLowerCase();
    console.log("TIPE BUKU:", tipe);

    const isFisik = tipe?.includes("fisik") || tipe?.includes("cetak");

    console.log("IS FISIK:", isFisik);

    if (isFisik) {
      console.log("STOK:", bookData.stok_tersedia);

      if (bookData.stok_tersedia < 1) {
        console.log("❌ STOK HABIS");
        return res.redirect("/member/catalog");
      }

      await peminjaman_fisik.create({
        user_id_user: user.id_user,
        buku_id_buku: id_buku,
        tanggal_pinjam: new Date(),
        tanggal_jatuh_tempo: new Date(Date.now() + 7 * 86400000)
      });

      console.log("✅ PEMINJAMAN FISIK DIBUAT");

      await bookData.decrement("stok_tersedia", { by: 1 });
      console.log("📉 STOK DIKURANGI");

    } else {
      await peminjaman_digital.create({
        user_id_user: user.id_user,
        buku_id_buku: id_buku,
        tanggal_akses: new Date(),
        tanggal_kedaluwarsa: new Date(Date.now() + 14 * 86400000),
        status: "aktif"
      });

      console.log("✅ PEMINJAMAN DIGITAL DIBUAT");
    }

    console.log("➡️ REDIRECT KE CIRCULATION");
    res.redirect("/member/circulation");

  } catch (err) {
    console.error("🔥 ERROR PINJAM:", err);
    res.redirect("/member/catalog");
  }
};