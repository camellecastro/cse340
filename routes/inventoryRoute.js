// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities")
const validate = require("../utilities/server-form-validation");
// const regValidate = require("../utilities/client-form-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.displayVehicleDetail)
);

// Route to display the vehicle management view
router.get(
  "/",
  utilities.handleErrors(invController.buildVehicleManagement)
);

// Route to display the form for adding a new classification
router.get(
  "/add-classification/",
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to display the form for adding a new inventory item
router.get(
  "/add-inventory/",
  utilities.handleErrors(invController.buildAddInventoryItem)
);

// Route to handle the submission of the add classification form
router.post(
  "/add-classification/",
  validate.addClassificationRules(),
  validate.checkAddClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

// Route to handle the submission of the add inventory item form
router.post(
  "/add-inventory/",
  validate.addInventoryItemRules(),
  validate.checkAddInventoryItemData,
  utilities.handleErrors(invController.addNewInventoryItem)
);

module.exports = router;