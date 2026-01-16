const isAuthenticated = (req, res, next) => {
  console.log("AUTH CHECK:", req.session.user);

  if (req.session?.user?.id_user) {
    return next();
  }

  req.flash("error", "Silakan login terlebih dahulu.");
  return res.redirect("/login");
};
 module.exports = isAuthenticated;