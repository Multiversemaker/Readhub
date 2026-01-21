const {
  peminjaman_fisik,
  peminjaman_digital,
  user,
  buku
} = require("../../../models");

exports.getTransactionAll = async (req, res) => {
  try {

    const fisik = await peminjaman_fisik.findAll({
      include: [
        { model: user, as: "user" },
        { model: buku, as: "buku" }
      ]
    });

    
    const digital = await peminjaman_digital.findAll({
      include: [
        { model: user, as: "user" },
        { model: buku, as: "buku" }
      ]
    });

  
    const transaksiFisik = fisik.map(t => ({
      id: t.idpeminjaman_fisik,
      tipe: "fisik",
      user: t.user,
      buku: t.buku,
      tanggal_pinjam: t.tanggal_pinjam,
      
     
      jatuh_tempo: t.tanggal_jatuh_tempo, 
      
      status: t.status,
      tanggal_kembali: t.tanggal_kembali
    }));

    const transaksiDigital = digital.map(t => ({
      id: t.idpeminjaman_digital,
      tipe: "digital",
      user: t.user,
      buku: t.buku,
      tanggal_pinjam: t.tanggal_akses,
      
      
      jatuh_tempo: t.tanggal_kedaluwarsa, 

      status: t.status,
      tanggal_kembali: null
    }));

   
    const transactions = [...transaksiFisik, ...transaksiDigital]
      .sort((a, b) => new Date(b.tanggal_pinjam) - new Date(a.tanggal_pinjam));

    res.render("admin/pages/transaction", {
      layout: "admin/layouts/transaction/transaction-layout",
      transactions,
      title: "Manajemen Transaksi"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error mengambil data transaksi");
  }
};
