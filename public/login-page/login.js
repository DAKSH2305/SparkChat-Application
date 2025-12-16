// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const demoButtons = document.querySelectorAll('.demo-btn');
const notificationContainer = document.getElementById('notificationContainer');

// Toggle password visibility
togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Demo account buttons
demoButtons.forEach(button => {
    button.addEventListener('click', function() {
        const email = this.getAttribute('data-email');
        const password = this.getAttribute('data-password');
        
        emailInput.value = email;
        passwordInput.value = password;
        
        showNotification(`Demo account loaded!`, 'info');
    });
});

// FIREBASE LOGIN - Form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberMe.checked;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // FIREBASE AUTHENTICATION
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update last login in Firestore
        await firebase.firestore().collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Get user data from Firestore
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        // Store in localStorage (optional)
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('userEmail', email);
        }
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', userData.username || email.split('@')[0]);
        
        // Success notification
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html'; // or INDEX.html
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Login failed. ';
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'This account has been disabled.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many attempts. Try again later.';
                break;
            default:
                errorMessage = error.message;
        }
        
        showNotification(errorMessage, 'error');
        setLoadingState(false);
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        loginBtn.disabled = true;
        loginBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        loginBtn.disabled = false;
        loginBtn.style.opacity = '1';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'green' : type === 'error' ? 'crimson' : '#333'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.2s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Social login handlers (optional - can be implemented later)
document.querySelector('.google-btn')?.addEventListener('click', function() {
    showNotification('Google login coming soon!', 'info');
});

document.querySelector('.microsoft-btn')?.addEventListener('click', function() {
    showNotification('Microsoft login coming soon!', 'info');
});

// Forgot password handler
document.querySelector('.forgot-password')?.addEventListener('click', function(e) {
    e.preventDefault();
    showNotification('Password reset feature coming soon!', 'info');
});

// Check if user is already logged in with Firebase
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, maybe auto-redirect
        console.log('User already logged in:', user.email);
    } else {
        // No user is signed in
        console.log('No user logged in');
    }
});