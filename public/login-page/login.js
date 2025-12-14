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

// Demo accounts data
const demoAccounts = {
    student: {
        email: 'student@university.edu',
        password: 'demo123',
        type: 'student'
    },
    professor: {
        email: 'professor@university.edu',
        password: 'demo123',
        type: 'professor'
    }
};

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
        
        showNotification(`Demo ${email.includes('student') ? 'Student' : 'Professor'} account loaded!`, 'info');
    });
});

// Form submission
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
        // Simulate API call
        await simulateLogin(email, password, remember);
        
        // Success
        showNotification('Login successful! Redirecting...', 'success');
        
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        // Redirect to main page after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    } catch (error) {
        showNotification(error.message, 'error');
        setLoadingState(false);
    }
});

// Simulate login API call
function simulateLogin(email, password, remember) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Check against demo accounts
            const isStudentDemo = email === demoAccounts.student.email && password === demoAccounts.student.password;
            const isProfessorDemo = email === demoAccounts.professor.email && password === demoAccounts.professor.password;
            
            if (isStudentDemo || isProfessorDemo) {
                // Store user type for demo purposes
                localStorage.setItem('userType', isStudentDemo ? 'student' : 'professor');
                localStorage.setItem('userName', isStudentDemo ? 'Demo Student' : 'Demo Professor');
                resolve({ success: true, userType: isStudentDemo ? 'student' : 'professor' });
            } else if (email && password) {
                // For any other non-demo credentials, still allow login (demo behavior)
                localStorage.setItem('userType', 'student');
                localStorage.setItem('userName', email.split('@')[0]);
                resolve({ success: true, userType: 'student' });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 1500); // Simulate network delay
    });
}

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
    
    notificationContainer.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const remember = localStorage.getItem('rememberMe');
    
    if (isLoggedIn === 'true' && remember === 'true') {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberMe.checked = true;
        }
    }
}

// Social login handlers
document.querySelector('.google-btn').addEventListener('click', function() {
    showNotification('Google login coming soon!', 'info');
});

document.querySelector('.microsoft-btn').addEventListener('click', function() {
    showNotification('Microsoft login coming soon!', 'info');
});

// Forgot password handler
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    showNotification('Password reset feature coming soon!', 'info');
});

// Initialize login page
checkLoginStatus();

// Add some interactive effects
emailInput.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
});

emailInput.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
});

passwordInput.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
});

passwordInput.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
});