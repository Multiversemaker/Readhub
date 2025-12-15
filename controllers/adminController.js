const { createBook, updateBook, deleteBook } = require("./admin/book/crudBookController");
const { getCreateBook, getEditBook } = require("./admin/book/formBookController");
const { getAllBooksadmin } = require("./admin/book/listBookController");

module.exports = {
    createBook,
    updateBook,
    deleteBook,
    getCreateBook,
    getEditBook,
    getAllBooksadmin
}