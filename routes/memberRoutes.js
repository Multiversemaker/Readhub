const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./member/dashboardRoutes");
const catalogRoutes = require("./member/bookRoutes");
const profileRoutes = require("./member/profileRoutes");
const circulationRoutes = require("./member/circulationRoutes");

router.use("/", dashboardRoutes);
router.use("/", catalogRoutes);
router.use("/",profileRoutes);
router.use("/", circulationRoutes);


module.exports = router;