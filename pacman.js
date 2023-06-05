import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const startButton = document.getElementById('start-button');
const dialogo = document.getElementById('pacman-dialog');
const input = document.getElementById('name-input');

const highscoresEl = document.getElementById('highscores-ol');

startButton.addEventListener('click', handleStartClick);

socket.on('highscores', (highscores) =>{
  highscoresEl.innerHTML = "";
  console.log(highscores);
  highscores.forEach((highscore) =>{
    highscoresEl.innerHTML += "<li>" + highscore.nombre + ": " + highscore.puntuacion + "</li>";
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
    }
    draw(){
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians);
        c.lineTo(this.position.x, this.position.y);
        c.fillStyle = 'yellow';
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
    constructor({position, velocity, color = 'red'}){
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        //this.height = 30;
        //this.width = 30;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 2;
        this.scared = false;
        //this.gif = new Image();
        //this.gif.src = 'ghost.gif';
    }
    draw(){
      //c.drawImage(this.gif, this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
      
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill();
        c.closePath(); 
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
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
        position: {
            x: blockwidth * 6 + blockwidth / 2,
            y: blockheight + blockheight / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: blockwidth * 6 + blockwidth / 2,
            y: blockheight * 3 + blockheight / 2
        },
        velocity:{
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    }),
]

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
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', 'b', '.', '[', '7', ']', '.', 'b', '.','|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '¿', '/', '/','/', '?', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '$', '.', '.', '.', '$', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '8', '.', '$', 'b', '.','b', '$', '.', '6', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '&', '/', '/','/', '9', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '$', '.', '.', '[', '$', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '$', '.', '.', '.', '$', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '3', '.', 'g', 'b', '.', 'b', 'g', '.', '4', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['|', '.', 'b', '.', '[', '2', '.', 'f', '.', '[', ']', '.', '[', '7', ']', '.', 'b', '.','|'],
  ['|', '.', '.', '.', '.', '_', '.', '$', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '$', '.', '[','-', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '$', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '8', '.', '$', '.', '[',']', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '$', '.', '.','.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '0', '/', '/', '/', 'c', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src){
    const image = new Image();
    image.src = src;
    return image;
}

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

function circleCollidesWithRectangle({circle, rectangle}){
    const padding = blockwidth / 2 - circle.radius - 1; // se calcula el padding y se quita al menos 1px pq si no estaria chocando siempre
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
        && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
        && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
        && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    );
}

function resetPositions(){

  console.log("reseteando");
  player.position = {
    x: blockwidth + blockwidth / 2,
    y: blockheight + blockheight / 2
  };
  player.velocity = { x: 0, y: 0 };

  ghosts.forEach(ghost => {
    ghost.position = {
      x: blockwidth * 6 + blockwidth / 2,
      y: blockheight + blockheight / 2
    };
    ghost.velocity = { x: Ghost.speed, y: 0 };
  });

  // Restablece otras posiciones y estados si es necesario

  // Vuelve a dibujar las boundaries y otros elementos si es necesario
  boundaries.forEach(boundary => boundary.draw());
}

let animationId;
function animate() { //se crea un loop infinito
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    if(keys.w.pressed && lastKey === 'w'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:0,y:-5}}, rectangle: boundary})){
                player.velocity.y = 0;
                break;
            }
            else{
                player.velocity.y = -5; 
            }
        }
    }
    else if(keys.a.pressed && lastKey === 'a'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:-5,y:-0}}, rectangle: boundary})){
                player.velocity.x = 0;
                break;
            }
            else{
                player.velocity.x = -5;
            }
        }
    }
    else if(keys.s.pressed && lastKey === 's'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:0,y:5}}, rectangle: boundary})){
                player.velocity.y = 0;
                break;
            }
            else{
                player.velocity.y = 5; 
            }
        }
    }
    else if(keys.d.pressed && lastKey === 'd'){
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({circle: {...player, velocity: {x:5,y:0}}, rectangle: boundary})){
                player.velocity.x = 0;
                break;
            }
            else{
                player.velocity.x = 5;
            }
        }
    }

    //fantasma toca a jugador
    for(let i = ghosts.length - 1; i >= 0; i--){
        const ghost = ghosts[i];
        if(Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius){
            if(ghost.scared && player.op){
                ghosts.splice(i,1);
            }
            else{
                cancelAnimationFrame(animationId);
                if(vidas === 0){
                  socket.emit('new_score', input.value, score);
                  console.log("fin");
                }
                else{
                  vidas--;
                  resetPositions();
                }
            }
        }
    }

    //win condition
    if(pellets.length === 0){
        console.log("has ganado");
        cancelAnimationFrame(animationId);
    }

    //power ups
    for(let i = powerUps.length - 1; i >= 0; i--){
        const powerUp = powerUps[i];
        powerUp.draw();
        //jugador toca power up
        if(Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius){
            powerUps.splice(i, 1);
            //hacer jugador op (original hace fantasmas asustados)
            player.op = true;
            setTimeout(() =>{
                player.op = false;
            },5000);
            ghosts.forEach(ghost => {
                ghost.scared = true;

                setTimeout(() => {
                    ghost.scared = false;
                },5000);
            });
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
            const direction = pathways[Math.floor(Math.random() * pathways.length)];
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
  document.getElementById('player-name').innerHTML = "Jugando como: " + input.value;
  animate();
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