const express = require("express");
const router = express.Router();

const reportController = require("../../controllers/admin/reportController");

router.get('/reports', reportController.getReport);
router.post('/reports/filter', reportController.filterReport);

module.exports = router;