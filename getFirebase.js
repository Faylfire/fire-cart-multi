import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'
import {getDatabase, ref, push, onValue, remove} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js'
import validateInput from './tools.js';


//Use the following to calcuate the expiration of the database
//Stricter rules should be used such as authentication check for fully developed applications
//const new_date = new Date("2024-08-24");
//let expiration = new_date.getTime() //1724457600000

//const VITE_FIREBASE_URL=""


export default function getFirebase(username, password){

    const firebaseConfig = {
        //apiKey: "YOUR_API_KEY",
        //authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        databaseURL: import.meta.env.VITE_FIREBASE_URL,
        //projectId: "realtime-database",
        //storageBucket: "YOUR_PROJECT_ID.appspot.com",
        //messagingSenderId: "YOUR_SENDER_ID",
        //appId: "YOUR_APP_ID"
    };


    //Initialized Firebase connection and set the default database reference
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app)
    let user = "shopList"
    let shoppingListInDB = ref(database, user)

    //Set up variables for HTML Element selectors 
    const inputFieldEl = document.getElementById("input-field")
    const addButtonEl = document.getElementById("add-button")
    const shoppingListEl = document.getElementById("shopping-list")

    //Simple login, any login is valid except null
    // Also sets the database to the user login credentials
    if (username !== null && password !== null){

        user = user + "/" + username + "/" + passwordw
        shoppingListInDB = ref(database, user)
    }
    

    function handleAddItem(inputValue){

        const inputValid = validateInput(inputValue)

        if (inputValid.isValid){
            push(shoppingListInDB, inputValue)
            // appendItemToShoppingListEl(inputValue)
            clearInputFieldEl()
        } else {
            showPopup(inputValid.message)
        }
        inputFieldEl.focus()
    }

    inputFieldEl.addEventListener("keydown",function(e){
        if (e.key === 'Enter' || e.keyCode === 13) {
            // Prevent the default action to avoid any side effects (like submitting a form)
            //e.preventDefault();
            // Call the same function that the button's click event calls
            handleAddItem(inputFieldEl.value);
        }
    })

    addButtonEl.addEventListener("click", function(e) {
        e.preventDefault();
        let inputValue = inputFieldEl.value
        //Add the item to the shopping list
        console.log('addwobble')
        addItemWobble()
        handleAddItem(inputValue)

    })


    onValue(shoppingListInDB, (snapshot)=>{
        
        //console.log("onvalue called")
        if (snapshot.exists()){
            const items = Object.entries(snapshot.val())
            clearListEl()
            for (let item of items){
                appendItemToShoppingListEl(item)
            } 
        }else {
            shoppingListEl.innerHTML = "No items here yet..."
        }

    })

    function clearInputFieldEl() {
        //Clear input element after writing to database
        inputFieldEl.value = ""
    }

    function appendItemToShoppingListEl(item) {
        //shoppingListEl.innerHTML += `<li>${itemValue}</li>`
        let itemID = item[0]
        let itemValue = item[1]
        
        let newEl = document.createElement("li")
        newEl.setAttribute("tabindex",0)
        newEl.textContent = itemValue
        newEl.id=itemID
        
        newEl.addEventListener("click", (e)=>{
            e.preventDefault()

            handleListItemClick(newEl.id)
        })

        newEl.addEventListener("keydown",function(e){
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                handleListItemClick(newEl.id)
            }
        })
        
        shoppingListEl.append(newEl)
    }

    function handleListItemClick(id){
        let exactLocationOfItemInDB = ref(database, `${user}/${id}`)
        remove(exactLocationOfItemInDB)
    }

    function clearListEl(){

        //Clear the list items 
        shoppingListEl.innerHTML = ""
    }
}

//Add a Wobble animation to the logo on sumbit
function addItemWobble() {
    const logo = document.getElementById('listLogo');
    
    // Add the wobble class to the logo
    logo.classList.add('wobble');
    
    // Remove the class after the animation completes
    setTimeout(() => {
      logo.classList.remove('wobble');
    }, 500); // 1000ms = 1 second
}

//Show then hide popup after some time 3 second default
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popupMessage');
    
    popupMessage.textContent = message;
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000); // Hide after 3000ms or 3 seconds
}
