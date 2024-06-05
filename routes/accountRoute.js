// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/* ***********************
 * Deliver Account Management View After Logging in
 *************************/
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagementView)
);

/* ***********************
 * Deliver Registration View
 *************************/
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* ***********************
 * Enable/Create Registration
 *************************/
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ***********************
 * Deliver Log in View
 *************************/
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
);

/* ***********************
 * Process the log in attempt
 *************************/
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ***********************
 * Deliver Update Account View
 *************************/
router.get(
  "/edit/:account_id",
  utilities.handleErrors(accountController.buildUpdateAccountView)
);

/* ***********************
 * Process account info update
 *************************/
router.post(
  "/accountupdate",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

/* ***********************
 * Process password info update
 *************************/
router.post(
  "/updatepassword",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccountPassword)
);

/* ***********************
 * Logout Process
 *************************/
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout));

module.exports = router;
