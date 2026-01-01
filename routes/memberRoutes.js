const express = require("express");
const router = express.Router();

const dashboardRoutes = require("./member/dashboardRoutes");
const catalogRoutes = require("./member/bookRoutes");

router.use("/", dashboardRoutes);
router.use("/", catalogRoutes);


module.exports = router;