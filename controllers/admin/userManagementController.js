const { storeUser,updateUser,deleteUser } = require("./user-management/crudUserManagementController");
const { getAddUser, getEditUser } = require("./user-management/formUserManagementController");
const { getAllUsers } = require("./user-management/listUserManagementController");

module.exports = {
    getAllUsers,
    getAddUser,
    getEditUser,
    storeUser,
    updateUser,
    deleteUser
};