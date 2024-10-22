import getFirebase from "./getFirebase.js";
import validateInput from "./tools.js";

//HTML 'Component' for displaying List of shopping items
const newDiv = document.createElement("div");
newDiv.id = "list-container";
newDiv.className = "container";
const itemsListHTML = `<div class="image-container"><img id='listLogo' draggable="false" src="assets/astro.png" alt="Logo: Cute Astronaut with Glasses with Space and Blue Planet as Backdrop"></div>
                                <label for="input-field" class="visually-hidden">Add an item</label>
                                <input type="text" maxlength='72' id="input-field" placeholder="Add an item...">
                                <button id="add-button">Add to list</button>
                                <ul id="shopping-list">
                                <li style="display: none"></li>
                                Loading List...
                                </ul>
                                <div id="popup">
                                    <p id="popupMessage"></p>
                                </div>`;

//Check for existing saved login credentials, simple naive implementation using local storage
const localAuth = localStorage.getItem("fireCartAuth");
const userAuth = JSON.parse(localAuth);

if (userAuth) {
  onSuccessfulLogin(userAuth.username, userAuth.password);
}

//Hides Login form and retreives todo list from Firebase
function onSuccessfulLogin(username, password) {
  document.getElementById("login-container").style.display = "none";
  newDiv.innerHTML = itemsListHTML;
  newDiv.style.display = "block";
  document.body.appendChild(newDiv);
  getFirebase(username, password);
  //addLogout()
}

//Event Harndler for Login Submission
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const saveLogin = document.getElementById("myCheckbox").checked;

  const userValid = validateInput(username);
  const passValid = validateInput(password);

  // Simple authentication (replace with server-side authentication in real applications)
  if (userValid.isValid && passValid.isValid) {
    document.getElementById("message").textContent = "Login successful!";
    document.getElementById("message").style.fontWeight = "bold";
    document.getElementById("message").style.color = "green";

    if (saveLogin) {
      localStorage.setItem(
        "fireCartAuth",
        JSON.stringify({ username: username, password: password })
      );
    }
    spinLogo();
    // Hide login container and show welcome container
    setTimeout(function () {
      onSuccessfulLogin(username, password);
    }, 1000); // Show welcome message after 1 seconds
  } else {
    document.getElementById("message").textContent =
      "Invalid username or password.";
    document.getElementById("message").style.fontWeight = "bold";
    document.getElementById("message").style.color = "red";
  }
});

//A wobble function
function wobbleLogo() {
  const logo = document.getElementById("logo");

  // Add the wobble class
  logo.classList.add("wobble");

  // Remove the class after the animation completes
  setTimeout(() => {
    logo.classList.remove("wobble");
  }, 1000); // 1000ms = 1 second
}

//Add a spin animation to the logo on submit
function spinLogo() {
  const icon = document.getElementById("logo");
  icon.classList.add("spinning");

  setTimeout(() => {
    icon.classList.remove("spinning");
  }, 1000); // Hide after 3000ms or 3 seconds
}

//This adds a listener to the logout button (when there is one)
function addLogout() {
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      // Hide welcome container and show login container
      document.getElementById("welcomeContainer").style.display = "none";
      document.getElementById("loginContainer").style.display = "block";
      localStorage.removeItem("fireCartAuth");

      // Clear the form fields
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      document.getElementById("message").textContent = "";
      newDiv.innerHTML = "";
    });
}
