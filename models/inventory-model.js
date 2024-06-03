const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get all inventory item inv_id
 * ************************** */

async function getVehicleDetailsById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i WHERE i.inv_id = $1`,
      [vehicle_id]
    );
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleDetailsById error " + error);
  }
}


/* ***************************
 *  Insert a new classification
 * ************************** */
async function insertNewClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1)`;
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("insertNewClassification error:", error);
    return error.message;
  }
}



/* ***************************
 *  Insert a new inventory item
 * ************************** */

async function insertNewInventoryItem(itemData) {
  const sql = `
    INSERT INTO public.inventory (
      inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail,
      inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;

  const values = [
    itemData.inv_make,
    itemData.inv_model,
    itemData.inv_year,
    itemData.inv_description,
    itemData.inv_image,
    itemData.inv_thumbnail,
    itemData.inv_price,
    itemData.inv_miles,
    itemData.inv_color,
    itemData.classification_id,
  ];

  try {
    return await pool.query(sql, values);
  } catch (error) {
    console.error("insertNewInventoryItem Error:", error);
    return error.message;
  }
}

/* ***************************
 *  Update inventory item
 * ************************** */

async function updateInventory(
  itemData
) {

  const sql =
    "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
  const data = [
    itemData.inv_make,
    itemData.inv_model,
    itemData.inv_description,
    itemData.inv_image,
    itemData.inv_thumbnail,
    itemData.inv_price,
    itemData.inv_year,
    itemData.inv_miles,
    itemData.inv_color,
    itemData.classification_id,
    itemData.inv_id,
  ];

  try {
    return await pool.query(sql, data);
  } catch (error) {
    console.error("model error:", error);
    return error.message;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleDetailsById,
  insertNewClassification,
  insertNewInventoryItem,
  updateInventory,
};
