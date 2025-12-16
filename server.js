/*import { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";

const server = http.createServer((req, res) => {
    let filePath = "./public" + (req.url === "/" ? "/index.html" : req.url);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("File not found");
        } else {
            res.writeHead(200);
            res.end(data);
        }
    });
});

const wss = new WebSocketServer({ server });

let idCounter = 1;

wss.on("connection", (socket) => {
    socket.id = "USER" + idCounter++;
    console.log(socket.id, "connected");

    socket.on("message", (msg) => {
        // Broadcast message + sender ID
        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({
                    from: socket.id,
                    text: msg.toString()
                }));
            }
        });
    });

    socket.on("close", () => {
        console.log(socket.id, "disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server running: http://localhost:3000");
});
*/
import http from "http";
import fs from "fs";
import url from "url";
import WebSocket, { WebSocketServer } from "ws";

// HTTP server (serves frontend)
const server = http.createServer((req, res) => {
    let filePath ;
    const parsedUrl = url.parse(req.url,true);
    if(parsedUrl.pathname==="/"){
        filePath="./public/home.html";

    }
    else if(parsedUrl.pathname==="/chat"){
        filePath="./public/INDEX.html";

    }
    else if(parsedUrl.pathname==="/login"){
        filePath="./public/login-page/loginForm.html";

    }
    else if(parsedUrl.pathname==="/signup"){
        filePath="./public/login-page/signup.html";

    }
    else{
        filePath="./public"+ parsedUrl.pathname;
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("File not found");
        } else {
            // Set correct content type
            let contentType = "text/html";
            if (filePath.endsWith(".css")) contentType = "text/css";
            else if (filePath.endsWith(".js")) contentType = "text/javascript";
            else if (filePath.endsWith(".json")) contentType = "application/json";
            else if (filePath.endsWith(".png")) contentType = "image/png";
            else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) contentType = "image/jpeg";
            else if (filePath.endsWith(".gif")) contentType = "image/gif";
            else if (filePath.endsWith(".svg")) contentType = "image/svg+xml";

            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
});

// WebSocket server
const wss = new WebSocketServer({ server });

let idCounter = 1;

wss.on("connection", (socket) => {
    socket.id = "USER" + idCounter++;
    socket.username = "Guest"; // Default username
    console.log(socket.id, "connected");

    // Send socket ID to user
    socket.send(JSON.stringify({
        type: "YOUR_ID",
        id: socket.id
    }));

    socket.on("message", (msg) => {
        try {
            const parsedMsg = JSON.parse(msg.toString());
            
            // Handle username setting
            if (parsedMsg.type === 'SET_USERNAME') {
                socket.username = parsedMsg.username || "Guest";
                console.log(`${socket.id} set username to: ${socket.username}`);
                return;
            }
            
            // Handle chat message
            if (parsedMsg.type === 'CHAT_MESSAGE') {
                const data = {
                    type: 'CHAT_MESSAGE',
                    socketId: socket.id,
                    username: socket.username,
                    text: parsedMsg.text,
                    time: new Date().toLocaleTimeString()
                };

                // Broadcast to all clients
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data));
                    }
                });
            }
        } catch (error) {
            // Handle legacy plain text messages
            console.error('Message parse error:', error);
            const data = {
                type: 'CHAT_MESSAGE',
                socketId: socket.id,
                username: socket.username,
                text: msg.toString(),
                time: new Date().toLocaleTimeString()
            };

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    socket.on("close", () => {
        console.log(`${socket.id} (${socket.username}) disconnected`);
    });
});

server.listen(3000, () => {
    console.log("Server running: http://localhost:3000");
});
