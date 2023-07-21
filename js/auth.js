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
  let db = firebase.firestore();
  let loginForm = document.getElementById('login-form');
let registerForm = document.getElementById('register-form');

// Get references to the input fields
let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('password');
let regEmailInput = document.getElementById('reg-email');
let regPasswordInput = document.getElementById('reg-password');

// Get references to the logout button
let logoutBtn = document.getElementById('logout-btn');

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
        window.location.href = 'index.html';
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
        alert('User registered:', userCredential.user);
        window.location.href = 'index.html';
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