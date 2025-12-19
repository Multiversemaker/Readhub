const { createBook, updateBook, deleteBook } = require("./book/crudBookController");
const { getCreateBook, getEditBook } = require("./book/formBookController");
const { getAllBooksadmin } = require("./book/listBookController");
const { downloadBook,viewBook,openBookLocal } = require("./book/viewExtendedBookController");
module.exports = {
    getAllBooksadmin,
    getCreateBook,
    getEditBook,
    createBook,
    updateBook,
    deleteBook,
    downloadBook,
    viewBook,
    openBookLocal
};