import { io } from 'socket.io-client';

    const socket = io('http://localhost:3000');
    const hoverElements = document.querySelectorAll('#coin-add');

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
      let hoverTimeout = null;
    
      hoverElement.addEventListener('mouseenter', () => {
        if (hoverTimeout) {
          // Si ya hay un retraso en curso, lo cancelamos
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
    
        // Creamos un nuevo retraso de 1 segundo antes de emitir el evento "hover"
        hoverTimeout = setTimeout(() => {
          console.log("si");
          socket.emit('hover');
          hoverTimeout = null; // Restablecemos el valor de hoverTimeout
        }, 1000);
      });
    });
    