const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const socket = new WebSocket(`${protocol}//${window.location.host}`);

const msgBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

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




let myId = null;

/* ---------------------------
   RECEIVE MESSAGES
---------------------------- */
socket.onmessage = (e) => {
    const data = JSON.parse(e.data);

    // SYSTEM MESSAGE → ONLY SET ID
    if (data.text === "YOUR_ID") {
        myId = data.id;
        console.log("My ID:", myId);
        return;
    }

    // CHAT MESSAGE
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("msg");

    if (data.from === myId) {
        msgDiv.classList.add("me");
        msgDiv.innerHTML = `
            <div class="text">You: ${data.text}</div>
            <div class="time">${data.time}</div>
        `;
    } else {
        msgDiv.classList.add("other");
        msgDiv.innerHTML = `
            <div class="text">${data.from}: ${data.text}</div>
            <div class="time">${data.time}</div>
        `;
    }

    msgBox.appendChild(msgDiv);
    msgBox.scrollTop = msgBox.scrollHeight;
};

/* ---------------------------
   SEND MESSAGE
---------------------------- */
sendBtn.onclick = () => {
    if (msgInput.value.trim() !== "") {
        socket.send(msgInput.value);
        msgInput.value = "";
    }
};

msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendBtn.click();
});
