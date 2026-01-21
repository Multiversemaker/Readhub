const express = require("express");
const router = express.Router();
const upload = require("../../Middlewares/upload");
const bookController = require("../../controllers/admin/bookController");



router.get("/books", bookController.getAllBooksadmin);
router.get("/books/add-book", bookController.getCreateBook);
router.get("/books/edit-book/:id", bookController.getEditBook);
router.get("/books/download/:id", bookController.downloadBook);
router.get("/books/view/:id", bookController.viewBook);
router.get("/books/open-local/:id", bookController.openBookLocal);

// CREATE BOOK
router.post("/books", upload.fields([
  { name: "file_buku", maxCount: 1 },
  { name: "cover_image", maxCount: 1 }, // samakan dengan input HTML
]), bookController.createBook);

// UPDATE BOOK
router.put("/books/:id", upload.fields([
  { name: "file_buku", maxCount: 1 },   // samakan dengan input HTML
  { name: "cover_image", maxCount: 1 },
]), bookController.updateBook);

router.delete("/books/:id", bookController.deleteBook);

module.exports = router;