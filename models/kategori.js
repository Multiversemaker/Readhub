const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Kategori = sequelize.define('kategori', {
    idkategori: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    kategori: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'kategori',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idkategori" },
        ]
      },
    ]
  });
  Kategori.associate = (models) => {
    Kategori.hasMany(models.buku, {
      foreignKey: "kategori_idkategori",
      as: "buku"
    });
  };

  return Kategori;
};
