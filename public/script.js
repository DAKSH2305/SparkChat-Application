// script.js

const socket = new WebSocket("ws://localhost:3000");
const msgBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// Emoji picker
// ---------------------
// EMOJI PICKER CODE (FIXED)
// ---------------------
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

// Display incoming messages
socket.onmessage = (event) => {
    const div = document.createElement("div");
    div.className = "msg";
    div.textContent = event.data;
    msgBox.appendChild(div);
};

// Send message
sendBtn.onclick = () => {
    if (msgInput.value.trim() !== "") {
        socket.send(msgInput.value);
        msgInput.value = "";
    }
};
msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

socket.onmessage = (event) => {
    const div = document.createElement("div");
    div.className = "msg";

    if (event.data.startsWith("YOU:")) {
        div.classList.add("me");
        console.log("me");
    }

    div.textContent = event.data;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
};
let myId = null;

socket.onmessage = (e) => {
    let data = JSON.parse(e.data);

    // first message from server gives your ID
    if (data.text === "YOUR_ID") {
        myId = data.id;
        return;
    }

    let div = document.createElement("div");

    if (data.from === myId) {
        div.className = "me";
        div.textContent = `You: ${data.text}`;
    } else {
        div.className = "other";
        div.textContent = `${data.from}: ${data.text}`;
    }

    messages.appendChild(div);
};


// Send message on Enter key