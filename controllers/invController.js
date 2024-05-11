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

module.exports = invCont;