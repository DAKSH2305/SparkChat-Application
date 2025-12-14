// Signup logic: collect username, email, password and store in localStorage (demo behavior)
const signupForm = document.getElementById('signupForm');
const notificationContainer = document.getElementById('notificationContainer');

signupForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    // Basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }

    // Store demo account info in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', username);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPoints', '1000'); // default starting points

    showNotification('Account created! Redirecting to home...', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);
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