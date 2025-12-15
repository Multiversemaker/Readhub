const { buku: Book, user: User } = require("../../models");

exports.homePage = async (req, res) => {
  try {
    const totalBuku = await Book.count();
    const totalAnggota = await User.count();

    res.render("admin/pages/dashboard", {
      layout: "admin/layouts/main-layout",
      title: "wA Admin Readhub",
      nama: req.session.nama,
      totalBuku,
      totalAnggota
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memuat dashboard");
  }
};
