const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ***********************
 * Deliver Registration View
 *************************/
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
*  Process Login Request
* *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error("Access Denied")
  }
}

/* ***********************
 * Build Account Management View
 *************************/
async function buildAccountManagementView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ***********************
 * Build Update Account View
 *************************/
async function buildUpdateAccountView(req, res, next) {
  let nav = await utilities.getNav();
  let account = res.locals.accountData;
  const account_id = parseInt(req.params.account_id);
  res.render("account/update-account", {
    title: "Edit Account Information",
    nav,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account_id,
  });
}

/* ***********************
 * Process Account Info Update
 *************************/
async function updateAccountInfo(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body
  
  const updateResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id)
  
  if (updateResult) {
    res.clearCookie("jwt")
    const accountData = await accountModel.getAccountById(account_id)
    // use .env secret key to sign, expires in one hour
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    // can only be passed through http requests, maximum age is 1 hour
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash("success", `Congratulations, ${account_firstname} you\'ve succesfully updated your account info.`)
    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors:null,
      account_firstname,
      account_lastname,
      account_email,
    })
  } else {
    req.flash("error", "Sorry, the update failed.")
    // render account edit view again
    res.status(501).render("account/update-account", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    })
  }
}

/* ***********************
 * Process Account Info Update
 *************************/
async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing new account password."
    );
    res.status(500).render("account/update-account", {
      title: "Edit Account Information",
      nav,
      errors: null,
    });
  }

  const updateResult = await accountModel.updateAccountPassword(
    hashedPassword, account_id
  );

  if (updateResult) {
    const account = await accountModel.getAccountById(account_id)
    req.flash("success", `Congratulations, ${account_firstname} you\'ve successfully updated your password.`)
    res.status(201).render(
      "account/account-management", {
        title: "Account Managment",
        nav,
        errors: null,
        account_firstname: account.account_firstname
      }
    )
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update-account", {
      title: "Edit Account Information",
      nav,
      errors: null,
    });
  }
}

/* ***********************
 * Account Logout
 *************************/
async function accountLogout(req, res, next) {
  res.clearCookie('jwt')
  res.redirect("/")
  return
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  buildUpdateAccountView,
  updateAccountInfo,
  updateAccountPassword,
  accountLogout,
};