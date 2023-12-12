/*const imagenes_arcades = [
    '/horarios/1.jpg',
    '/horarios/2.jpg',
    '/horarios/3.jpg',
    '/horarios/4.jpg',
    '/horarios/5.jpg',
    '/horarios/6.jpg',
    '/horarios/7.jpg',
];

let currentImageIndex = 0;
const imageElement = document.querySelector('.carr-horarios-bg');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');


function changeImage(index){
    imageElement.style.opacity = 0;
    setTimeout(() =>{
        imageElement.style.backgroundImage = `url('${imagenes_arcades[index]}')`;
        imageElement.style.opacity = 1;
    }, 500);
}

function autoChangeImage() {
    currentImageIndex = (currentImageIndex + 1) % imagenes_arcades.length; //cuando llegue al limite volvera a la img 1
    changeImage(currentImageIndex);
}
  
let isButtonCooldown = false;

prevButton.addEventListener('click', () => {
  if (!isButtonCooldown) {
    currentImageIndex = (currentImageIndex - 1 + imagenes_arcades.length) % imagenes_arcades.length;
    changeImage(currentImageIndex);
    isButtonCooldown = true;
    setTimeout(() => {
      isButtonCooldown = false;
    }, 800);
  }
});

nextButton.addEventListener('click', () => { 
  if (!isButtonCooldown) {
    currentImageIndex = (currentImageIndex + 1) % imagenes_arcades.length; //cuando llega a la de 0 (creo) se bugea un poco y no espera
    changeImage(currentImageIndex);
    isButtonCooldown = true;
    setTimeout(() => {
      isButtonCooldown = false;
    }, 800);
  }
});

setInterval(autoChangeImage, 5000); */

// Espera a que se cargue la página completamente
window.addEventListener('load', function() {
  // Obtén el elemento de la sección por su id
  const horariosSection = document.getElementById('horarios');
  
  // Verifica si la sección existe en la página
  if (horariosSection) {
    // Realiza el desplazamiento suave hacia la sección
    horariosSection.scrollIntoView({ behavior: 'smooth' });
  }
});