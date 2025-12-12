const socket = new WebSocket("ws://localhost:3000");

const msgBox = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

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
