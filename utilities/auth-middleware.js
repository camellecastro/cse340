const utilities = require(".");
const express = require("express");
const jwt = require("jsonwebtoken")
require("dotenv").config();


async function checkAccountType(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    let nav = await utilities.getNav();
    req.flash("notice", "You must be logged in to access this resource.");
    return res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (
      decoded.account_type !== "Employee" ||
      decoded.account_type !== "Admin"
    ) {
      let nav = await utilities.getNav();
      req.flash(
        "notice",
        "Access denied. You must be an employee or admin to access this resource."
      );
      return res.status(403).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      });
    }
    next(); // allow access if account type is Employee or Admin
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("notice", "Invalid token. Please log in again.");
    return res.status(401).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  }
}

module.exports = checkAccountType;
