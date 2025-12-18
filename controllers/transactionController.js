// Panggil file-file pecahan di folder transaction-management
const { index } = require("./transaction-management/listTransactionController");
const { create } = require("./transaction-management/formTransactionController");
const { store, editTransaction } = require("./transaction-management/crudTransactionController");

module.exports = {
    index,
    create,
    store,
    editTransaction
};