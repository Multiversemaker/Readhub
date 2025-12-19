const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Pembayaran = sequelize.define('pembayaran', {
    idpembayaran: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    jenis_pembayaran: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pembayaran',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idpembayaran" },
        ]
      },
    ]
  });
  Pembayaran.associate = (models) => {
    // Relasi ke denda
    Pembayaran.hasMany(models.denda, {
      foreignKey: 'pembayaran_idpembayaran',
      as: 'denda'
    });
  };

  return Pembayaran;
};
