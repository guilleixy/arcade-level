// carrusel arcades

const imagenes_arcades = [
    '/arcades_galeria/1.webp',
    '/arcades_galeria/2.webp',
    '/arcades_galeria/3.webp',
    '/arcades_galeria/4.webp',
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
/*
const arcades_paneles = document.querySelectorAll('.hover-img-gradient');

arcades_paneles.forEach((arcade) => {
  arcade.addEventListener('click', (event) => {
    const oculto = arcade.querySelector('.hidden');
    const ocultar = arcade.querySelector('.gradient-up');
    arcade.classList.remove('hover-img-gradient');
    arcade.classList.add('panel_img_extended');
    oculto.classList.remove('hidden');
    ocultar.classList.add('hidden');
    arcade.classList.remove('pointer');
    arcade.classList.remove('inline-block');

    arcade.classList.add('animacion-div');

  });
});
*/