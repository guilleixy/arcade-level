import './style.css';
import './reset.css';
import './pacman.css';

//corrige la altura de los iconos en funcion al tamaño del texto
window.addEventListener('DOMContentLoaded', function() {
    var icons = document.querySelectorAll('i');
  
    icons.forEach(function(icon) {
        console.log("icono corregido");
      var iconHeight = icon.offsetHeight;
      var marginBottom = iconHeight / 2;
      icon.style.marginBottom = marginBottom + 'px';
    });
  });