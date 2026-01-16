const { user } = require('../../../models/user');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user.id_user;
    const { nama, email, tanggal_lahir, alamat } = req.body;

    const updatedUser = await user.update(
      { nama, email, tanggal_lahir, alamat },
      { where: { id_user: userId } }
    );

    if (!updatedUser) {
      return res.render('member/pages/error/error', {
        message: 'Gagal memperbarui profil'
      });
    }

    res.redirect('/member/profile');
  } catch (error) {
    console.error('Error updating profile:', error && error.stack ? error.stack : error);

    res.render('member/pages/error', {
      message: 'Gagal memperbarui profil (cek server log untuk detail)'
    });
  }
};