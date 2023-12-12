import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const startButton = document.getElementById('start-button');
const dialogo = document.getElementById('pacman-dialog');
const input = document.getElementById('name-input');
const dialogoRestart = document.getElementById('pacman-restart-dialog');

const dialogoVictoria = document.getElementById('victory-dialog');

const restartButton = document.getElementById('restart-button');

dialogoRestart.style.display = 'none';

const countdownEl = document.getElementById('countdown-el');

countdownEl.style.display = 'none';

let playerName;

const highscoresEl = document.getElementById('highscores-ol');

const vidas_cont = document.getElementById('vidas-container');

startButton.addEventListener('click', handleStartClick);

restartButton.addEventListener('click', handleRestartClick);

socket.on('highscores', (highscores) =>{
  highscoresEl.innerHTML = "";
  console.log(highscores);
  highscores.forEach((highscore) =>{
    highscoresEl.innerHTML += "<li><div style='display: inline-block; float: left;'>" + highscore.nombre + "</div><div style='display: inline-block; float: right;'>" + highscore.puntuacion + "</div></li>";
  });
});

const canvas = document.querySelector('canvas'); //kaboom.js

const scoreEl = document.getElementById('scoreEl');

const c = canvas.getContext('2d'); 

canvas.width = 760;
canvas.height = 920;

const blockwidth = 40;
const blockheight =  40;

let vidas = 2;

class Boundary{
    constructor({position, image}){
        this.position = position;
        this.width = blockwidth;
        this.height = blockheight;
        this.image = image;
    }
    draw(){ //determina como se dibuja una Boundary
        //c.fillStyle = 'blue';
        //c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class Player{
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.radius = 15; //radio del circulo de pacman para dibujarlo
        this.radians = 0.75;
        this.op = false;
        this.openRate = 0.12;
        this.rotation = 0;
        this.speed = 4;
    }
    draw(){
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
        c.lineTo(this.position.x, this.position.y);
        c.fillStyle = '#ffcc00';
        c.fill();
        c.closePath();
        c.restore();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.radians < 0 || this.radians > 0.75){
            this.openRate = -this.openRate;
        }
        this.radians += this.openRate;
    }
}

class Ghost{
    static speed = 2;
    constructor({initialPosition, position, velocity, color = 'red', spawnCD, is_active, is_spawned, img_src}){
        this.initialPosition = initialPosition;
        this.position = {
          x: initialPosition.x,
          y: initialPosition.y
        };
        this.velocity = velocity;
        this.radius = 15;
        this.height = 30;
        this.width = 30;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 2;
        this.scared = false;
        this.spawnCD = spawnCD;
        this.is_active = is_active || false;
        this.is_spawned = is_spawned || false;
        this.img = new Image();
        this.img.src = img_src;
    }
    draw(){
      c.drawImage(this.img, this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
      /*
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill();
        c.closePath(); */
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    reset(){
      this.position.x = this.initialPosition.x;
      this.position.y = this.initialPosition.y;
    }
}

class Pellet{
    constructor({position}){
        this.position = position;
        this.radius = 3; 
    }
    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = '#f8b090';
        c.fill();
        c.closePath();
    }
}

class PowerUp{
    constructor({position}){
        this.position = position;
        this.radius = 8; 
    }
    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = '#f8b090';
        c.fill();
        c.closePath();
    }
}

const pellets = [];
const boundaries = [];
const powerUps = [];
const ghosts = [
    new Ghost({
        initialPosition: {
          x: blockwidth * 9 + blockwidth / 2,
          y: blockheight * 11 + blockheight / 2
        },
        velocity:{
            x: -Ghost.speed,
            y: 0
        }, 
        is_active: true,
        is_spawned: true,
        color: 'red',
        img_src: 'pacman_assets/ghosts/red.png',
        spawnCD: 0
    }),
    new Ghost({
        initialPosition: {
            x: blockwidth * 9 + blockwidth / 2,
            y: blockheight * 8 + blockheight / 2
        },
        velocity:{
            x: 0,
            y: 0
        },
        color: 'pink',
        spawnCD: 20000,
        img_src: 'pacman_assets/ghosts/pink.png'

    }),
    new Ghost({
      initialPosition: {
          x: blockwidth * 8 + blockwidth / 2,
          y: blockheight * 8 + blockheight / 2
      },
      velocity:{
          x: 0,
          y: 0
      },
      color: 'purple',
      spawnCD: 15000,
      img_src: 'pacman_assets/ghosts/purple.png'
  }),
  new Ghost({
    initialPosition: {
        x: blockwidth * 10 + blockwidth / 2,
        y: blockheight * 8 + blockheight / 2
    },
    velocity:{
        x: 0,
        y: 0
    },
    color: 'blue',
    spawnCD: 10000,
    img_src: 'pacman_assets/ghosts/blue.png'
}),
new Ghost({
  initialPosition: {
      x: blockwidth * 9 + blockwidth / 2,
      y: blockheight * 9 + blockheight / 2
  },
  velocity:{
      x: 0,
      y: 0
  },
  color: 'green',
  spawnCD: 5000,
  img_src: 'pacman_assets/ghosts/green.png'
}),
new Ghost({
  initialPosition: {
      x: blockwidth * 10 + blockwidth / 2,
      y: blockheight * 9 + blockheight / 2
  },
  velocity:{
      x: 0,
      y: 0
  },
  color: 'orange',
  spawnCD: 30000,
  img_src: 'pacman_assets/ghosts/orange.png'
}),    new Ghost({
  initialPosition: {
      x: blockwidth * 8 + blockwidth / 2,
      y: blockheight * 9 + blockheight / 2
  },
  velocity:{
      x: 0,
      y: 0
  },
  color: 'pistacho',
  spawnCD: 25000,
  img_src: 'pacman_assets/ghosts/pistacho.png'
}), 
]

let ghostTimeouts = [];

function ghostSpawners() {
  ghosts.forEach((ghost, index) => {
    if (!ghost.is_spawned) {
      clearTimeout(ghostTimeouts[index]); // Cancelar el timeout anterior, si existe
      ghostTimeouts[index] = setTimeout(() => {
        console.log("spawneado");
        ghost.is_spawned = true;
      }, ghost.spawnCD);
    }
  });
}
const player = new Player({
    position: {
        x: blockwidth + blockwidth / 2,
        y: blockheight + blockheight / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = '';

let score = 0;
/*
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]
*/
const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', 'b', '.', '[', '7', ']', '.', 'b', '.','|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '¿', '/', '/','/', '?', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '$', ' ', ' ', ' ', '$', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '8', '.', '$', ' ', ' ',' ', '$', '.', '6', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '&', '/', '/','/', '9', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '$', ' ', ' ', ' ', '$', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '$', ' ', ' ', ' ', '$', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '3', '.', 'g', 't', 't', 't', 'g', '.', '4', ']', '.', 'b', '.', '|'],
  ['|', 'p', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['|', '.', 'b', '.', '[', '2', '.', 'f', '.', '[', ']', '.', '[', '7', ']', '.', 'b', '.','|'],
  ['|', '.', '.', '.', '.', '_', '.', '$', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '$', '.', '[','-', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '$', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '8', '.', '$', '.', '[',']', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '$', '.', '.','.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '0', '/', '/', '/', 'c', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function mostrarVidas(){
  vidas_cont.innerHTML = "";
  for(let i = 0; i < (vidas+1); i++){
    vidas_cont.innerHTML += "<img src='pacman.png' alt='vida_pacman' height='25px' style='padding:2px'>"
  }
}

function createImage(src){
    const image = new Image();
    image.src = src;
    return image;
}

function setMap(){
  map.forEach((row, i) =>{
    row.forEach((symbol, j) =>{
        switch (symbol) {
            case '-':
              boundaries.push(
                new Boundary({
                  position: {
                    x: blockwidth * j,
                    y: blockheight* i
                  },
                  image: createImage('pacman_assets/pipeHorizontal.png')
                })
              )
              break
            case '|':
              boundaries.push(
                new Boundary({
                  position: {
                    x: blockwidth * j,
                    y: blockheight * i
                  },
                  image: createImage('pacman_assets/pipeVertical.png')
                })
              )
              break
            case '1':
              boundaries.push(
                new Boundary({
                  position: {
                    x: blockwidth * j,
                    y: blockheight * i
                  },
                  image: createImage('pacman_assets/pipeCorner1.png')
                })
              )
              break
            case '2':
              boundaries.push(
                new Boundary({
                  position: {
                    x: blockwidth * j,
                    y: blockheight * i
                  },
                  image: createImage('pacman_assets/pipeCorner2.png')
                })
              )
              break
            case '3':
              boundaries.push(
                new Boundary({
                  position: {
                    x: blockwidth * j,
                    y: blockheight * i
                  },
                  image: createImage('pacman_assets/pipeCorner3.png')
                })
              )
              break
            case '4':
              boundaries.push(
                new Boundary({
                  position: {
                    x: blockwidth * j,
                    y: blockheight * i
                  },
                  image: createImage('pacman_assets/pipeCorner4.png')
                })
              )
              break
            case 'b':
              boundaries.push(
                new Boundary({
                  position: {
                    x: blockwidth * j,
                    y: blockheight * i
                  },
                  image: createImage('pacman_assets/block.png')
                })
              )
              break
            case '[':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/capLeft.png')
                })
              )
              break
            case ']':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/capRight.png')
                })
              )
              break
            case '_':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/capBottom.png')
                })
              )
              break
            case '^':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/capTop.png')
                })
              )
              break
            case '+':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeCross.png')
                })
              )
              break
            case '5':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  color: 'blue',
                  image: createImage('pacman_assets/pipeConnectorTop.png')
                })
              )
              break
            case '6':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  color: 'blue',
                  image: createImage('pacman_assets/pipeConnectorRight.png')
                })
              )
              break
            case '7':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  color: 'blue',
                  image: createImage('pacman_assets/pipeConnectorBottom.png')
                })
              )
              break
            case '8':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeConnectorLeft.png')
                })
              )
              break
            case '9':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeConnectorLeftRed.png')
                })
              )
              break
            case '0':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeCorner4Red.png')
                })
              )
              break
            case '$':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeVerticalRed.png')
                })
              )
              break
            case '/':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeHorizontalRed.png')
                })
              )
              break
            case '?':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeCorner2Red.png')
                })
              )
              break
            case '¿':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeCorner1Red.png')
                })
              )
              break
            case '&':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/pipeConnectorRightRed.png')
                })
              )
              break
            case 'c':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/capRightRed.png')
                })
              )
              break
            case 'g':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/capBottomRed.png')
                })
              )
              break
            case 'f':
              boundaries.push(
                new Boundary({
                  position: {
                    x: j * blockwidth,
                    y: i * blockheight
                  },
                  image: createImage('pacman_assets/capTopRed.png')
                })
              )
              break
              case 't':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * blockwidth,
                      y: i * blockheight
                    },
                    image: createImage('pacman_assets/ghostDoor.png')
                  })
                )
                break
                case 'u':
                  boundaries.push(
                    new Boundary({
                      position: {
                        x: j * blockwidth,
                        y: i * blockheight
                      },
                      image: createImage('pacman_assets/ghostWall.png')
                    })
                  )
                  break
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                        x: j * blockwidth + blockwidth / 2,
                        y: i * blockheight + blockheight / 2
                        }
                    })
                    )
                break    
            case 'p':
                powerUps.push(
                    new PowerUp({
                        position: {
                        x: j * blockwidth + blockwidth / 2,
                        y: i * blockheight + blockheight / 2
                        }
                    })
                    )
                break                      
        }
    });
}); 

}

setMap();

function circleCollidesWithRectangle({circle, rectangle}){
    const padding = blockwidth / 2 - circle.radius - 1; // se calcula el padding y se quita al menos 1px pq si no estaria chocando siempre
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
        && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
        && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
        && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    );
}

function resetGhost(){
  console.log("reseteando fantasmas");
  ghosts.forEach((ghost)=>{
    if(ghost.color == 'red'){
      console.log("rojp spawneado");
      ghost.is_spawned = true;
      ghost.is_active = true;
    }
    else{
      ghost.is_spawned = false;
      ghost.is_active = false;
    }

    ghost.velocity.x = 0;
    ghost.velocity.y = 0;
    ghost.reset();  
    ghostSpawners();// el problema esta en que el otro ghostSpawners no termina de ejecutarse, tiene que cancelarse
  });
}

function countdown(){
  countdownEl.style.display = 'flex';
  countdownEl.innerHTML = "Ready?"
  setTimeout(()=>{
    console.log("ready");
    countdownEl.innerHTML = "Go!";
  },1000);
  setTimeout(()=>{
    countdownEl.style.display = 'none';

  },2000);

}

function resetPositions(){
  player.position = {
    x: blockwidth + blockwidth / 2,
    y: blockheight + blockheight / 2
  };
  player.rotation = 0;
}

let animationId;
function animate() { //se crea un loop infinito
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    if(keys.w.pressed && lastKey === 'w'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:0,y:-player.speed}}, rectangle: boundary})){
                player.velocity.y = 0;
                break;
            }
            else{
                player.velocity.y = -player.speed; 
            }
        }
    }
    else if(keys.a.pressed && lastKey === 'a'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:-player.speed,y:-0}}, rectangle: boundary})){
                player.velocity.x = 0;
                break;
            }
            else{
                player.velocity.x = -player.speed;
            }
        }
    }
    else if(keys.s.pressed && lastKey === 's'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:0,y:player.speed}}, rectangle: boundary})){
                player.velocity.y = 0;
                break;
            }
            else{
                player.velocity.y = player.speed; 
            }
        }
    }
    else if(keys.d.pressed && lastKey === 'd'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:player.speed,y:0}}, rectangle: boundary})){
                player.velocity.x = 0;
                break;
            }
            else{
                player.velocity.x = player.speed;
            }
        }
    }

    //fantasma toca a jugador
    for(let i = ghosts.length - 1; i >= 0; i--){
        const ghost = ghosts[i];
        if(Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius){
            if(ghost.scared && player.op){
              score += 200;
              scoreEl.innerHTML = score;
              ghost.reset(); //lo ponemos en su posicion inicial
              ghost.is_active = false;
              ghost.is_spawned = false;
              ghost.velocity.x = 0;
              ghost.velocity.y = 0;
              setTimeout(()=>{ //espera 3 segundos y vuelve a estar activo
                ghost.is_spawned = true;
                if(ghost.color == 'red'){
                  ghost.is_active = true;
                  ghost.velocity.x = Ghost.speed; //lo del rojo sigue mal
                }
              },3000);
            }
            else{
                cancelAnimationFrame(animationId);
                if(vidas === 0){
                  vidas_cont.innerHTML = "";
                  socket.emit('new_score', playerName, score);
                  console.log("fin");
                  dialogoRestart.style.display = 'flex';
                }
                else{
                  vidas--;
                  mostrarVidas();
                  resetPositions();
                  countdown();
                  resetGhost();
                  setTimeout(()=>{
                    requestAnimationFrame(animate);
                    ghosts[0].velocity.x = -Ghost.speed;
                  },2000);
                }
            }
        }
    }

    //win condition
    if(pellets.length === 0){
        console.log("has ganado");
        cancelAnimationFrame(animationId);
        dialogoVictoria.style.display = 'flex';
        socket.emit('new_score', playerName, score);
    }

    //power ups
    for(let i = powerUps.length - 1; i >= 0; i--){
        const powerUp = powerUps[i];
        powerUp.draw();
        //jugador toca power up
        if(Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius){
          powerUps.splice(i, 1);
          //hacer jugador op (original hace fantasmas asustados)
          if(player.op){
            
          }
          else{
            player.op = true;
            setTimeout(() =>{
                player.op = false;
            },5000);
            ghosts.forEach(ghost => {
              if (ghost.is_active) {
                ghost.scared = true;
                ghost.img.src = 'pacman_assets/ghosts/scared1.png';
            
                setTimeout(() => {
            
                  let toggle = true;
                  const toggleInterval = setInterval(() => {
                    if (toggle) {
                      ghost.img.src = 'pacman_assets/ghosts/scared2.png';
                    } else {
                      ghost.img.src = 'pacman_assets/ghosts/scared1.png';
                    }
            
                    toggle = !toggle;
                  }, 250);
                  setTimeout(() => {
                    ghost.scared = false;
                    clearInterval(toggleInterval);
                    ghost.img.src = 'pacman_assets/ghosts/' + ghost.color + '.png';
                  }, 2000);
                }, 3000);
              }
            });
          }
          
        }
    }

    //comprueba si se toca comida
    for(let i = pellets.length - 1; i >= 0; i--){
        const pellet = pellets[i];
        pellet.draw();
        if(Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius){
            pellets.splice(i, 1);
            score += 10;
            scoreEl.innerHTML = score;
        }
    }
    boundaries.forEach((boundary) => {
        boundary.draw();
        if (circleCollidesWithRectangle({circle: player, rectangle: boundary})){
                player.velocity.y = 0;
                player.velocity.x = 0;
            }
    });
    player.update();

    ghosts.forEach((ghost) =>{
      ghost.update();
        if(ghost.is_active){
          const collisions = [];
          boundaries.forEach((boundary) => {
              if (!collisions.includes('right') && circleCollidesWithRectangle({circle: {...ghost, velocity: {x:ghost.speed,y:0}}, rectangle: boundary})){
                  collisions.push('right');
              }
              if (!collisions.includes('left') && circleCollidesWithRectangle({circle: {...ghost, velocity: {x:-ghost.speed,y:0}}, rectangle: boundary})){
                  collisions.push('left');
              }
              if (!collisions.includes('up') && circleCollidesWithRectangle({circle: {...ghost, velocity: {x:0,y:-ghost.speed}}, rectangle: boundary})){
                  collisions.push('up');
              }
              if (!collisions.includes('down') && circleCollidesWithRectangle({circle: {...ghost, velocity: {x:0,y:ghost.speed}}, rectangle: boundary})){
                  collisions.push('down');
              }
          });
          if(collisions.length > ghost.prevCollisions.length){
              ghost.prevCollisions = collisions;
          }
          if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
              if(ghost.velocity.x > 0){
                  ghost.prevCollisions.push('right');
              }
              else if(ghost.velocity.x < 0){
                  ghost.prevCollisions.push('left');
              }
              else if(ghost.velocity.y > 0){
                  ghost.prevCollisions.push('down');
              }
              else if(ghost.velocity.y < 0){
                  ghost.prevCollisions.push('up');
              }
              const pathways = ghost.prevCollisions.filter(collision => {
                  return !collisions.includes(collision); //devuelve posibles rutas
              });
              let direction = '';
              if(ghost.position.y == player.position.y){ //es necesario comprobar que pathways sea >1? cuando scared?
                if(pathways.includes('left') && ghost.position.x > player.position.x){
                  if(ghost.scared){
                    const index = pathways.indexOf('left');
                    if (index !== -1) {
                      pathways.splice(index, 1);
                    }                    
                  }
                  else{
                    direction = 'left';
                  }
                }
                else if(pathways.includes('right') && ghost.position.x < player.position.x){
                  if(ghost.scared){
                    const index = pathways.indexOf('right');
                    if (index !== -1) {
                      pathways.splice(index, 1);
                    }
                    
                  }
                  else{
                  direction = 'right';                    
                  }
                }
              }
              else if(ghost.position.x == player.position.x ){
                if(pathways.includes('up') && ghost.position.y > player.position.y){
                  if(ghost.scared){
                    const index = pathways.indexOf('up');
                    if (index !== -1) {
                      pathways.splice(index, 1);
                    }
                  }
                  else{
                  direction = 'up';                    
                  }
                }
                else if(pathways.includes('down') && ghost.position.y < player.position.y){
                  if(ghost.scared){
                    const index = pathways.indexOf('down');
                    if (index !== -1) {
                      pathways.splice(index, 1);
                    }            
                  }
                  else{
                    direction = 'down';                    
                  }

                }
              }
             if(direction == ''){
                direction = pathways[Math.floor(Math.random() * pathways.length)];
              }
              switch(direction){
                  case 'down':
                      ghost.velocity.y = ghost.speed;
                      ghost.velocity.x = 0;
                      break;
                  case 'up':
                      ghost.velocity.y = -ghost.speed;
                      ghost.velocity.x = 0;
                      break;
                  case 'right':
                      ghost.velocity.y = 0;
                      ghost.velocity.x = ghost.speed;
                      break;
                  case 'left':
                      ghost.velocity.y = 0;
                      ghost.velocity.x = -ghost.speed;
                      break;
              }
              ghost.prevCollisions = [];
          }
        }
        else{
          if(ghost.is_spawned){
            if(ghost.position.y == (blockheight * 11 + blockheight / 2)){
              ghost.velocity.y = 0;
              ghost.velocity.x = ghost.speed;
              ghost.is_active = true;
            }
            else{
              ghost.velocity.y = ghost.speed;
            }
          }
        }

    });
    if(player.velocity.x > 0){
        player.rotation = 0;
    }
    else if(player.velocity.x < 0){
        player.rotation = Math.PI;
    }
    else if(player.velocity.y > 0){
        player.rotation = Math.PI / 2;
    }
    else if(player.velocity.y < 0){
        player.rotation = Math.PI * 1.5;
    }
}

function handleStartClick() {
  dialogo.style.display = 'none';
  playerName = input.value;
  if (playerName.length > 16) {
    playerName = playerName.substring(0, 13) + '...';
  }
  document.getElementById('player-name').innerHTML = playerName;
  countdown();
  setTimeout(()=>{
    animate();
    mostrarVidas();
    ghostSpawners();
  },2000);

}


function handleRestartClick() {
  score = 0;
  scoreEl.innerHTML = score;
  vidas = 3;
  dialogoRestart.style.display = 'none';
  setMap();
  animate();
  mostrarVidas();
}


addEventListener('keydown', ({ key }) => { //por defecto es window, deberia ser en el canvas (?)
    switch (key){
        case 'ArrowUp':
        case 'W':
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'ArrowLeft':
        case 'A':
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 'ArrowDown':
        case 'S':    
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'ArrowRight':
        case 'D':
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
})

addEventListener('keyup', ({ key }) => { 
    switch (key){
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
})