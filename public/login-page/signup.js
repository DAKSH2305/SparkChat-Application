// Signup logic: collect username, email, password and store in localStorage (demo behavior)
const signupForm = document.getElementById('signupForm');
const notificationContainer = document.getElementById('notificationContainer');

signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await user.sendEmailVerification();

        await firebase.firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            username: username,
            email: email,
            emailVerified: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            profileComplete: false,
            role: 'user' // Default role
        });

        await firebase.firestore().collection('preferences').doc(user.uid).set({
            theme: 'light',
            notifications: true,
            language: 'en'
        });
        showNotification('Account created! Redirecting to home...', 'success');

        // Redirect to login after 3 seconds
        setTimeout(() => {
            window.location.href = 'loginpage.html';
        }, 3000);

    }
    catch (error) {
        console.error('Signup error:', error);

        let errorText = 'Signup failed. ';

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorText += 'Email already registered.';
                break;
            case 'auth/invalid-email':
                errorText += 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorText += 'Password is too weak.';
                break;
            case 'auth/network-request-failed':
                errorText += 'Network error. Please check your connection.';
                break;
            default:
                errorText += 'Please try again.';
        }

        if (errorMessage) {
            errorMessage.textContent = errorText;
            errorMessage.style.color = 'red';
        }
    }





    

    // Store demo account info in localStorage
    

    

 
});

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

    setTimeout(() => notification.remove(), 3000);
}