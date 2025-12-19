const express = require("express");
const router = express.Router();
const upload = require("../../Middlewares/upload");
const bookController = require("../../controllers/admin/bookController");

router.get("/books", bookController.getAllBooksadmin);
router.get("/books/add-book", bookController.getCreateBook);
router.get("/books/edit-book/:judul", bookController.getEditBook);

router.post("/books", upload.fields([
  { name: "file_buku", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]), bookController.createBook);


router.put("/books/:judul",upload.fields([
    { name: "file_path", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
]), bookController.updateBook);

router.delete("/books/:judul", bookController.deleteBook);
router.get("/books/download/:id", bookController.downloadBook);
router.get("/books/view/:id", bookController.viewBook);
router.get("/books/open-local/:id", bookController.openBookLocal);

module.exports = router;