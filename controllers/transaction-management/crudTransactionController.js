const { peminjaman_fisik, peminjaman_digital, buku, denda } = require("../../../models");

// STORE (Simpan Peminjaman Baru)
exports.store = async (req, res) => {
    try {
        const { id_pengguna, id_buku } = req.body;
        
        const bookData = await buku.findByPk(id_buku, {
            include: ['tipe'] 
        });

        if (!bookData) return res.send("Buku tidak ditemukan");

        const tgl_sekarang = new Date();
        // Cek tipe buku (Fisik/Digital)
        const isFisik = bookData.tipe && (bookData.tipe.tipe.toLowerCase().includes('cetak') || bookData.tipe.tipe.toLowerCase().includes('fisik'));

        if (isFisik) {
            if (bookData.stok_tersedia < 1) return res.send("Stok Habis!");

            const jatuh_tempo = new Date();
            jatuh_tempo.setDate(jatuh_tempo.getDate() + 7);

            await peminjaman_fisik.create({
                user_id_user: id_pengguna,
                buku_id_buku: id_buku,
                tanggal_pinjam: tgl_sekarang,
                tanggal_jatuh_tempo: jatuh_tempo,
                status: 'dipinjam'
            });

            await bookData.decrement('stok_tersedia', { by: 1 });

        } else {
            const kedaluwarsa = new Date();
            kedaluwarsa.setDate(kedaluwarsa.getDate() + 14);

            await peminjaman_digital.create({
                user_id_user: id_pengguna,
                buku_id_buku: id_buku,
                tanggal_akses: tgl_sekarang,
                tanggal_kedaluwarsa: kedaluwarsa,
                status: 'aktif'
            });
        }

        res.redirect('/admin/transactions');

    } catch (err) {
        console.log(err);
        res.send("Gagal menyimpan transaksi.");
    }
};

// RETURN (Proses Pengembalian)
exports.editTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const tanggal_kembali = new Date();

        const loan = await peminjaman_fisik.findByPk(id);
        if (!loan) return res.send("Transaksi tidak ditemukan");

        const jatuh_tempo = new Date(loan.tanggal_jatuh_tempo);

        await loan.update({
            status: 'kembali',
            tanggal_kembali: tanggal_kembali
        });

        const bookToUpdate = await buku.findByPk(loan.buku_id_buku);
        await bookToUpdate.increment('stok_tersedia', { by: 1 });

        if (tanggal_kembali > jatuh_tempo) {
            const diffTime = Math.abs(tanggal_kembali - jatuh_tempo);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const totalDenda = diffDays * 1000;

            await denda.create({
                peminjaman_fisik_idpeminjaman_fisik: id,
                jumlah_denda: totalDenda,
                status_pembayaran: 'belum_lunas'
            });
        }

        res.redirect('/admin/transactions');

    } catch (err) {
        console.log(err);
        res.redirect('/admin/transactions');
    }
};