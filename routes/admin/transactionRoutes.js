const express = require("express");
const router = express.Router();
const transactionController = require("../../controllers/admin/transactionController");

router.get('/transactions', transactionController.getTransactionAll);
router.get('/transactions/create', transactionController.getCreateTransaction);
router.post('/transactions/store', transactionController.store);
router.post('/transactions/return/:id', transactionController.editTransaction);

module.exports = router;