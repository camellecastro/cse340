// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities")
const validate = require("../utilities/server-form-validation");
const checkAccountType = require("../utilities/auth-middleware");
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
  checkAccountType,
  utilities.handleErrors(invController.buildVehicleManagement)
);

// Route to display the form for adding a new classification
router.get(
  "/add-classification/",
  checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to display the form for adding a new inventory item
router.get(
  "/add-inventory/",
  checkAccountType,
  utilities.handleErrors(invController.buildAddInventoryItem)
);

// Route to handle the submission of the add classification form
router.post(
  "/add-classification/",
  checkAccountType,
  validate.addClassificationRules(),
  validate.checkAddClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

// Route to handle the submission of the add inventory item form
router.post(
  "/add-inventory/",
  checkAccountType,
  validate.addInventoryItemRules(),
  validate.checkAddInventoryItemData,
  utilities.handleErrors(invController.addNewInventoryItem)
);

// 
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSONData)
)

// Route to display the edit inventory item form
router.get(
  "/edit/:inv_id",
  checkAccountType,
  utilities.handleErrors(invController.buildEditInventoryView)
);

// Route to handle the submission of the update inventory vehicle form
router.post(
  "/update/",
  checkAccountType,
  validate.addInventoryItemRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

/* ***************************
 *  Deliver the delete confirmation view
 * ************************** */
router.get(
  "/delete/:inv_id",
  checkAccountType,
  utilities.handleErrors(invController.deleteInventoryView)
);

/* ***************************
 *  Process the delete request
 * ************************** */
router.post(
  "/delete/",
  checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;