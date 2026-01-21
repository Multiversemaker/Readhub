const { peminjaman_fisik, buku, tipe } = require("../../models");

exports.index = async (req, res) => {
    try {
        const sessionUser = req.session.user;
        const userId = sessionUser ? sessionUser.id_user : null;

        if (!userId) {
            return res.redirect('/login');
        }

        const loans = await peminjaman_fisik.findAll({
            where: { user_id_user: userId },
            include: [
                { model: buku, as: 'buku' }
            ],
            order: [['tanggal_pinjam', 'DESC']]
        });

        res.render('member/pages/circulation', {
            title: 'Riwayat Peminjaman Saya',
            loans: loans,
            layout: 'member/layouts/main-layout',
            currentUser: sessionUser
        });

    } catch (err) {
        console.error("Error circulation member:", err);
        res.status(500).send("Terjadi kesalahan pada server: " + err.message);
    }
};

exports.pinjamBuku = async (req, res) => {
    try {
        console.log("=== DEBUG PINJAM BUKU ===");
        console.log("Body yang diterima:", req.body);
        const { id_buku } = req.body;
        console.log("ID Buku yang dicari:", id_buku);

        const sessionUser = req.session.user;
        const userId = sessionUser ? sessionUser.id_user : null;

        if (!userId) return res.redirect('/login');

        
        const bookData = await buku.findByPk(id_buku, {
            include: [{ model: tipe, as: 'tipe' }]
        });

        if (!bookData) return res.status(404).send("Buku tidak ditemukan");
        if (bookData.stok_tersedia < 1) return res.send("Stok Habis!");

      
        const tgl_sekarang = new Date();
        const jatuh_tempo = new Date();
        jatuh_tempo.setDate(jatuh_tempo.getDate() + 7);

  
        await peminjaman_fisik.create({
            user_id_user: userId,
            buku_id_buku: id_buku,
            tanggal_pinjam: tgl_sekarang,
            tanggal_jatuh_tempo: jatuh_tempo,
            status: 'menunggu_persetujuan' 
        });

      
        await bookData.decrement('stok_tersedia', { by: 1 });

        res.redirect('/member/circulation');

    } catch (err) {
        console.error("Error pinjam buku:", err);
        res.status(500).send("Gagal meminjam buku: " + err.message);
    }
};
