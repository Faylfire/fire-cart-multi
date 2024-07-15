import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'
import {getDatabase, ref, push, onValue, remove, update} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js'
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
        //databaseURL: import.meta.env.VITE_FIREBASE_URL,
        databaseURL: 'https://realtime-database-6334c-default-rtdb.firebaseio.com/'
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
    const logo = document.getElementById('listLogo');

    //Simple login, any login is valid except null
    // Also sets the database to the user login credentials
    if (username !== null && password !== null){

        user = user + "/" + username + "/" + password
        shoppingListInDB = ref(database, user)
    }
    

    function handleAddItem(inputValue){

        const inputValid = validateInput(inputValue)

        if (inputValid.isValid){
            spinIcon()
            push(shoppingListInDB, {'item': inputValue})
            // appendItemToShoppingListEl(inputValue)
            clearInputFieldEl()
        } else {
            wobbleIcon()
            showPopup(inputValid.message)
        }
        inputFieldEl.focus()
    }

    logo.addEventListener("click", function(e) {
        e.preventDefault();
        spinIcon()
        shoppingListEl.classList.toggle("list")
        const specificChildren = shoppingListEl.children; // Selects all children
        console.log(specificChildren.length)
        for (let child of specificChildren) {
            child.classList.toggle("li-listmode-width")
        }

    })

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
        handleAddItem(inputValue)
    })


    onValue(shoppingListInDB, (snapshot)=>{
        
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

        //if the display mode is list mode, then make sure the width is fixed for each item
        const hasListClass = shoppingListEl.classList.contains('list');

        let itemID = item[0]
        let itemValue = item[1]['item']
        let completed = item[1]['completed']
        
        let newEl = document.createElement("li")
        newEl.setAttribute("tabindex",0)
        if (hasListClass) {
            newEl.classList.add("li-listmode-width")
        }
        if (completed){
            newEl.classList.add("completed")
        }
        newEl.textContent = itemValue
        newEl.id=itemID
        
        //Event Listeners for list items single and double click events-----------
        newEl.addEventListener("click", (e)=>{
            e.preventDefault()
            toggleCompleted(e.target)
            setTimeout(() => inputFieldEl.focus(), 100);
        })

        newEl.addEventListener("dblclick", (e)=>{
            e.preventDefault()  
            deleteListEl(newEl.id)
            setTimeout(() => inputFieldEl.focus(), 100);    
        })

        newEl.addEventListener('touchend', () => {
            setTimeout(() => inputFieldEl.focus(), 100);
        });

        newEl.addEventListener("keydown",function(e){
            //Enter Key has same handling as single click event, Sets Item as completed
            //console.log(e.target)  //  
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                toggleCompleted(e.target)
            }

            //Delete and Backspace has same handling as double click event Deletes item from list
            if (e.key === 'Delete' || e.keyCode === 46 || e.key === 'Backspace' || e.keyCode === 8) {
                e.preventDefault();
                deleteListEl(newEl.id)
            }
            inputFieldEl.focus()
        })
        //--------------------------------------------------------------------------
        
        shoppingListEl.append(newEl)
    }

    //List item click handlers
    function deleteListEl(id){
        wobbleIcon()
        const exactLocationOfItemInDB = ref(database, `${user}/${id}`)
        remove(exactLocationOfItemInDB)
    }

    function toggleCompleted(element){
        const exactLocationOfItemInDB = ref(database, `${user}/${element.id}`)
        if (element.classList.contains('completed')){
            update(exactLocationOfItemInDB, {'completed': false})
        } else {
            update(exactLocationOfItemInDB, {'completed': true})
        }
        element.classList.toggle('completed');
    }

    function clearListEl(){
        //Clear the list items
        shoppingListEl.innerHTML = ""
    }
}

//Add a Wobble animation to the logo on sumbit
function wobbleIcon() {
    const logo = document.getElementById('listLogo');
    
    // Add the wobble class to the logo
    logo.classList.add('wobble');
    
    // Remove the class after the animation completes
    setTimeout(() => {
      logo.classList.remove('wobble');
    }, 500); // 1000ms = 1 second
}

//Add a spin animation to the logo on submit
function spinIcon() {
    const icon = document.getElementById('listLogo');
    icon.classList.add('spinfast');
    
    setTimeout(() => {
        icon.classList.remove('spinfast');
    }, 500);// Hide after 3000ms or 3 seconds
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
