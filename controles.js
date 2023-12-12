//creditos: https://dreammix.itch.io/keyboard-keys-for-ui/download/eyJleHBpcmVzIjoxNjg3MjgxOTE5LCJpZCI6MTUwMjU1MH0%3d.iCEjaDe9l3GuOaL4Tn%2b%2fCQX1B3c%3d

controles = document.querySelector(".controles");

teclas = controles.querySelectorAll('.key-img');

let index = 0;

function changeImageSrc() {
  const tecla = teclas[index];
  const originalSrc = tecla.getAttribute('src');
  const newSrc = originalSrc.replace('.png', 'p.png');
  
  tecla.setAttribute('src', newSrc);
  
  setTimeout(() => {
    tecla.setAttribute('src', originalSrc);
  }, 500);
  
  index = (index + 1) % teclas.length;
}

let intervalId = setInterval(changeImageSrc, 1000);

controlesWrapper.addEventListener('mouseenter', () => {
  clearInterval(intervalId);
});

controlesWrapper.addEventListener('mouseleave', () => {
  intervalId = setInterval(changeImageSrc, 1000);
});