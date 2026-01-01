exports.homePage = (req, res) => {
  try {
    res.render("member/pages/dashboard", {
      layout: "member/layouts/main-layout",
      title: "ReadHub",
      nama: req.session.nama,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Gagal memuat halaman");
  }
};