const { user, buku, tipe } = require("../../../models");

exports.getCreateTransaction = async (req, res) => {
    try {
        const users = await user.findAll();
        const books = await buku.findAll({
            include: [{ model: tipe, as: 'tipe' }]
        });

        res.render('admin/pages/create/create-transaction', {
            layout: "admin/layouts/create-update/crup-layout",
            users: users, 
            books: books,
            title: 'add transactions',
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/transactions');
    }
};