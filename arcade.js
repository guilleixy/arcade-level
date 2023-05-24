
let prueba = document.getElementById("adultos");


let srcOriginal = "tarifas/marquesinas/adultos.svg";

prueba.addEventListener("mousedown", function() {
  prueba.src = "tarifas/marquesinas/adultos_red.svg";
});

prueba.addEventListener("mouseup", function() {
    prueba.src = srcOriginal;
});
/* esto hace que el usuario pueda mover a donde quiera de la pantalla lo que ha clickeado
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

const joystick = document.getElementById("joystick");
let isClicked = false;
let initialAngle = 0;
let currentAngle = 0;

joystick.addEventListener("mousedown", function(e) {
  isClicked = true;
  const joystickRect = joystick.getBoundingClientRect();
  const baseX = joystickRect.left + joystickRect.width / 2;
  const baseY = joystickRect.bottom;
  initialAngle = Math.atan2(e.clientY - baseY, e.clientX - baseX) * (180 / Math.PI) - currentAngle;
  document.addEventListener("mousemove", rotateJoystick);
  document.addEventListener("mouseup", stopRotation);
});

function rotateJoystick(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const joystickRect = joystick.getBoundingClientRect();
  const baseX = joystickRect.left + joystickRect.width / 2;
  const baseY = joystickRect.bottom;
  const angle = Math.atan2(mouseY - baseY, mouseX - baseX) * (180 / Math.PI) - initialAngle;
  currentAngle = angle;
  joystick.style.transformOrigin = "bottom center";
  joystick.style.transform = `rotate(${angle}deg)`;
}

function stopRotation() {
  isClicked = false;
  document.removeEventListener("mousemove", rotateJoystick);
  joystick.style.transform = `rotate(${0}deg)`;
}
