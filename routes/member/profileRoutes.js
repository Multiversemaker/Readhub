const express = require("express");
const router = express.Router();

const profileController = require('../../controllers/member/profileController');
const isAuthenticated = require("../../middlewares/isAuthenticated");

router.get('/profile', isAuthenticated, profileController.profilePage);
router.post('/profile/update', profileController.updateProfile);
// router.post('/profile/return-book', profileController.returnBook);

module.exports = router;