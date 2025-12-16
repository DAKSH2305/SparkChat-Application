// Signup logic: Firebase Authentication + Firestore
const signupForm = document.getElementById('signupForm');
const notificationContainer = document.getElementById('notificationContainer');
const signupBtn = document.getElementById('signupBtn');
const btnText = signupBtn?.querySelector('.btn-text');
const btnLoader = signupBtn?.querySelector('.btn-loader');

signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!username || !email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    // Show loading state
    setLoadingState(true);

    try {
        // Create user with Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Send email verification
        await user.sendEmailVerification();

        // Store user data in Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            username: username,
            email: email,
            emailVerified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            profileComplete: false,
            role: 'user'
        });

        // Store user preferences
        await firebase.firestore().collection('preferences').doc(user.uid).set({
            theme: 'light',
            notifications: true,
            language: 'en'
        });

        showNotification('Account created! Redirecting to login...', 'success');

        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);
        setLoadingState(false);

        let errorText = 'Signup failed. ';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorText = 'Email already registered.';
                break;
            case 'auth/invalid-email':
                errorText = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorText = 'Password is too weak (min 6 characters).';
                break;
            case 'auth/network-request-failed':
                errorText = 'Network error. Please check your connection.';
                break;
            default:
                errorText = error.message || 'Please try again.';
        }

        showNotification(errorText, 'error');
    }
});

// Loading state
function setLoadingState(isLoading) {
    if (!btnText || !btnLoader || !signupBtn) return;
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        signupBtn.disabled = true;
        signupBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        signupBtn.disabled = false;
        signupBtn.style.opacity = '1';
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
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#333'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
