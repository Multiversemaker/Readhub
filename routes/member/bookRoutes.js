const express = require("express");
const router = express.Router();
const bookController = require("../../controllers/member/bookController");

router.get("/catalog", bookController.getAllBooksMember);
router.get("/catalog/:id", bookController.getABookDetailMember);

module.exports = router;