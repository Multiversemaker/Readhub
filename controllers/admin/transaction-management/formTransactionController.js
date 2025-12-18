const { user, buku, tipe } = require("../../../models");

exports.create = async (req, res) => {
    try {
        const users = await user.findAll();
        const books = await buku.findAll({
            include: [{ model: tipe, as: 'tipe' }]
        });

        res.render('admin/transactions/add', { 
            users: users, 
            books: books,
            page: 'transactions',
            layout: false
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/transactions');
    }
};