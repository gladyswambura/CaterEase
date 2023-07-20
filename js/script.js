
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
let globalJsonData = [];
let cartItems = [];

// Get references to the input fields
let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('password');
let regEmailInput = document.getElementById('reg-email');
let regPasswordInput = document.getElementById('reg-password');

// Get references to the logout button
let logoutBtn = document.getElementById('logout-btn');

let addItemForm = document.getElementById('add-item-form');
  let itemsList = document.getElementById('items-list');
   async function getdata (){
    await db.collection('items').get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let itemData =  doc.data();
        itemData.itemId = doc.id
        globalJsonData.push(itemData)
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
              <button typy='submit' class="add-to-cart-btn  btn btn-info" data-item-id="${itemData.itemId}">Add to cart</button>
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
   }
getdata()
var cart = []






document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-to-cart-btn")) {
    // Get the item ID from the data attribute
    const itemId = event.target.dataset.itemId;

    // Check if there is a logged-in user
    const user = firebase.auth().currentUser;
    if (user) {
      // User is logged in, you can access the user's unique identifier using user.uid
      const userId = user.uid;

      // Reference to the cart collection for the current user
      const cartRef = db.collection("users").doc(userId).collection("cart");

      // Check if the item already exists in the user's cart
      cartRef
        .doc(itemId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            alert("Item already in the cart.");
          } else {
            // Add the item to the user's cart collection in Firebase
            cartRef
              .doc(itemId)
              .set({ itemId: itemId })
              .then(() => {
                alert("Item added to cart successfully!");
              })
              .catch((error) => {
                alert("Error adding item to cart:", error);
              });
          }
        })
        .catch((error) => {
          alert("Error checking item in cart:", error);
        });
    } else {
      // User is not logged in, prompt them to log in or redirect to the login page
      alert("Please log in to add items to your cart.");
    }
  }
});





async function getCartItems() {
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;
    const cartRef = db.collection("users").doc(userId).collection("cart");

    try {
      const querySnapshot = await cartRef.get();
      cartItems = [];

      // Fetch the item data using the itemId from the "items" collection
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const itemData = doc.data();
        const itemId = doc.id;

        // Fetch the actual item data from the "items" collection using the itemId
        const itemRef = db.collection("items").doc(itemId);
        const itemSnapshot = await itemRef.get();
        if (itemSnapshot.exists) {
          const item = itemSnapshot.data();

          // Merge the itemData and item objects to get all the fields
          const mergedData = { ...item, ...itemData, itemId: itemId };
          cartItems.push(mergedData);
        }
      }));

      // Call the function to populate the cart table
      populateCartTable();
    } catch (error) {
      console.error("Error retrieving cart items:", error);
    }
  } else {
    console.log("User not logged in. Cannot retrieve cart items.");
  }
}
let cartTotal = 0;

function populateCartTable() {
  // Get the reference to the cart table body element in the HTML
  const cartTableBody = document.getElementById("cart-items-body");

  // Clear the table contents
  cartTableBody.innerHTML = "";

  // Populate the table with cart items
  cartItems.forEach((itemData) => {
    const row = cartTableBody.insertRow();

    // Product Name cell
    const nameCell = row.insertCell();
    nameCell.innerHTML = `
      <div class="product-item">
        <a class="product-thumb" href="#"><img src="${itemData.imageUrl}" alt="Product"></a>
        <div class="product-info">
          <h4 class="product-title"><a href="#">${itemData.name}</a></h4>
          <span><em>Description:</em> ${itemData.details}</span>
        </div>
      </div>
    `;
    cartTotal += parseFloat(itemData.price);
    // Size/Quantity cell
    const sizeQuantityCell = row.insertCell();
    sizeQuantityCell.classList.add("text-center", "text-lg", "text-medium");
    sizeQuantityCell.textContent = `${itemData.size} kgs`;

    // Price cell
    const priceCell = row.insertCell();
    priceCell.classList.add("text-center", "text-lg", "text-medium");
    priceCell.textContent = `$${itemData.price}`;
    const cartTotalElement = document.getElementById("cart-total");
  cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
  const removeButtons = document.querySelectorAll(".remove-from-cart");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const itemId = event.target.dataset.itemId;
      removeItemFromCart(itemId);
    });
  });
    // Remove item cell
    const removeCell = row.insertCell();
    removeCell.classList.add("text-center");
    removeCell.innerHTML = `<a class="remove-from-cart" href="#" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="fa fa-trash"></i></a>`;
  });
}



window.onload = function () {
  getCartItems();
};





function removeItemFromCart(itemId) {
  // Remove the item from the cartItems array
  cartItems = cartItems.filter((item) => item.itemId !== itemId);
  // After removing the item from the array, update the cart table
  populateCartTable();

  // Remove the item from Firestore
  removeItemFromFirestore(itemId);
}



async function removeItemFromFirestore(itemId) {
  const user = firebase.auth().currentUser;
  if (user) {
    const userId = user.uid;
    const cartRef = db.collection("users").doc(userId).collection("cart");

    try {
      await cartRef.doc(itemId).delete();
      alert("Item removed from cart successfully!");
      location.reload();
    } catch (error) {
      alert("Error removing item from cart:", error);
    }
  } else {
    console.log("User not logged in. Cannot remove item from Firestore.");
  }
}





paypal.Buttons({
  createOrder: function (data, actions) {
    // This function is called when the button is clicked and should return an order ID to be used for the payment.
    // Replace 'YOUR_ORDER_ID' with a unique identifier for the order, such as a timestamp or UUID.
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cartTotal.toFixed(2), // Use the actual calculated cart total as the payment amount
          },
        },
      ],
    });
  },
  onApprove: function (data, actions) {
    // This function is called when the user approves the payment.
    // You can perform additional actions here, such as saving the payment details in your database.
    return actions.order.capture().then(function (details) {
      // Successful payment capture.
      alert("Payment completed successfully!", details);
      // Optionally, you can redirect the user to a success page or show a success message.
    });
  },
  onError: function (error) {
    // This function is called when an error occurs during the payment process.
    console.error("Payment error:", error);
    // Optionally, you can show an error message to the user.
  },
}).render("#paypal-button-container");


























function displaycart(a){
  let j=0
  if (cart.length == 0){
    document.getElementById('cartitem').innerHTML = "You don't have any items in your cart"
  }
  else{
    document.getElementById('cartitem').innerHTML = cart.map((items) =>{
      var {name, size, price, details, image1, image2, code} = items 
      return (
        `
        <td>
        <div class="product-item">
            <a class="product-thumb" href="#"><img src="${image1}" alt="Product"></a>
            <div class="product-info">
                <h4 class="product-title"><a href="#">${name}</a></h4><span><em>Size:</em>${size}</span><span><em>Details:</em>${details}</span>
            </div>
        </div>
    </td>
    <td class="text-center">
        <div class="count-input">
            <select class="form-control">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </div>
    </td>
    <td class="text-center text-lg text-medium">${price}</td>
    <td class="text-center"><a class="remove-from-cart" href="#" onclick='delElement("+ (j++) +")' data-toggle="tooltip" title="" data-original-title="Remove item"><i class="fa fa-trash"></i></a></td>
        `
      )
    })
  }
}
  console.log(globalJsonData);

   
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




// // Fetch data from Firestore collection and convert to JSON
// db.collection("items").get()
//   .then(function(querySnapshot) {
//     var jsonData = [];
//     querySnapshot.forEach(function(doc) {
//       // Retrieve document fields as an object
//       var docData = doc.data();

//       // Add document data to the JSON array
//       jsonData.push(docData);
//     });

//     // Assign JSON data to the global variable
//     globalJsonData = jsonData;
//   })
//   .catch(function(error) {
//     console.log("Error getting documents:", error);
//   });

// // Access the global JSON data elsewhere in your code



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