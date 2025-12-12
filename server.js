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

import { WebSocketServer } from "ws";
import http from "http";
import fs from "fs";

// Serve static files from /public
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

import WebSocket, { WebSocketServer } from "ws";

let idCounter = 1;

wss.on("connection", (socket) => {
    socket.id = "USER" + idCounter++;
    console.log(socket.id, "connected");

    // Send user's ID
    socket.send(JSON.stringify({
        from: "SERVER",
        text: "YOUR_ID",
        id: socket.id
    }));

    socket.on("message", (msg) => {
        const data = {
            from: socket.id,
            text: msg.toString(),
            time: new Date().toLocaleTimeString()
        };

        // Broadcast to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
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


