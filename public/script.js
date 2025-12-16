const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
let socket;

const msgBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

let currentUsername = "Guest";
let mySocketId = null;
let isUsernameSet = false;

//emoji picker
const picker = document.getElementById("picker");
const emojiBtn = document.getElementById("emoji-btn");

// Open / Close toggle
let isPickerOpen = false;

emojiBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent immediate close
    isPickerOpen = !isPickerOpen;
    picker.style.display = isPickerOpen ? "block" : "none";
});

// Add emoji to input
picker.addEventListener("emoji-click", (event) => {
    msgInput.value += event.detail.unicode;
});

// Click outside closes the picker
document.addEventListener("click", () => {
    if (isPickerOpen) {
        isPickerOpen = false;
        picker.style.display = "none";
    }
});

// Prevent picker click from closing itself
picker.addEventListener("click", (e) => {
    e.stopPropagation();
});




// Get username from Firebase when authenticated, then connect to WebSocket
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        try {
            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            const userData = userDoc.data();
            currentUsername = userData?.username || user.email.split('@')[0];
        } catch (error) {
            console.error('Error fetching username:', error);
            currentUsername = user.email.split('@')[0];
        }
    } else {
        currentUsername = "Guest" + Math.floor(Math.random() * 1000);
    }
    console.log("Chat username:", currentUsername);
    
    // Now connect to WebSocket with username ready
    initializeWebSocket();
});

// Initialize WebSocket connection
function initializeWebSocket() {
    socket = new WebSocket(`${protocol}//${window.location.host}`);
    
    // Send username when socket opens
    socket.onopen = () => {
        console.log("WebSocket connected, sending username:", currentUsername);
        socket.send(JSON.stringify({
            type: 'SET_USERNAME',
            username: currentUsername
        }));
        isUsernameSet = true;
    };
    
    setupSocketHandlers();
}

// Setup WebSocket message handlers
function setupSocketHandlers() {

    /* ---------------------------
       RECEIVE MESSAGES
    ---------------------------- */
    socket.onmessage = (e) => {
    const data = JSON.parse(e.data);

    // SYSTEM MESSAGE → SET SOCKET ID
    if (data.type === "YOUR_ID") {
        mySocketId = data.id;
        console.log("My Socket ID:", mySocketId);
        return;
    }

    // CHAT MESSAGE
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("msg");

    const isMyMessage = data.socketId === mySocketId;

    if (isMyMessage) {
        msgDiv.classList.add("me");
        msgDiv.innerHTML = `
            <div class="text">You: ${data.text}</div>
            <div class="time">${data.time}</div>
        `;
    } else {
        msgDiv.classList.add("other");
        msgDiv.innerHTML = `
            <div class="text">${data.username || 'Unknown'}: ${data.text}</div>
            <div class="time">${data.time}</div>
        `;
    }

        msgBox.appendChild(msgDiv);
        msgBox.scrollTop = msgBox.scrollHeight;
    };
}

/* ---------------------------
   SEND MESSAGE
---------------------------- */
sendBtn.onclick = () => {
    if (msgInput.value.trim() !== "" && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'CHAT_MESSAGE',
            text: msgInput.value,
            username: currentUsername
        }));
        msgInput.value = "";
    }
};

msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
});
