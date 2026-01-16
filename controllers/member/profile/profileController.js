const { user } = require('../../../models');

exports.profilePage = async (req, res) => {
  try {
    const userId = req.session.user.id_user;

    const profile = await user.findOne({
      where: { id_user: userId },
      include: [{ association: 'role' }]
    });

    if (!profile) {
      req.flash("error", "User tidak ditemukan");
      return res.redirect("/");
    }

    const name = profile.nama || '';
    const parts = name.trim().split(/\s+/);

    res.render('member/pages/profile', {
      title: 'Profile',
      user: {
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' '),
        fullName: name,
        profileImage: profile.profile_image || '/images/default-avatar.jpg',
        gender: profile.jenis_kelamin || '',
        birthDate: profile.tanggal_lahir || '',
        email: profile.email || '',
        phone: profile.nomor_hp || '',
        address: profile.alamat || ''
      },
      activities: [],
      layout: "member/layouts/profile-layout"
    });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    req.flash("error", "Gagal memuat halaman profile");
    res.redirect("/");
  }
};
