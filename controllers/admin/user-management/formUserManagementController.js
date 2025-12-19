const { user, role } = require("../../../models");

exports.getAddUser = (req, res) => {
    res.render('admin/pages/create/create-userManagement', {
        title: 'Tambah User Baru',
        layout: "admin/layouts/create-update/crup-layout"
    });
};


exports.getEditUser = async (req, res) => {
    try {
        const id = req.params.id;
        
       
        const userData = await user.findByPk(id, {
            include: [{ model: role, as: 'role' }]
        });

        if (userData) {
            res.render('admin/pages/edit/edit-userManagement', { 
                user: userData,
                title : "Edit User",
                layout: "admin/layouts/create-update/crup-layout"
            });
        } else {
            res.status(404).send("User tidak ditemukan");
        }
    } catch (err) {
        console.error("Error getEditUser:", err);
        res.redirect('/admin/user-managements');
    }
};