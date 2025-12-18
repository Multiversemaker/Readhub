const { peminjaman_fisik, denda, buku, sequelize } = require('../../models');
const { Op } = require('sequelize');

module.exports = {

    getReport: async (req, res) => {
        try {
            
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            
            let startDate = req.query.start_date || firstDay.toISOString().split('T')[0];
            let endDate = req.query.end_date || today.toISOString().split('T')[0];

            
            const totalTransaksi = await peminjaman_fisik.count({
                where: {
                    tanggal_pinjam: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });

            
            const totalDendaData = await denda.sum('jumlah_denda', {
                include: [{
                    model: peminjaman_fisik,
                    as: 'peminjaman_fisik',
                    where: {
                        tanggal_pinjam: { [Op.between]: [startDate, endDate] }
                    }
                }]
            });
            
            
            const topBooks = await peminjaman_fisik.findAll({
                attributes: [
                    'buku_id_buku', 
                    [sequelize.fn('COUNT', sequelize.col('buku_id_buku')), 'jumlah_pinjam']
                ],
                include: [{
                    model: buku,
                    as: 'buku',
                    attributes: ['judul'] 
                }],
                where: {
                    tanggal_pinjam: { [Op.between]: [startDate, endDate] }
                },
                group: ['buku_id_buku'],
                order: [[sequelize.literal('jumlah_pinjam'), 'DESC']],
                limit: 5
            });

            
            res.render('admin/reports/index', {
                summary: {
                    total_transaksi: totalTransaksi,
                    total_denda: totalDendaData || 0
                },
                topBooks: topBooks.map(item => ({
                    judul: item.buku.judul,
                    tipe_buku: 'Fisik', 
                    jumlah_pinjam: item.dataValues.jumlah_pinjam
                })),
                startDate: startDate,
                endDate: endDate,
                page: 'reports',
                layout: false
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal memuat laporan");
        }
    },

    filterReport: (req, res) => {
        const { start_date, end_date } = req.body;
        
        res.redirect(`/admin/reports?start_date=${start_date}&end_date=${end_date}`);
    }
};