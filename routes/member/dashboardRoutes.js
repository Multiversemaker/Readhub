const express = require("express");
const router = express.Router();

const { homePage } = require("../../controllers/member/dashboardController");

router.get("/dashboard", homePage);

module.exports = router;