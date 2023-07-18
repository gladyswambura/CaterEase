import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

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
  var db = firebase.firestore();


  var loginForm = document.getElementById('login-logout-btn');
var registerForm = document.getElementById('register-form');

// Get references to the input fields
var emailInput = document.getElementById('email');
var passwordInput = document.getElementById('password');
var regEmailInput = document.getElementById('reg-email');
var regPasswordInput = document.getElementById('reg-password');

// Get references to the logout button
var logoutBtn = document.getElementById('logout-btn');

// Add event listeners to the login and registration forms
loginForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  var email = emailInput.value;
  var password = passwordInput.value;

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

  var email = regEmailInput.value;
  var password = regPasswordInput.value;

  // Register the user with Firebase
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Clear the form
      regEmailInput.value = '';
      regPasswordInput.value = '';

      // Handle successful registration
      alert('User registered:', userCredential.user);
    })
    .catch(function(error) {
      // Handle errors
      alert('Registration error:', error.message);
    });
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is logged in, redirect to index.html
      window.location.href = 'index.html';
    } else {
      // User is logged out
      // You can perform any necessary actions here
    }
  });
  

// Add event listener to the logout button
// logoutBtn.addEventListener('click', function() {
//   // Sign out the user
//   firebase.auth().signOut()
//     .then(function() {
//       // Handle successful logout
//       alert('User logged out');
//     })
//     .catch(function(error) {
//       // Handle errors
//       alert('Logout error:', error.message);
//     });
// });
var foodList = document.getElementById('food-list');

// Fetch food items from Firebase
db.collection('foodItems').get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var foodItem = doc.data().name;

      // Create a list item for each food item
      var li = document.createElement('li');
      li.textContent = foodItem;

      // Add the list item to the food list
      foodList.appendChild(li);
    });
  })
  .catch(function(error) {
    console.log('Error fetching food items:', error);
  });

  var cartList = document.getElementById('cart-list');

// Create an empty cart array to store the added items
var cart = [];



// Function to render the cart items dynamically
function renderCartItems() {
  // Clear the cart list before rendering the items
  cartList.innerHTML = '';

  // Loop through the cart array and create a list item for each item
  cart.forEach(function(item) {
    var li = document.createElement('td');
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
    var itemName = event.target.textContent;

    // Create an object representing the item
    var item = {
      name: itemName
      // Add more properties if needed (e.g., price, quantity, etc.)
    };

    // Add the item to the cart
    addItemToCart(item);
  }
});

// Event listener for checkout button
var checkoutBtn = document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click', function() {
  // Perform checkout logic here
});

paypal.Buttons({
    createOrder: function(data, actions) {
      // Create an order with the cart items
      return actions.order.create({
        purchase_units: [{
          description: 'Food Order',
          amount: {
            value: '10.00' // Replace with the total cart amount
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      // Capture the payment
      return actions.order.capture().then(function(details) {
        // Show a success message
        alert('Payment successful! Transaction ID: ' + details.id);
  
        // Clear the cart
        cart = [];
        renderCartItems();
      });
    },
    onError: function(err) {
      // Show an error message
      console.error('Payment error:', err);
    }
  }).render('#checkout-btn');

  var loginLogoutBtn = document.getElementById('login-logout-btn');
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