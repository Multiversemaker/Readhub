const { user, role } = require("../../../models");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await user.findOne({
      where: { email },
      include: [{ model: role, as: "role" }],
    });

    if (!foundUser) {
      req.flash("error", "Email tidak ditemukan!");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      req.flash("error", "Password salah!");
        console.log("Password salah!");
      return res.redirect("/login");
    }
    const userRole = foundUser.role.role;
    req.session.userId = foundUser.id_user;
    req.session.nama = foundUser.nama;
    req.session.role = userRole;


    req.flash("success", "Login berhasil!");

    if (userRole === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/client/dashboard");
    }

  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan server.");
    res.redirect("/login");
  }
};

exports.register = async (req, res) => {
  const { nama, email, password, role_idrole } = req.body;

  try {
    const existingUser = await user.findOne({ where: { email } });

    if (existingUser) {
      req.flash("warning", "Email sudah digunakan!");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await user.create({
      nama,
      email,
      password: hashedPassword,
      role_idrole,
      tanggal_daftar: new Date(),
    });

    req.flash("success", "Pendaftaran berhasil!");
    res.redirect("/login");

  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal mendaftar!");
    res.redirect("/register");
  }
};