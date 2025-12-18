var DataTypes = require("sequelize").DataTypes;
var _buku = require("./buku");
var _denda = require("./denda");
var _kategori = require("./kategori");
var _pembayaran = require("./pembayaran");
var _peminjaman_digital = require("./peminjaman_digital");
var _peminjaman_fisik = require("./peminjaman_fisik");
var _role = require("./role");
var _tipe = require("./tipe");
var _user = require("./user");

function initModels(sequelize) {
  var buku = _buku(sequelize, DataTypes);
  var denda = _denda(sequelize, DataTypes);
  var kategori = _kategori(sequelize, DataTypes);
  var pembayaran = _pembayaran(sequelize, DataTypes);
  var peminjaman_digital = _peminjaman_digital(sequelize, DataTypes);
  var peminjaman_fisik = _peminjaman_fisik(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var tipe = _tipe(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

 
  
  buku.belongsTo(kategori, { as: "kategori", foreignKey: "kategori_idkategori"});
  kategori.hasMany(buku, { as: "buku", foreignKey: "kategori_idkategori"});
  
  buku.belongsTo(tipe, { as: "tipe", foreignKey: "tipe_idtipe"});
  tipe.hasMany(buku, { as: "buku", foreignKey: "tipe_idtipe"});

 
  peminjaman_digital.belongsTo(buku, { as: "buku", foreignKey: "buku_id_buku"});
  buku.hasMany(peminjaman_digital, { as: "peminjaman_digital", foreignKey: "buku_id_buku"});
  
  peminjaman_digital.belongsTo(user, { as: "user", foreignKey: "user_id_user"});
  user.hasMany(peminjaman_digital, { as: "peminjaman_digital", foreignKey: "user_id_user"});

  
  peminjaman_fisik.belongsTo(buku, { as: "buku", foreignKey: "buku_id_buku"});
  buku.hasMany(peminjaman_fisik, { as: "peminjaman_fisik", foreignKey: "buku_id_buku"});
  
  peminjaman_fisik.belongsTo(user, { as: "user", foreignKey: "user_id_user"});
  user.hasMany(peminjaman_fisik, { as: "peminjaman_fisik", foreignKey: "user_id_user"});


  denda.belongsTo(pembayaran, { as: "pembayaran", foreignKey: "pembayaran_idpembayaran"});
  pembayaran.hasMany(denda, { as: "denda", foreignKey: "pembayaran_idpembayaran"});
  
  denda.belongsTo(peminjaman_fisik, { as: "peminjaman_fisik", foreignKey: "peminjaman_fisik_idpeminjaman_fisik"});
  peminjaman_fisik.hasMany(denda, { as: "denda", foreignKey: "peminjaman_fisik_idpeminjaman_fisik"});

 
  user.belongsTo(role, { as: "role", foreignKey: "role_idrole"});
  role.hasMany(user, { as: "user", foreignKey: "role_idrole"});

  return {
    buku,
    denda,
    kategori,
    pembayaran,
    peminjaman_digital,
    peminjaman_fisik,
    role,
    tipe,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
