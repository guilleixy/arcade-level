const imagenes_adultos = [
  '/tarifas/adultos/1.webp',
  '/tarifas/adultos/2.webp',
  '/tarifas/adultos/3.webp',
];

/* 
let prueba = document.getElementById("adultos");


let srcOriginal = "tarifas/marquesinas/adultos.svg";

prueba.addEventListener("mousedown", function() {
  prueba.src = "tarifas/marquesinas/adultos_red.svg";
});

prueba.addEventListener("mouseup", function() {
    prueba.src = srcOriginal;
});
esto hace que el usuario pueda mover a donde quiera de la pantalla lo que ha clickeado
const joystick = document.getElementById("joystick");
let isClicked = false;
let initialMouseOffsetX;
let initialMouseOffsetY;

joystick.addEventListener("mousedown", function(e) {
  isClicked = true;
  initialMouseOffsetX = e.clientX - joystick.offsetLeft;
  initialMouseOffsetY = e.clientY - joystick.offsetTop;
  document.addEventListener("mousemove", moveJoystick);
  document.addEventListener("mouseup", stopMoving);
});

function moveJoystick(e) {
  if (!isClicked) return;

  const joystickX = e.clientX - initialMouseOffsetX;
  const joystickY = e.clientY - initialMouseOffsetY;

  joystick.style.left = joystickX + "px";
  joystick.style.top = joystickY + "px";
}

function stopMoving() {
  isClicked = false;
  document.removeEventListener("mousemove", moveJoystick);
}
*/

const arcades = document.querySelectorAll('.arcade-dim');

arcades.forEach((arcade) => {
  const joystick = arcade.querySelector(".joystick");
  const pantalla = arcade.querySelector(".marquesina-screen");
  let initialAngle = 0;
  let currentAngle = 0;
  let lastAngle = 0;

  let original = arcade.querySelector('.controls');
  let srcOriginal = original.src;
  let boton_rojo = arcade.querySelector('.boton-rojo');
  
  boton_rojo.addEventListener("mousedown", function() {
    original.src = "tarifas/marquesinas/adultos_red.svg";
    const estilo = getComputedStyle(pantalla);
    const filtroActual = estilo.getPropertyValue("filter");
    
    if (filtroActual.includes("sepia")) {
      // Si el filtro "sepia" está presente, lo quitamos
      pantalla.style.filter = "";
    } else {
      // Si el filtro "sepia" no está presente, lo agregamos
      pantalla.style.filter = "sepia(100%)";
    }
  });
  
  boton_rojo.addEventListener("mouseup", function() {
    original.src = srcOriginal;
  });

  let boton_verde = arcade.querySelector('.boton-verde');
  
  boton_verde.addEventListener("mousedown", function() {
    original.src = "tarifas/marquesinas/adultos_green.svg";
    const estilo = getComputedStyle(pantalla);
    const filtroActual = estilo.getPropertyValue("filter");
    
    if (filtroActual.includes("grayscale")) {
      pantalla.style.filter = "";
    } else {
      pantalla.style.filter = "grayscale(100%)";
    }
  });
  
  boton_verde.addEventListener("mouseup", function() {
    original.src = srcOriginal;
  });

  let boton_amarillo = arcade.querySelector('.boton-amarillo');
  
  boton_amarillo.addEventListener("mousedown", function() {
    original.src = "tarifas/marquesinas/adultos_yellow.svg";
    const estilo = getComputedStyle(pantalla);
    const filtroActual = estilo.getPropertyValue("filter");
    
    if (filtroActual.includes("contrast")) {
      pantalla.style.filter = "";
    } else {
      pantalla.style.filter = "contrast(200%)";
    }
  });
  
  boton_amarillo.addEventListener("mouseup", function() {
    original.src = srcOriginal;
  });

  joystick.addEventListener("mousedown", function(e) {
    const joystickRect = joystick.getBoundingClientRect();
    const joystickCenterX = joystickRect.left + joystickRect.width / 2;
    const joystickCenterY = joystickRect.bottom;
    initialAngle = Math.atan2(e.clientY - joystickCenterY, e.clientX - joystickCenterX) * (180 / Math.PI) - currentAngle;
    document.addEventListener("mousemove", rotateJoystick);
    document.addEventListener("mouseup", stopRotation);
  });

  function rotateJoystick(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const joystickRect = joystick.getBoundingClientRect();
    const joystickCenterX = joystickRect.left + joystickRect.width / 2;
    const joystickCenterY = joystickRect.bottom;

    const deltaX = mouseX - joystickCenterX;
    const deltaY = mouseY - joystickCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calcular el ángulo basado en la distancia desde el centro del joystick
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - initialAngle;
    let nearestAngle;

    if (distance < 30) {
      nearestAngle = 0; // Si la distancia es menor a 30, establecer el ángulo en 0 grados (centro)
    } else {
      nearestAngle = Math.round(angle / 90) * 90; // Redondear el ángulo al valor más cercano de 0, 90, 180, 270 grados
    }

    if (nearestAngle !== currentAngle) {
      currentAngle = nearestAngle;
      joystick.style.transformOrigin = "bottom center";
      joystick.style.transform = `rotate(${nearestAngle}deg)`;
    }
    lastAngle = nearestAngle;
  }

  function stopRotation() {
    document.removeEventListener("mousemove", rotateJoystick);
    joystick.style.transform = `rotate(${0}deg)`;
    currentAngle = 0;
    const estilo = getComputedStyle(pantalla);
    const backgroundImage = estilo.getPropertyValue("background-image");
    let url = backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
    
    // Extraer el número de la URL
    const regex = /(\d+)\.webp$/;
    const match = regex.exec(url);
    if (lastAngle == 90) {
      if (match) {
        let numero = parseInt(match[1]);
        // Incrementar o decrementar el número
        numero = numero + 1; // o numero = numero - 1;
        // Comprobar si el número supera el límite (en este caso, 3)
        if (numero > 3) {
          numero = 1; // Volver al primer número
        }
        // Reemplazar el número en la URL
        url = url.replace(regex, numero + '.webp');
      }
      
      console.log(url);
      pantalla.style.backgroundImage = `url(${url})`;
    }
    if (lastAngle == -90 || lastAngle == 270) {
      if (match) {
        let numero = parseInt(match[1]);
        // Incrementar o decrementar el número
        numero = numero - 1; // o numero = numero - 1;
        // Comprobar si el número supera el límite (en este caso, 3)
        if (numero < 1) {
          numero = 3; // Volver al primer número
        }
        // Reemplazar el número en la URL
        url = url.replace(regex, numero + '.webp');
      }
      
      console.log(url);
      pantalla.style.backgroundImage = `url(${url})`;
    }
    lastAngle = 0;
  }
});/*
const joystick = document.getElementById("joystick");
let initialAngle = 0;
let currentAngle = 0;

let lastAngle = 0;

joystick.addEventListener("mousedown", function(e) {
  const joystickRect = joystick.getBoundingClientRect();
  const joystickCenterX = joystickRect.left + joystickRect.width / 2;
  const joystickCenterY = joystickRect.bottom;
  initialAngle = Math.atan2(e.clientY - joystickCenterY, e.clientX - joystickCenterX) * (180 / Math.PI) - currentAngle;
  document.addEventListener("mousemove", rotateJoystick);
  document.addEventListener("mouseup", stopRotation);
});

function rotateJoystick(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const joystickRect = joystick.getBoundingClientRect();
  const joystickCenterX = joystickRect.left + joystickRect.width / 2;
  const joystickCenterY = joystickRect.bottom;

  const deltaX = mouseX - joystickCenterX;
  const deltaY = mouseY - joystickCenterY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Calcular el ángulo basado en la distancia desde el centro del joystick
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - initialAngle;
  let nearestAngle;

  if (distance < 30) {
    nearestAngle = 0; // Si la distancia es menor a 30, establecer el ángulo en 0 grados (centro)
  } else {
    nearestAngle = Math.round(angle / 90) * 90; // Redondear el ángulo al valor más cercano de 0, 90, 180, 270 grados
  }

  if (nearestAngle !== currentAngle) {
    currentAngle = nearestAngle;
    joystick.style.transformOrigin = "bottom center";
    joystick.style.transform = `rotate(${nearestAngle}deg)`;
  }
  lastAngle = nearestAngle;
}

function stopRotation() {
  document.removeEventListener("mousemove", rotateJoystick);
  joystick.style.transform = `rotate(${0}deg)`;
  currentAngle = 0;
  if(lastAngle == 90){
    changeImg("forward");
  }
  if(lastAngle == -90 || lastAngle == 270){
    changeImg("back");
  }
}
*/