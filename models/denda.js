const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('denda', {
    iddenda: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    jumlah_denda: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    pembayaran_idpembayaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pembayaran',
        key: 'idpembayaran'
      }
    },
    peminjaman_fisik_idpeminjaman_fisik: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'peminjaman_fisik',
        key: 'idpeminjaman_fisik'
      }
    }
  }, {
    sequelize,
    tableName: 'denda',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "iddenda" },
        ]
      },
      {
        name: "fk_denda_pembayaran1_idx",
        using: "BTREE",
        fields: [
          { name: "pembayaran_idpembayaran" },
        ]
      },
      {
        name: "fk_denda_peminjaman_fisik1_idx",
        using: "BTREE",
        fields: [
          { name: "peminjaman_fisik_idpeminjaman_fisik" },
        ]
      },
    ]
  });
};
