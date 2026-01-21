const express = require('express');
const router = express.Router();
const circulationController = require('../../controllers/member/circulationController');

router.get('/circulation', circulationController.index);
router.post(
  "/circulation/:id_buku",
  circulationController.pinjamBuku
);

module.exports = router;