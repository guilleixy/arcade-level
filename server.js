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

let highscores = [];

function updateHighscores(name, score) {
  let scoreInserted = false;
  let scoreUpdated = false;
  for (let i = 0; i < highscores.length; i++) {
    if (score > highscores[i].puntuacion) {
      highscores.splice(i, 0, { nombre: name, puntuacion: score });
      scoreInserted = true;
      scoreUpdated = true;
      break;
    }
  }

  if(highscores.length < 10){
    scoreUpdated = true;
  }

  if (!scoreInserted) {
    highscores.push({ nombre: name, puntuacion: score });
  }

  // Mantener solo los 10 mejores registros
  if (highscores.length > 10) {
    highscores = highscores.slice(0, 10);
  }

  if(scoreUpdated){
    console.log("Score updated");
    io.emit('highscores', highscores);
  }
  console.log(highscores);
}

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
  //esto no es eficaz, no deberia enviar a quien se conecta sino a quien entra a horarios
  socket.emit('highscores', highscores);

  // Maneja eventos de hover
  socket.on('hover', () => {
    hoverCount++; // Incrementa el contador de hover
    // Emite el nuevo contador a todos los clientes conectados
    io.emit('hoverCount', hoverCount);
  });

  socket.on('new_score', (inputValue, scoreValue) => {
    updateHighscores(inputValue, scoreValue);
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});
