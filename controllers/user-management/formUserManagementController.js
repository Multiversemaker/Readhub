const { user, role } = require("../../../models");

exports.getAddUser = (req, res) => {
    res.render('admin/users/add', {
        title: 'Tambah User Baru',
        page: 'users',
        layout: false
    });
};


exports.getEditUser = async (req, res) => {
    try {
        const id = req.params.id;
        
       
        const userData = await user.findByPk(id, {
            include: [{ model: role, as: 'role' }]
        });

        if (userData) {
            res.render('admin/users/edit', { 
                user: userData,
                page: 'users',
                layout: false
            });
        } else {
            res.status(404).send("User tidak ditemukan");
        }
    } catch (err) {
        console.error("Error getEditUser:", err);
        res.redirect('/admin/users');
    }
};