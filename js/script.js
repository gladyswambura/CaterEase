
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
document.addEventListener('DOMContentLoaded', function() {
 const firebaseConfig = {
    apiKey: "AIzaSyDH55BakJobhTOPjsJnPbIwy6s_0qXY-54",
    authDomain: "foodie0001.firebaseapp.com",
    projectId: "foodie0001",
    storageBucket: "foodie0001.appspot.com",
    messagingSenderId: "659245222384",
    appId: "1:659245222384:web:904cef2c60d15072b53535",
    measurementId: "G-RRKXEYY35B"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  firebase.initializeApp(firebaseConfig);
  let db = firebase.firestore();
  let loginForm = document.getElementById('login-logout-btn');
let registerForm = document.getElementById('register-form');


// Get references to the input fields
let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('password');
let regEmailInput = document.getElementById('reg-email');
let regPasswordInput = document.getElementById('reg-password');

// Get references to the logout button
let logoutBtn = document.getElementById('logout-btn');

let addItemForm = document.getElementById('add-item-form');
  let itemsList = document.getElementById('items-list');
  db.collection('items').get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      let itemData = doc.data();
      console.log(doc)
      // Create a new item element
      var newItem = document.createElement('div');
      newItem.className = 'col-lg-6';
      newItem.innerHTML = `
        <div class="d-flex align-items-center">
          <img class="flex-shrink-0 img-fluid rounded" src="img/menu-7.jpg" alt="" style="width: 80px;">
          <div class="w-100 d-flex flex-column text-start ps-4">
            <h5 class="d-flex justify-content-between border-bottom pb-2">
              <span>${itemData.name}</span>
              <p>Kes<span class="text-primary"> ${itemData.price}</span></p>
            </h5>
            <small class="fst-italic">${itemData.details}</small>
            <button typy='submit' class="add-to-cart-btn pay-now-btn btn btn-info" data-item-id="${doc.id}">Buy now</button>
          </div>
        </div>
      `;

      // Append the new item to the items list
      itemsList.appendChild(newItem);
    });
  })
  .catch(function(error) {
    console.error('Error fetching items:', error);
  });


// Add an event listener to the form submit event
addItemForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  // Retrieve the values from the form input fields
  let name = document.getElementById('namefood').value;
  let price = document.getElementById('price').value;
  let code = document.getElementById('code').value;
  let size = document.getElementById('size').value;
  let image1 = document.getElementById('image1').value;
  let image2 = document.getElementById('image2').value;
  let details = document.getElementById('details').value;

  // Create an object with the item details
  let item = {
    name: name,
    price: price,
    size: size,
    code:code,
    image1: image1,
    image2: image2,
    details:details,
  };

  // Add the item to the Firestore collection
  db.collection('items').add(item)
    .then(function(docRef) {
      // Handle successful addition
     alert('Item added to database', docRef.id);

      // Clear the form
      addItemForm.reset();
    })
    .catch(function(error) {
      // Handle errors
      alert('Error adding item:', error);
    });
});
// Add event listeners to the login and registration forms
loginForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  let email = emailInput.value;
  let password = passwordInput.value;

  // Sign in the user with Firebase
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Clear the form
      emailInput.value = '';
      passwordInput.value = '';

      // Handle successful login
      alert('User logged in:', userCredential.user);
    })
    .catch(function(error) {
      // Handle errors
      alert('Login error:', error.message);
    });
});

registerForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  let email = regEmailInput.value;
  let password = regPasswordInput.value;

  // Register the user with Firebase
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Clear the form
      regEmailInput.value = '';
      regPasswordInput.value = '';

      // Handle successful registration
      alert('User registered successfully. Logging you in', userCredential.user);
    })
    .catch(function(error) {
      // Handle errors
      alert('Registration error:', error.message);
    });
});


  
  
// Add event listener to the logout button
logoutBtn.addEventListener('click', function() {
  // Sign out the user
  firebase.auth().signOut()
    .then(function() {
      // Handle successful logout
      alert('User logged out');
    })
    .catch(function(error) {
      // Handle errors
      alert('Logout error:', error.message);
    });
});
let foodList = document.getElementById('food-list');

// Fetch food items from Firebase
db.collection('foodItems').get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      let foodItem = doc.data().name;

      // Create a list item for each food item
      let li = document.createElement('li');
      li.textContent = foodItem;

      // Add the list item to the food list
      foodList.appendChild(li);
    });
  })
  .catch(function(error) {
    console.log('Error fetching food items:', error);
  });

  let cartList = document.getElementById('cart-list');

// Create an empty cart array to store the added items
let cart = [];



// Function to render the cart items dynamically
function renderCartItems() {
  // Clear the cart list before rendering the items
  cartList.innerHTML = '';

  // Loop through the cart array and create a list item for each item
  cart.forEach(function(item) {
    let li = document.createElement('td');
    li.textContent = item.name;

    cartList.appendChild(li);
  });
}

// Function to handle adding an item to the cart
function addItemToCart(item) {
  // Add the item to the cart array
  cart.push(item);

  // Render the updated cart items
  renderCartItems();
}

// Event listener for adding an item to the cart
foodList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    // Get the text content of the clicked food item
    let itemName = event.target.textContent;

    // Create an object representing the item
    let item = {
      name: itemName
      // Add more properties if needed (e.g., price, quantity, etc.)
    };

    // Add the item to the cart
    addItemToCart(item);
  }
});

// Event listener for checkout button
var payNowButtons = document.querySelectorAll('.pay-now-btn');

// Add a click event listener to each pay now button
payNowButtons.forEach(function(button) {
  button.addEventListener('click', function(event) {
    event.preventDefault();

    // Get the item ID from the data attribute
    var itemId = button.dataset.itemId;

    // Retrieve the item details from your existing item data source
    var itemData = getItemDetails(itemId);

    // Create the PayPal order
    createPayPalOrder(itemData);
  });
});

// Function to retrieve item details from your existing item data source
function getItemDetails(itemId) {
  // Implement your logic to retrieve item details based on the itemId
  // Return the item details object (e.g., { name: 'Item name', price: 10.99 })
  // Alternatively, you can store the item details in a local data structure instead of fetching from Firestore
}

// Function to create a PayPal order
function createPayPalOrder(itemData) {
  var itemPrice = itemData.price;

  // Create the order on PayPal
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: itemPrice
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      // Capture the funds from the approved order
      return actions.order.capture().then(function(details) {
        // Process the successful payment
        console.log('Payment successful:', details);
      });
    },
    onError: function(error) {
      // Handle errors during the checkout process
      console.error('Error during checkout:', error);
    }
  }).render();
}

  let loginLogoutBtn = document.getElementById('login-logout-btn');
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is logged in
      loginLogoutBtn.textContent = 'Logout';
      loginLogoutBtn.addEventListener('click', function() {
        // Perform logout action
        firebase.auth().signOut();
      });
    } else {
      // User is logged out
      loginLogoutBtn.textContent = 'Login';
      loginLogoutBtn.addEventListener('click', function() {
        // Perform login action
        // Redirect the user to the login page or display a login form
        // Example: window.location.href = 'login.html';
      });
    }
  });

 });


//  var addToCartButtons = document.querySelectorAll('.col-lg-6');

//  console.log(addToCartButtons)
//  addToCartButtons.forEach(function(button) {
//   button.addEventListener('click', function(event) {
//     event.preventDefault();

//     // Get the item ID from the data attribute
//     var itemId = button.dataset.itemId;

//     // Retrieve the cart items from local storage
//     var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

//     // Check if the item is already in the cart
//     var existingItem = cartItems.find(function(item) {
//       return item.itemId === itemId;
//     });

//     if (existingItem) {
//       // Item already exists in the cart
//       console.log('Item already in cart:', existingItem);
//     } else {
//       // Add the item to the cart
//       var newItem = {
//         itemId: itemId,
//         quantity: 1 // You can adjust the quantity as needed
//       };
//       cartItems.push(newItem);

//       // Save the updated cart items to local storage
//       localStorage.setItem('cartItems', JSON.stringify(cartItems));

//       console.log('Item added to cart:', newItem);
//     }
//   });
// });