const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Display inventory detail view
 * ************************** */
invCont.displayVehicleDetail = async function (req, res, next) {
  const vehicle_id = req.params.inv_id; // This gets the id from the URL
  const data = await invModel.getVehicleDetailsById(vehicle_id);
  const vehicleDetails = await utilities.buildVehicleDetails(data);
  let nav = await utilities.getNav();
  const vehicleMake = data.inv_make;
  const vehicleModel = data.inv_model;
  res.render("./inventory/detail", {
    title: vehicleMake + " " + vehicleModel + " details",
    nav,
    vehicleDetails,
  });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSONData = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};


/* ***************************
 * Build vehicle management view/ inventory management view
 * ************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const managementView = await utilities.buildVehicleManagement();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    managementView,
    classificationSelect,
    errors: null,
  });
};

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add New Classification to the Database
 *  This function handles the POST request for adding a new classification.
 *  It extracts the classification name from the request body,
 *  invokes the model function to insert it into the database,
 *  and then redirects to the inventory management page and displays a success message.
 * ************************** */

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    await invModel.insertNewClassification(classification_name);
    req.flash(
      "notice",
      `New classification ${classification_name} added successfully!`
    );
    res.status(201).redirect("/inv");
  } catch (error) {
    console.error("Error adding new classification:", error);
    req.flash("error", "Error adding new classification.");
    res.status(500).render("inv/classification_add", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventoryItem = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    errors: null,
  });
};

/* ***************************
 *  Add New Inventory Item to the Database
 *  This function handles the POST request for adding a new inventory item.
 *  It retrieves all the necessary data from the request body,
 *  invokes the model function to insert the data into the database,
 *  and then redirects to the inventory management page and displays a success message.
 * ************************** */

invCont.addNewInventoryItem = async function (req, res, next) {
  try {
    const itemData = req.body;
    await invModel.insertNewInventoryItem(itemData);
    req.flash("notice", "New inventory item added successfully!");
    res.status(201).redirect("/inv");
  } catch (error) {
    console.error("Error adding new inventory item:", error);
    req.flash("error", "Error adding new inventory item.");
    res.status(500).render("inv/item_add", {
      title: "Add Inventory Item",
      nav,
      errors: null,
    });
  }
};


module.exports = invCont;