const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('peminjaman_digital', {
    idpeminjaman_digital: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tanggal_akses: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    tanggal_kadaluwarsa: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    buku_id_buku: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'buku',
        key: 'id_buku'
      }
    },
    user_id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id_user'
      }
    }
  }, {
    sequelize,
    tableName: 'peminjaman_digital',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idpeminjaman_digital" },
        ]
      },
      {
        name: "fk_peminjaman_digital_buku1_idx",
        using: "BTREE",
        fields: [
          { name: "buku_id_buku" },
        ]
      },
      {
        name: "fk_peminjaman_digital_user1_idx",
        using: "BTREE",
        fields: [
          { name: "user_id_user" },
        ]
      },
    ]
  });
};
