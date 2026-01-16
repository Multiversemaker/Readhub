const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./member/dashboardRoutes");
const catalogRoutes = require("./member/bookRoutes");
const profileRoutes = require("./member/profileRoutes");

router.use("/", dashboardRoutes);
router.use("/", catalogRoutes);
router.use("/",profileRoutes);


module.exports = router;