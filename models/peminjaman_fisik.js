const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const PeminjamanFisik = sequelize.define('peminjaman_fisik', {
    idpeminjaman_fisik: {
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
  PeminjamanFisik.associate = (models) => {
    // Relasi ke buku
    PeminjamanFisik.belongsTo(models.buku, {
      foreignKey: 'buku_id_buku',
      as: 'buku'
    });

    // Relasi ke user
    PeminjamanFisik.belongsTo(models.user, {
      foreignKey: 'user_id_user',
      as: 'user'
    });

    // Relasi ke denda
    PeminjamanFisik.hasMany(models.denda, {
      foreignKey: 'peminjaman_fisik_idpeminjaman_fisik',
      as: 'denda'
    });
  };

  return PeminjamanFisik;
};
