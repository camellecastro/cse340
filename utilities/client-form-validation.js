/* ******************************
 * Client Side Form validation
 * ***************************** */
function validateField(input, pattern, message) {
  if (!pattern.test(input.value)) {
    alert(message);
    input.focus();
    return false;
  }
  return true;
}
//
function validateAddClassificationForm() {
  const classificationName = document.querySelector("#classification_name");
  const namePattern = /^[A-Za-z0-9]+$/i;

  return validateField(
    classificationName,
    namePattern,
    "Classification name must not contain spaces or special characters."
  );
}
//
function validateAddInventoryItemForm() {
  const invMake = document.querySelector("#inv_make");
  const invModel = document.querySelector("#inv_model");
  const invYear = document.querySelector("#inv_year");
//   const invDescription = document.querySelector("#inv_description");
  const invImage = document.querySelector("#inv_image");
  const invThumbnail = document.querySelector("#inv_thumbnail");
  const invPrice = document.querySelector("#inv_price");
  const invMiles = document.querySelector("#inv_miles");
  const invColor = document.querySelector("#inv_color");
//   const invClassification_id = document.querySelector("#classification_id");

  //   Regex patterns for validation
  const textPattern = /^[A-Za-z0-9 ]{3,}$/;
  const yearPattern = /^\d{4}$/;
  const imagePattern = /\.(png|jpg|jpeg|webp)$/;
  const pricePattern = /^\d+(\.\d{2})?$/;
  const numericPattern = /^\d+$/;

  // Validate each field
  if (
    !validateField(
      invMake,
      textPattern,
      "Make must be at least 3 characters long and can only contain letters, numbers, and spaces."
    ) ||
    !validateField(
      invModel,
      textPattern,
      "Model must be at least 3 characters long and can only contain letters, numbers, and spaces."
    ) ||
    !validateField(invYear, yearPattern, "Year must be four digits.") ||
    !validateField(
      invImage,
      imagePattern,
      "Image must be a png, jpg, jpeg, or webp file format."
    ) ||
    !validateField(
      invThumbnail,
      imagePattern,
      "Thumbnail must be a png, jpg, jpeg, or webp file format."
    ) ||
    !validateField(invPrice, pricePattern, "Please enter a valid price.") ||
    !validateField(invMiles, numericPattern, "Miles must be a number.") ||
    !validateField(
      invColor,
      textPattern,
      "Color can only contain letters and spaces."
    )
  ) {
    return false;
  }

  return true;
}

// Function to display error messages
function displayErrors(errors, errorContainer) {
  errorContainer.innerHTML = "";
  if (errors.length > 0) {
    errors.forEach(error => {
      const errorElement = document.createElement("p");
      errorElement.textContent = error;
      errorContainer.appendChild(errorElement);
    });
    errorContainer.style.display = "block";
  } else {
    errorContainer.style.display = "none";
  }
}

// Event listeners for form submission
document.addEventListener("DOMContentLoaded", () => {
  const addClassificationBtn = document.querySelector(".add-classification-btn");
  if (addClassificationBtn) {
    addClassificationBtn.addEventListener("click", (event) => {
      if (!validateAddClassificationForm()) {
        event.preventDefault();
        console.log("Add Classification Form validation failed.");
      }
    });
  } else {
    console.error("Button with class 'add-classification-btn' not found.");
  }

  const addInventoryBtn = document.querySelector(".add-inventory-btn");
  if (addInventoryBtn) {
    addInventoryBtn.addEventListener("click", (event) => {
      if (!validateAddInventoryItemForm()) {
        event.preventDefault();
        console.log("Add Inventory Item Form validation failed.");
      }
    });
  } else {
    console.error("Button with class 'add-inventory-btn' not found.");
  }
});
