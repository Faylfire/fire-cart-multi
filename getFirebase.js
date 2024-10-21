import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import validateInput from "./tools.js";

//Use the following to calcuate the expiration of the database
//Stricter rules should be used such as authentication check for fully developed applications
//const new_date = new Date("2024-12-24");
//let expiration = new_date.getTime() //1724457600000

//const VITE_FIREBASE_URL=""

export default function getFirebase(username, password) {
  const firebaseConfig = {
    //apiKey: "YOUR_API_KEY",
    //authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    //databaseURL: import.meta.env.VITE_FIREBASE_URL,
    databaseURL: "https://realtime-database-6334c-default-rtdb.firebaseio.com/",
    //projectId: "realtime-database",
    //storageBucket: "YOUR_PROJECT_ID.appspot.com",
    //messagingSenderId: "YOUR_SENDER_ID",
    //appId: "YOUR_APP_ID"
  };

  //Initialized Firebase connection and set the default database reference
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  let user = "shopList";
  let shoppingListInDB = ref(database, user);

  //Set up variables for HTML Element selectors
  const inputFieldEl = document.getElementById("input-field");
  const addButtonEl = document.getElementById("add-button");
  const shoppingListEl = document.getElementById("shopping-list");
  const logo = document.getElementById("listLogo");

  //Simple login, any login is valid except null
  // Also sets the database to the user login credentials
  if (username !== null && password !== null) {
    user = user + "/" + username + "/" + password;
    shoppingListInDB = ref(database, user);
  }

  function handleAddItem(inputValue) {
    const inputValid = validateInput(inputValue);

    if (inputValid.isValid) {
      spinIcon();
      push(shoppingListInDB, { item: inputValue });
      // appendItemToShoppingListEl(inputValue)
      clearInputFieldEl();
    } else {
      wobbleIcon();
      showPopup(inputValid.message);
    }
    inputFieldEl.focus();
  }

  logo.addEventListener("click", function (e) {
    e.preventDefault();
    spinIcon();
    shoppingListEl.classList.toggle("list");
    const specificChildren = shoppingListEl.children; // Selects all children
    console.log(specificChildren.length);
    for (let child of specificChildren) {
      child.classList.toggle("li-listmode-width");
    }
  });

  inputFieldEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
      // Prevent the default action to avoid any side effects (like submitting a form)
      //e.preventDefault();
      // Call the same function that the button's click event calls
      handleAddItem(inputFieldEl.value);
    }
  });

  addButtonEl.addEventListener("click", function (e) {
    e.preventDefault();
    let inputValue = inputFieldEl.value;
    //Add the item to the shopping list
    handleAddItem(inputValue);
  });

  onValue(shoppingListInDB, (snapshot) => {
    /*console.log("onvalue called") snapshot.val() sample 
        [
            [
                "-O1oAH3IaexJ7Jy8-mYp",
                {
                    "item": "$",
                    "completed": true
                }
            ],
            [
                "-O1oAd0yYnx2J5Lm4vHc",
                {
                    "item": "Hamburger"
                }
            ]
        ] */

    if (snapshot.exists()) {
      const items = Object.entries(snapshot.val());
      clearListEl();
      //Sorts items with uncompleted items at the beginning
      const sortedItems = items.sort((a, b) => {
        const aCompleted = a[1].completed || false;
        const bCompleted = b[1].completed || false;
        return aCompleted - bCompleted;
      });
      for (let item of sortedItems) {
        appendItemToShoppingListEl(item);
      }
    } else {
      shoppingListEl.innerHTML = "No items here yet...";
    }
  });

  function clearInputFieldEl() {
    //Clear input element after writing to database
    inputFieldEl.value = "";
  }

  function appendItemToShoppingListEl(item) {
    //shoppingListEl.innerHTML += `<li>${itemValue}</li>`

    //if the display mode is list mode, then make sure the width is fixed for each item
    const hasListClass = shoppingListEl.classList.contains("list");

    let itemID = item[0];
    let itemValue = item[1]["item"];
    let completed = item[1]["completed"];

    let newEl = document.createElement("li");
    newEl.classList.add("swipeable-item");
    newEl.setAttribute("tabindex", 0);
    if (hasListClass) {
      newEl.classList.add("li-listmode-width");
    }
    if (completed) {
      newEl.classList.add("completed");
    }
    newEl.textContent = itemValue;
    newEl.id = itemID;

    //Event Listeners for list items single and double click events-----------
    /*
    newEl.addEventListener("click", (e) => {
      e.preventDefault();
      toggleCompleted(e.target);
      setTimeout(() => inputFieldEl.focus(), 100);
    });
    
    newEl.addEventListener("dblclick", (e) => {
      e.preventDefault();
      deleteListEl(newEl);
      setTimeout(() => inputFieldEl.focus(), 100);
    });
    */

    newEl.addEventListener("keydown", function (e) {
      //Enter Key has same handling as single click event, Sets Item as completed
      //console.log(e.target)  //
      if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
        toggleCompleted(e.target);
      }

      //Delete and Backspace has same handling as double click event Deletes item from list
      if (
        e.key === "Delete" ||
        e.keyCode === 46 ||
        e.key === "Backspace" ||
        e.keyCode === 8
      ) {
        e.preventDefault();
        deleteListEl(newEl);
      }
      inputFieldEl.focus();
    });

    handleSwipe(newEl);
    //--------------------------------------------------------------------------

    shoppingListEl.append(newEl);
  }

  function handleSwipe(element) {
    let startX, startY, currentX, currentY, initialOffset;
    const horizontalThreshold = 50; // Minimum horizontal distance for a swipe
    const verticalThreshold = 4000; // Maximum vertical distance allowed for a swipe
    const clickThreshold = 5; // Maximum horizontal distance allowed for a click more and it's possibly a swipe
    let isSwiping = false;

    function handleStart(e) {
      isSwiping = true;
      console.log("Swiping initiated");
      startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
      initialOffset = element.style.transform
        ? parseInt(
            element.style.transform
              .replace("translateX(", "")
              .replace("px)", "")
          )
        : 0;
      element.style.transition = "none"; // Disable transition for immediate response
    }

    function handleMove(e) {
      if (!isSwiping) return;

      currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
      currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Check if vertical movement exceeds the threshold
      if (Math.abs(deltaY) > verticalThreshold) {
        // Consider this a scroll attempt, cancel the swipe
        handleCancel();
        return;
      }

      const newOffset = initialOffset + deltaX;
      element.style.transform = `translateX(${newOffset}px)`;
    }

    function handleEnd() {
      console.log("Swiping Ended");
      if (!isSwiping) return;
      isSwiping = false;

      element.style.transition = "transform 0.3s ease-out"; // Re-enable transition

      const finalOffset = element.style.transform
        ? parseInt(
            element.style.transform
              .replace("translateX(", "")
              .replace("px)", "")
          )
        : 0;
      const deltaX = finalOffset - initialOffset;
      const deltaY = currentY - startY;
      if (Math.abs(deltaX) < clickThreshold) {
        console.log("This is a click not a swipe");
        handleClick();
      } else if (
        Math.abs(deltaX) > horizontalThreshold &&
        Math.abs(deltaY) <= verticalThreshold
      ) {
        if (deltaX > 0) {
          console.log("Swiped right on", element);
          deleteListEl(element);
          setTimeout(() => inputFieldEl.focus(), 100);
        } else {
          console.log("Swiped left on", element);
          let copyText = element.textContent;
          copyToClipboard(copyText)
            .then(() => {
              console.log("Copy operation completed");
            })
            .catch((error) => {
              console.error("Error in copy operation:", error);
            });
        }
      }

      // Always animate back to original position
      element.style.transform = "translateX(0)";
    }

    function handleCancel() {
      isSwiping = false;
      element.style.transition = "transform 0.3s ease-out";
      element.style.transform = "translateX(0)";
    }

    function handleClick() {
      toggleCompleted(element);
      setTimeout(() => inputFieldEl.focus(), 100);
    }

    // Touch events
    element.addEventListener("touchstart", handleStart);
    element.addEventListener("touchmove", handleMove);
    element.addEventListener("touchend", handleEnd);
    element.addEventListener("touchcancel", handleCancel);

    // Mouse events
    element.addEventListener("mousedown", handleStart);
    element.addEventListener("mousemove", handleMove);
    element.addEventListener("mouseup", handleEnd);
    element.addEventListener("mouseleave", handleCancel);

    // Prevent text selection during swipe
    element.addEventListener("selectstart", (e) => e.preventDefault());
  }

  //List item click handlers
  function deleteListEl(eleToBeDeleted) {
    wobbleIcon();
    let copyText = eleToBeDeleted.textContent;
    copyToClipboard(copyText)
      .then(() => {
        console.log("Copy operation completed");
      })
      .catch((error) => {
        console.error("Error in copy operation:", error);
      });

    const exactLocationOfItemInDB = ref(
      database,
      `${user}/${eleToBeDeleted.id}`
    );
    remove(exactLocationOfItemInDB);
  }

  function toggleCompleted(element) {
    const exactLocationOfItemInDB = ref(database, `${user}/${element.id}`);
    if (element.classList.contains("completed")) {
      update(exactLocationOfItemInDB, { completed: false });
    } else {
      update(exactLocationOfItemInDB, { completed: true });
    }
    element.classList.toggle("completed");
  }

  function clearListEl() {
    //Clear the list items
    shoppingListEl.innerHTML = "";
  }
}

//Add a Wobble animation to the logo on sumbit
function wobbleIcon() {
  const logo = document.getElementById("listLogo");

  // Add the wobble class to the logo
  logo.classList.add("wobble");

  // Remove the class after the animation completes
  setTimeout(() => {
    logo.classList.remove("wobble");
  }, 500); // 1000ms = 1 second
}

//Add a spin animation to the logo on submit
function spinIcon() {
  const icon = document.getElementById("listLogo");
  icon.classList.add("spinfast");

  setTimeout(() => {
    icon.classList.remove("spinfast");
  }, 500); // Hide after 3000ms or 3 seconds
}

//Show then hide popup after some time 3 second default
function showPopup(message) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");

  popupMessage.textContent = message;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000); // Hide after 3000ms or 3 seconds
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}
