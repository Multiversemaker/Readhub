const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Buku = sequelize.define('buku', {
    id_buku: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    judul: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    penulis: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    stok_tersedia: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    file_path: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    cover_image: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    kategori_idkategori: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'kategori',
        key: 'idkategori'
      }
    },
    tipe_idtipe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipe',
        key: 'idtipe'
      }
    }
  }, {
    sequelize,
    tableName: 'buku',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_buku" },
        ]
      },
      {
        name: "fk_buku_kategori_idx",
        using: "BTREE",
        fields: [
          { name: "kategori_idkategori" },
        ]
      },
      {
        name: "fk_buku_tipe1_idx",
        using: "BTREE",
        fields: [
          { name: "tipe_idtipe" },
        ]
      },
    ]
  });
  Buku.associate = (models) => {
    Buku.belongsTo(models.kategori, {
      foreignKey: "kategori_idkategori",
      as: "kategori"
    });

    Buku.belongsTo(models.tipe, {
      foreignKey: "tipe_idtipe",
      as: "tipe"
    });
  };

  return Buku;

};
