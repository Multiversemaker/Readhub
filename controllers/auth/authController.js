const { login, register } = require("./system/crudAuthController");
const { redirectToLogin, loginPage, registerPage } = require("./system/formAuthController");

module.exports = {
    redirectToLogin,
    loginPage,
    login,
    registerPage,
    register,
};