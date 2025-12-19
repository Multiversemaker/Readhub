const { user, role } = require("../../../models");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await user.findAll({
            include: [{
                model: role,
                as: 'role',
            }],
            order: [['id_user', 'DESC']] 
        });
        
        res.render('admin/pages/user-management', { 
            users: users,
            title: 'users',
            layout: "admin/layouts/user-management/um-layout"
        });
    } catch (err) {
        console.error("Error getAllUsers:", err);
        res.status(500).send("Gagal mengambil data user");
    }
};