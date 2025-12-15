const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
const cors = require('cors');

const app = express();
const port = 5000;
const db = require('./models');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("models", path.join(__dirname, "Models"));
app.use(expressLayouts);
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

db.sequelize.authenticate()
  .then(() => console.log("Connected ✔"))
  .catch(err => console.log("Error:", err));

app.use(flash());
app.use((req, res, next) => {
  res.locals.currentuser = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");
  res.locals.info = req.flash("info");
  next();
});

app.use("/", require("./routes/auth"));
app.use("/admin", require("./routes/adminRoutes"));

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`));