import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

// Configura los encabezados de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let hoverCount = 0; // Contador de hover

// Configura el servidor HTTP y WebSocket
server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

// Configura la ruta raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); //esta mal pero se supone que reenvia a index.html al acceder a localhsot:3000
});

// Configura la conexión de socket.io
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  // Envia el contador de hover al cliente recién conectado
  socket.emit('hoverCount', hoverCount);

  // Maneja eventos de hover
  socket.on('hover', () => {
    hoverCount++; // Incrementa el contador de hover
    // Emite el nuevo contador a todos los clientes conectados
    io.emit('hoverCount', hoverCount);
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});
