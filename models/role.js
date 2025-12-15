const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const Role = sequelize.define('role', {
    idrole: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'role',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idrole" },
        ]
      },
    ]
  });
  Role.associate = (models) => {
    Role.hasMany(models.user, {
      foreignKey: 'role_idrole',
      as: 'users'
    });
  };
  return Role;
};
