const { user } = require("../../../models"); 
const bcrypt = require("bcrypt"); 


exports.storeUser = async (req, res) => {
  try {
    const { nama_lengkap, email, password, role, alamat } = req.body;

    
    let roleId = (role === 'admin') ? 1 : 2; 

    
    const hashedPassword = await bcrypt.hash(password, 10);

    await user.create({
      nama: nama_lengkap,
      email: email,
      password: hashedPassword,
      role_idrole: roleId,
      alamat: alamat,
      tanggal_daftar: new Date()
    });

    res.redirect('/admin/users');
  } catch (err) {
    console.error("Error storeUser:", err);
    res.status(500).send("Gagal menyimpan user.");
  }
};


exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { nama_lengkap, email, role, alamat } = req.body;
    
    let roleId = (role === 'admin') ? 1 : 2;

    await user.update({
        nama: nama_lengkap,
        email: email,
        role_idrole: roleId,
        alamat: alamat
    }, {
        where: { id_user: id }
    });

    res.redirect('/admin/users');
  } catch (err) {
    console.error("Error updateUser:", err);
    res.redirect('/admin/users');
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    
    await user.destroy({
        where: { id_user: id }
    });
    
    res.redirect('/admin/users');
  } catch (err) {
    console.error("Error deleteUser:", err);
    res.send("<h3>Gagal Hapus!</h3><p>User tidak bisa dihapus (Mungkin masih meminjam buku).</p><a href='/admin/users'>Kembali</a>");
  }
};