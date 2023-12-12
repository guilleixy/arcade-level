import { io } from 'socket.io-client';

    const socket = io('http://localhost:3000');
    const hoverElements = document.querySelectorAll('#coin-add');

    const infoMonedas = document.querySelector('.question-coin-hover');

    const infoMonedasBloque = document.querySelector('.question-img-coins');

    const peeking = document.querySelector('.peeking');

    const coin = document.querySelector('.coin-peeking')


    // Maneja eventos de socket.io
    socket.on('hoverCount', (count) => {
      console.log('Contador de hover actualizado:', count);
      const formattedCount = count.toString().padStart(7, '0');
      const coin_anim = document.querySelector('.counter-coin');

      coin_anim.classList.add('animate');

      document.getElementById('coin-counter').innerHTML = formattedCount;

      setTimeout(() => {
        coin_anim.classList.remove('animate');
      }, 700); 
    });

    hoverElements.forEach((hoverElement) => {
    
      hoverElement.addEventListener('mouseenter', () => {
        socket.emit('hover');
        // Creamos un nuevo retraso de 1 segundo antes de emitir el evento "hover"
        /*
        hoverTimeout = setTimeout(() => {
          console.log("si");
          socket.emit('hover');
          hoverTimeout = null; // Restablecemos el valor de hoverTimeout
        }, 500); */
      });
    });
    

    infoMonedasBloque.addEventListener('mouseenter',()=>{
      infoMonedas.style.opacity = 1;
      infoMonedas.style.transition = 'opacity 0.2s ease-in-out';
    })

    infoMonedasBloque.addEventListener('mouseleave',()=>{
      infoMonedas.style.opacity = 0;
      infoMonedas.style.transition = 'opacity 0.2s ease-in-out';
    })

    const ruta = peeking.getAttribute('src');

    peeking.addEventListener('mousedown', () => {
      const nuevaRuta = ruta.replace('.png', '2.png');
      peeking.setAttribute('src', nuevaRuta);
      coin.classList.add('coin-peeking-animation');
      socket.emit('hover');
    });
    
    peeking.addEventListener('mouseup', () => {
      peeking.setAttribute('src', ruta);
      coin.classList.remove('coin-peeking-animation');
    });

    const navLogoWrapper = document.querySelector('.nav-logo-wrapper');

  navLogoWrapper.addEventListener('click', () => {
    window.location.href = 'index.html'; 
  });