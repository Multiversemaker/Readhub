const { createBook, updateBook, deleteBook } = require("./book/crudBookController");
const { getCreateBook, getEditBook } = require("./book/formBookController");
const { getAllBooksadmin } = require("./book/listBookController");

module.exports = {
    getAllBooksadmin,
    getCreateBook,
    getEditBook,
    createBook,
    updateBook,
    deleteBook
};