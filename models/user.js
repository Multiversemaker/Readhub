const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id_user: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    tanggal_daftar: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role_idrole: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'idrole'
      }
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_user" },
        ]
      },
      {
        name: "fk_user_role1_idx",
        using: "BTREE",
        fields: [
          { name: "role_idrole" },
        ]
      },
    ]
  });
  User.associate = (models) => {
    User.belongsTo(models.role, {
      foreignKey: 'role_idrole',
      as: 'role'
    });
  };
  return User;
};
