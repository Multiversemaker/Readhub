const bcrypt = require("bcrypt");
// PENTING: Import model 'user' DAN 'role'
const { user, role } = require("../../../models"); 

exports.register = async (req, res) => {
  const { nama, email, password, role_idrole } = req.body; 

  try {
   
    const existingUser = await user.findOne({ where: { email: email } });
    if (existingUser) {
        
        console.log("Email sudah terdaftar");
        return res.redirect("/register");
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);

  
    let roleId = 2; 
    
    if (role_idrole === 'admin') {
        roleId = 1; 
    }

  
    await user.create({
      nama: nama,
      email: email,
      password: hashedPassword,
      tanggal_daftar: new Date(),
      role_idrole: roleId 
    });

    console.log("Register Berhasil! Silakan Login.");
    res.redirect("/login");

  } catch (err) {
    console.error("Register Error:", err);
    res.redirect("/register");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const foundUser = await user.findOne({ 
        where: { email: email },
        include: [{ 
            model: role, 
            as: 'role' 
        }] 
    });

    if (!foundUser) {
        console.log("Email tidak ditemukan");
        return res.redirect("/login");
    }

    
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
        console.log("Password salah");
        return res.redirect("/login");
    }

   
    const roleName = foundUser.role ? foundUser.role.role : 'anggota';

   
    if (req.session) {
        req.session.userId = foundUser.id_user;
        req.session.nama = foundUser.nama;
        req.session.role = roleName; 
    }

    console.log("Login Berhasil sebagai:", roleName);

    
    if (roleName === 'admin') {
        return res.redirect("/admin/dashboard");
    } else {
        return res.redirect("/client/dashboard");
    }

  } catch (err) {
    console.error("Login Error:", err);
    res.redirect("/login");
  }
};
