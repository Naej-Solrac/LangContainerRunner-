//Packages

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./network/routes.js');

const app = express();

app.set('trust proxy', '64.227.74.8, 104.21.60.229, 172.67.202.27, 38.25.15.115');
// Crear servidor HTTP y configurar Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
      origin: "*",  // Permite a cualquier origen conectarse
      methods: ["GET", "POST"]
  }
});

//Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



//Routes
app.use(routes);


app.get('/', (req, res) => {
  res.send(" Hello World ")
});

server.listen(3050, () => {
  console.log("Server on port 3050");
});

module.exports = app;