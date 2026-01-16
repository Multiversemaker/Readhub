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
      return res.redirect("/login");
    }

    // 🔥 SIMPAN SESSION DENGAN BENAR
    req.session.user = {
      id_user: foundUser.id_user,
      nama: foundUser.nama,
      role: foundUser.role.role
    };

    req.flash("success", "Login berhasil!");

    if (foundUser.role.role === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/member/dashboard");
    }

  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan server.");
    res.redirect("/login");
  }
};


exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    tanggalLahir,
    alamat
  } = req.body;

  try {
    // cek email
    const existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
      req.flash("error", "Email sudah digunakan!");
      return res.redirect("/register");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // simpan user
    await user.create({
      nama: `${firstName} ${lastName}`, // ✅ gabung nama
      email,
      password: hashedPassword,
      tanggal_lahir: tanggalLahir,
      alamat,
      role_idrole: 2,                   // ✅ MEMBER
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
