#! /bin/node

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
	res.send(`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Xcp - Cross Copy Paste</title>
			<style>
				body {
					padding: 0;
					margin: 0;
					background-color: #071624;
					width: 100vw;
					height: 100vh;
					font-family: monospace;
					display: flex;
					align-items: center;
					justify-content: center;
				}
	
				button {
					border-radius: 1em;
					background: none;
					padding: 1em;
				}
	
				h1 {
					color: #3c5166;
					margin: 0;
				}
			</style>
		</head>
		<body>
			<button><h1>Send My Clipboard</h1></button>
			<script src="/socket.io/socket.io.js"></script>
			<script>
				const socket = io("/");
	
				socket.on("copy", async (e) => {
					await navigator.clipboard.writeText(e);
					console.log("Copied:", e);
				});
	
				document.querySelector("button").onclick = async () => {
					socket.emit("copy", await navigator.clipboard.readText());
					console.log("Pasted:", await navigator.clipboard.readText());
				};
			</script>
		</body>
	</html>
	`);
});

io.on("connection", (socket) => {
  socket.on("copy", (e) => {
    io.emit("copy", e);
    console.log("Copied:", e);
  });
});

http.listen(process.env.PORT, () =>
  console.log("http://localhost:" + process.env.PORT)
);
