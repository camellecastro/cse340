const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model")
const validate = {};
/* ******************************
 * Server Side Form validation
 * ***************************** */

/* ******************************
 * Add Classification Validation Form Rules
 * ***************************** */
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Classification name must be alphabetic characters only."),
  ];
};

/* ******************************
 * Add Inventory Item Validation Form Rules
 * ***************************** */

validate.addInventoryItemRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required")
      .matches(/[A-Za-z0-9 ]+/i) // regex to allow letters, numbers, and spaces
      .withMessage("Make can only contain letters, numbers and spaces."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model is required")
      .matches(/[A-Za-z0-9 ]+/i) // regex to allow letters, numbers, and spaces
      .withMessage("Model can only contain letters, numbers and spaces."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year is required")
      .isNumeric()
      .withMessage("Year can only contain numbers."),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required"),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image is required")
      .matches(/\.(png|jpg|jpeg|webp)$/)
      .withMessage("Image must be a png, jpg, jpeg, or webp file format."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail is required")
      .matches(/\.(png|jpg|jpeg|webp)$/)
      .withMessage("Thumbnail must be a png, jpg, jpeg, or webp file format."),
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Price is required")
      .isFloat({ min: 0.0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Miles is required")
      .isNumeric()
      .withMessage("Miles must be a number."),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required")
      .matches(/[A-Za-z ]+/)
      .withMessage("Color can only contain letters and spaces."),
    body("classification_id")
      .trim()
      .isNumeric()
      .withMessage("Classification ID is required and must be numeric."),
  ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */

validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to add inventory item
 * ***************************** */

validate.checkAddInventoryItemData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      errors,
      title: "Edit Vehicle Details",
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList,
    });
    return;
  }
  next();
}; 


/* ******************************
 * Check data and return errors or continue to update inventory item
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Vehicle",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classificationList,
    });
    return;
  }
  next();
}; 

module.exports = validate;
