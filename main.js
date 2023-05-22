import './style.css'
import './reset.css'

// carrusel arcades

const imagenes_arcades = [
    'public/arcades_galeria/1.webp',
    'public/arcades_galeria/2.webp',
    'public/arcades_galeria/3.webp',
    'public/arcades_galeria/4.webp',
];

let currentImageIndex = 0;
const imageElement = document.querySelector('.carr-img');
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

setInterval(autoChangeImage, 5000); 