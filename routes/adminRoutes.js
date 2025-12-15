const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./admin/dashboardRoutes");
const bookRoutes = require("./admin/bookRoutes");

router.use("/", dashboardRoutes);
router.use("/", bookRoutes);

module.exports = router;