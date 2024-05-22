const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
        list += "</li>";
    });
    list += "</ul>";
    return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li class="vehicle-classifiction">
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
          <div class="image-container-card">
            <img src="${vehicle.inv_thumbnail}" alt="${
        vehicle.inv_make
      } ${vehicle.inv_model} vehicle on CSE Motors">
          </div>
        </a>
        <div class="namePrice">
          <hr class="divider-line">
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};


/* **************************************
* Build Vehicle Details
* ************************************ */
Util.buildVehicleDetails = async function (data) {
  let vehicle = data;
  let vehicleDetails;
  vehicleDetails = `<div class="detail-view">`;
  vehicleDetails += `<h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
  vehicleDetails += `<div class="details-container">`;
  vehicleDetails += `<div class="image-container">`;
  vehicleDetails += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model} Vehicle" width="1000">`;
  vehicleDetails += `</div>`;
  vehicleDetails += `<div class="info-container">`;
  vehicleDetails += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
  vehicleDetails += `<ul class="detail-info-list">`;
  vehicleDetails += `<li class="list-info price"><span class="bolded">Price:</span> $${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_price)}</li>`;
  vehicleDetails += `<li class="list-info"><span class="bolded">Description:</span> ${vehicle.inv_description}</li>`;
  vehicleDetails += `<li class="list-info"><span class="bolded">Color:</span> ${vehicle.inv_color}</li>`;
  vehicleDetails += `<li class="list-info"><span class="bolded">Miles:</span> ${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_miles)}</li>`;

  vehicleDetails += `</ul>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `</div>`;
  return vehicleDetails;
};

/* **************************************
* Build Classification List
* ************************************ */

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" class="classification input">';
  classificationList += "<option>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"${
      classification_id != null && row.classification_id == classification_id
        ? " selected"
        : ""
    }>${row.classification_name}</option>`;
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += `>${row.classification_name}</option>}`;
  });
  classificationList += "</select>";
  return classificationList;
};

/* **************************************
* Build Vehicle Management View
* ************************************ */
Util.buildVehicleManagement = async function (data) {
  let view = `
  <div class="vehicle-management">
    <ul>
      <li>
      <a class="link" href="/inv/add-classification">Add New Classification</a>
      </li>
      <li>
      <a class="link" href="/inv/add-inventory">Add New Inventory</a>
      </li>
    </ul>
  </div>
  `;
  return view;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
 * Check Login
 **************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util;
