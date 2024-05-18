// Needed Resources
const express = require("express");
const router = new express.Router();
const testController = require("../controllers/testController");
const utilities = require("../utilities");

// Build a test route that throws a 500 error
router.get("/", utilities.handleErrors(testController.triggerError));

module.exports = router;
