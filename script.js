// =============================================
// SCRIPT.JS — Auth System Logic
// Handles: Signup, Login, Dashboard, Logout
// Uses localStorage to save user data
// (same concept as file handling in C++)
// =============================================


// ── WHICH PAGE AM I ON? ───────────────────────
// Check the URL to know which functions to run

var currentPage = window.location.pathname;


// ── SIGNUP PAGE LOGIC ────────────────────────

function handleSignup() {

  // get values from all input fields
  var name     = document.getElementById('fullname').value.trim();
  var email    = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value.trim();
  var confirm  = document.getElementById('confirm-password').value.trim();

  // clear all old error messages first
  document.getElementById('name-error').textContent    = '';
  document.getElementById('email-error').textContent   = '';
  document.getElementById('pass-error').textContent    = '';
  document.getElementById('confirm-error').textContent = '';
  document.getElementById('success-msg').textContent   = '';

  // ── VALIDATION — check each field ──

  // check 1: name should not be empty
  if (name === '') {
    document.getElementById('name-error').textContent = 'Please enter your full name.';
    return;
  }

  // check 2: name should be at least 3 characters
  if (name.length < 3) {
    document.getElementById('name-error').textContent = 'Name must be at least 3 characters.';
    return;
  }

  // check 3: email should not be empty
  if (email === '') {
    document.getElementById('email-error').textContent = 'Please enter your email address.';
    return;
  }

  // check 4: email must have @ and a dot — basic format check
  if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    document.getElementById('email-error').textContent = 'Please enter a valid email address.';
    return;
  }

  // check 5: check if email is already registered
  var existingUser = localStorage.getItem('user_' + email);
  if (existingUser !== null) {
    document.getElementById('email-error').textContent = 'This email is already registered. Try logging in.';
    return;
  }

  // check 6: password should not be empty
  if (password === '') {
    document.getElementById('pass-error').textContent = 'Please enter a password.';
    return;
  }

  // check 7: password must be at least 6 characters
  if (password.length < 6) {
    document.getElementById('pass-error').textContent = 'Password must be at least 6 characters.';
    return;
  }

  // check 8: confirm password must match
  if (password !== confirm) {
    document.getElementById('confirm-error').textContent = 'Passwords do not match. Please check.';
    return;
  }

  // ── ALL CHECKS PASSED — save user to localStorage ──

  // create a user object (like a struct in C++)
  var newUser = {
    name: name,
    email: email,
    password: password,
    createdOn: new Date().toLocaleDateString()
  };

  // save to localStorage with email as the key
  // this is like writing to a file in C++
  localStorage.setItem('user_' + email, JSON.stringify(newUser));

  // show success message
  document.getElementById('success-msg').textContent = '✅ Account created successfully! Redirecting to login...';

  // redirect to login page after 2 seconds
  setTimeout(function() {
    window.location.href = 'login.html';
  }, 2000);
}


// ── LOGIN PAGE LOGIC ─────────────────────────

function handleLogin() {

  // get values from input fields
  var email    = document.getElementById('email').value.trim();
  var password = document.getElementById('password').value.trim();

  // clear old error messages
  document.getElementById('email-error').textContent  = '';
  document.getElementById('pass-error').textContent   = '';
  document.getElementById('login-error').textContent  = '';
  document.getElementById('success-msg').textContent  = '';

  // check 1: email not empty
  if (email === '') {
    document.getElementById('email-error').textContent = 'Please enter your email.';
    return;
  }

  // check 2: valid email format
  if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    document.getElementById('email-error').textContent = 'Please enter a valid email.';
    return;
  }

  // check 3: password not empty
  if (password === '') {
    document.getElementById('pass-error').textContent = 'Please enter your password.';
    return;
  }

  // ── CHECK IF USER EXISTS IN LOCALSTORAGE ──
  var storedData = localStorage.getItem('user_' + email);

  // if no user found with this email
  if (storedData === null) {
    document.getElementById('login-error').textContent = '❌ No account found with this email. Please sign up.';
    return;
  }

  // parse the stored user object
  var storedUser = JSON.parse(storedData);

  // check if password matches
  if (storedUser.password !== password) {
    document.getElementById('login-error').textContent = '❌ Wrong password. Please try again.';
    return;
  }

  // ── LOGIN SUCCESSFUL ──

  // save logged in user info in sessionStorage
  // sessionStorage clears when browser tab is closed (like RAM in C++)
  sessionStorage.setItem('loggedInUser', JSON.stringify(storedUser));

  // show success message
  document.getElementById('success-msg').textContent = '✅ Login successful! Redirecting...';

  // go to dashboard after 1.5 seconds
  setTimeout(function() {
    window.location.href = 'dashboard.html';
  }, 1500);
}


// ── DASHBOARD PAGE LOGIC ─────────────────────

// this runs when dashboard page loads
function loadDashboard() {

  // get logged in user from sessionStorage
  var userData = sessionStorage.getItem('loggedInUser');

  // if no user is logged in — send back to login
  if (userData === null) {
    window.location.href = 'login.html';
    return;
  }

  // parse user data
  var user = JSON.parse(userData);

  // show user's name and email on dashboard
  document.getElementById('welcome-name').textContent = 'Welcome, ' + user.name + '! 👋';
  document.getElementById('welcome-email').textContent = user.email;
  document.getElementById('member-since').textContent = user.createdOn;

  // show current login time
  var now = new Date();
  document.getElementById('login-time').textContent = 'Last login: ' + now.toLocaleString();
}


// ── LOGOUT LOGIC ─────────────────────────────

function handleLogout() {
  // remove logged in user from sessionStorage
  sessionStorage.removeItem('loggedInUser');

  // redirect to login page
  window.location.href = 'login.html';
}


// ── PASSWORD STRENGTH CHECKER ─────────────────
// runs every time user types in password field

// we check if signup page is loaded before adding this listener
var passInput = document.getElementById('password');
if (passInput) {
  passInput.addEventListener('input', function() {
    var pass = passInput.value;
    var fill = document.getElementById('strength-fill');
    var text = document.getElementById('strength-text');

    // only show on signup page where strength bar exists
    if (!fill) return;

    // check strength based on length and character types
    var score = 0;

    if (pass.length >= 6)  score = score + 1;  // at least 6 chars
    if (pass.length >= 10) score = score + 1;  // at least 10 chars

    // check if has uppercase letter
    if (/[A-Z]/.test(pass)) score = score + 1;

    // check if has a number
    if (/[0-9]/.test(pass)) score = score + 1;

    // check if has special character
    if (/[!@#$%^&*]/.test(pass)) score = score + 1;

    // show colour based on score
    if (pass.length === 0) {
      fill.style.width = '0%';
      text.textContent = '';
    } else if (score <= 1) {
      fill.style.width = '25%';
      fill.style.backgroundColor = '#e53e3e';
      text.textContent = 'Weak password';
    } else if (score === 2) {
      fill.style.width = '50%';
      fill.style.backgroundColor = '#ed8936';
      text.textContent = 'Fair password';
    } else if (score === 3) {
      fill.style.width = '75%';
      fill.style.backgroundColor = '#ecc94b';
      text.textContent = 'Good password';
    } else {
      fill.style.width = '100%';
      fill.style.backgroundColor = '#38a169';
      text.textContent = 'Strong password ✅';
    }
  });
}


// ── AUTO RUN DASHBOARD LOADER ─────────────────
// if we are on dashboard page, load user data

if (window.location.pathname.indexOf('dashboard') !== -1) {
  loadDashboard();
}
