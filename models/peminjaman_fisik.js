const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('peminjaman_fisik', {
    idpeminjaman_fisik: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tanggal_pinjam: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tanggal_jatuh_tempo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tanggal_kembali: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id_user'
      }
    },
    buku_id_buku: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'buku',
        key: 'id_buku'
      }
    }
  }, {
    sequelize,
    tableName: 'peminjaman_fisik',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idpeminjaman_fisik" },
        ]
      },
      {
        name: "fk_peminjaman_fisik_user1_idx",
        using: "BTREE",
        fields: [
          { name: "user_id_user" },
        ]
      },
      {
        name: "fk_peminjaman_fisik_buku1_idx",
        using: "BTREE",
        fields: [
          { name: "buku_id_buku" },
        ]
      },
    ]
  });
};
