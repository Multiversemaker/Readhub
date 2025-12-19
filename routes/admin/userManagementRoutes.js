const express = require("express");
const router = express.Router();
const userManagementController = require("../../controllers/admin/userManagementController")

router.get('/user-managements', userManagementController.getAllUsers);
router.get('/user-managements/add', userManagementController.getAddUser);
router.post('/user-managements/store', userManagementController.storeUser);
router.get('/user-managements/edit/:id', userManagementController.getEditUser);
router.post('/user-managements/update/:id', userManagementController.updateUser);
router.get('/user-managements/delete/:id', userManagementController.deleteUser);

module.exports = router;