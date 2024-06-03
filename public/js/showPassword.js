const showPassword = document.querySelector("#showPassword");
const textInfoPw = document.querySelector('#textInfoPw');
showPassword.addEventListener("click", () => {
  const passwordInput = document.querySelector("#account_password");
  const type = passwordInput.getAttribute("type");
  if (type === "password") {
    passwordInput.setAttribute("type", "text");
    textInfoPw.innerHTML = "Hide Password";
  } else {
    passwordInput.setAttribute("type", "password");
    textInfoPw.innerHTML = "Show Password";
  }
});
