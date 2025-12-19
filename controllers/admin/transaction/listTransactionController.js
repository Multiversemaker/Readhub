const { peminjaman_fisik, user, buku } = require("../../../models");

exports.getTransactionAll = async (req, res) => {
    try {
        const transactions = await peminjaman_fisik.findAll({
            include: [
                { model: user, as: 'user' },
                { model: buku, as: 'buku' }
            ],
            order: [['tanggal_pinjam', 'DESC']]
        });

        res.render('admin/pages/transaction', { 
            layout: "admin/layouts/transaction/transaction-layout",
            transactions: transactions,
            title: 'transactions',
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error mengambil data transaksi");
    }
};