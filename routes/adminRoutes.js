const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./admin/dashboardRoutes");
const bookRoutes = require("./admin/bookRoutes");
const transactionRoutes = require("./admin/transactionRoutes");
const reportRoutes = require("./admin/reportRoutes");
const userManagementRoutes = require("./admin/userManagementRoutes")

router.use("/", dashboardRoutes);
router.use("/", bookRoutes);
router.use("/", userManagementRoutes);
router.use("/", transactionRoutes);
router.use("/", reportRoutes);

module.exports = router;