const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Tipe = sequelize.define('tipe', {
    idtipe: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tipe: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tipe',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idtipe" },
        ]
      },
    ]
  });
  Tipe.associate = (models) => {
    Tipe.hasMany(models.buku, {
      foreignKey: "tipe_idtipe",
      as: "buku"
    });
  };

  return Tipe;
};
