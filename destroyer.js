const container = document.getElementById('destroyer-wrapper');

const nave = document.getElementById('destroyer-nave');

//const naveR = nave.getBoundingClientRect();

//const naveY = naveR.width;

const bala_small = document.getElementById('bala-small');

const bala = document.getElementById('bala-espacio');

const asteroides = document.querySelectorAll('.asteroide');

const naveImg = document.getElementById('nave-img');

const crosshair = document.getElementById('crosshair');

let posNave;

container.addEventListener('mouseenter', (event) => {
    crosshair.style.opacity = 1;
    //container.classList.add('hide-cursor');
    let balaMovimiento = false;
    //esto se podria hacer con una funcion para no repetir codigo
    const containerRect = container.getBoundingClientRect();
    const mouseY = event.clientY - containerRect.top;
    nave.style.top = `${mouseY}px`;

    posNave = mouseY - 5;

    naveImg.style.opacity = 0;

    container.addEventListener('mousemove', (event) => {

        const containerRect = container.getBoundingClientRect();
        const mouseY = event.clientY - containerRect.top;
        nave.style.top = `${mouseY}px`;
        posNave = mouseY -5;

        const mouseX = event.clientX - containerRect.left;

        crosshair.style.top = `${mouseY}px`;
        crosshair.style.left =`${mouseX}px`;

    });
    
    container.addEventListener('click', () => {
        /*
        const keys = document.getElementsByClassName('key');
        for (let i = 0; i < keys.length; i++) {

          const key = keys[i];
            const directionX = Math.random() > 0.5 ? 1 : -1;
            const directionY = Math.random() > 0.5 ? 1 : -1;
            const randomX = Math.floor(Math.random() * 200 + 1);
            const randomY = Math.floor(Math.random() * 200 + 1);
            const asteroideRect = asteroide.getBoundingClientRect();
            key.classList.add('absolute');
            key.style.top = `${asteroideRect.height / 2}px`;
            key.style.left = `${asteroideRect.width / 2}px`;
            setTimeout(()=> {
                key.style.top = `${randomY * directionY}px`;
                key.style.left = `${randomX * directionX}px`;
            },1)
            setTimeout(()=>{
                const duration = Math.floor(Math.random() * 6000) + 2000; // Generar duración aleatoria entre 1 y 2 segundos
                key.style.animationDuration = `${duration}ms`;
                key.classList.add('deriva-anim');
            },500);

            console.log(key);
        }
        asteroide.style.backgroundImage = 'url("horarios/explosion1.png")';

        setTimeout(()=>{
            asteroide.style.backgroundImage = 'url("horarios/explosion2.png")';
        },80);
        setTimeout(()=>{
            asteroide.style.backgroundImage = 'url("horarios/explosion3.png")';
        },150);
*/

//crear una funcion para explosion, se envia el asteroide y se ejecutan las animaciones ahi
        if (balaMovimiento) {
            return; 
        }
        else{
            bala_small.style.left = "65px";
            bala_small.style.top = `${posNave + nave.offsetHeight / 2}px`;
            bala.style.left = "65px";
            bala.style.top = `${posNave + nave.offsetHeight / 2}px`;
            bala_small.style.opacity = 1;
            balaMovimiento = true;

            asteroides.forEach((asteroide)=>{
                let top = asteroide.offsetTop;
                let bot = asteroide.offsetHeight + asteroide.offsetTop;
                let balaTop = parseInt(bala.style.top);
                if (balaTop > top && balaTop < bot) {
                    const blur = asteroide.querySelector('.asteroide-blur');
                    let estilo = getComputedStyle(asteroide);
                    const bg_original = estilo.backgroundImage;
                    const leftValue = parseFloat(estilo.left); 

                    let porcentaje = (leftValue / container.offsetWidth) * 100; //obtenemos el % del container en el que esta el asteroide

                    setTimeout(()=>{
                        const keys = asteroide.getElementsByClassName('key');
                        blur.style.filter = "blur(50px)";
                        blur.classList.remove('rotate-anim');
                        blur.classList.add('expand-anim');
                        if(keys[1].classList.contains('absolute')){
                            return;
                        }
                        else{
                            for (let i = 0; i < keys.length; i++) {
                                const key = keys[i];
                                  const directionX = Math.random() > 0.5 ? 1 : -1;
                                  const directionY = Math.random() > 0.5 ? 1 : -1;
                                  const randomX = Math.floor(Math.random() * 800 + 1);
                                  const randomY = Math.floor(Math.random() * 800 + 1);
                                  const asteroideRect = asteroide.getBoundingClientRect();
                                  key.classList.add('absolute');
                                  key.style.top = `${asteroideRect.height / 2}px`;
                                  key.style.left = `${asteroideRect.width / 2}px`;
                                  setTimeout(()=> {
                                      key.style.top = `${randomY * directionY}px`;
                                      key.style.left = `${randomX * directionX}px`;
                                  },1);
                                  setTimeout(()=>{
                                      const duration = Math.floor(Math.random() * 6000) + 2000; // Generar duración aleatoria entre 1 y 2 segundos
                                      key.style.animationDuration = `${duration}ms`;
                                      key.classList.add('deriva-anim');
                                  },500);
                                  setTimeout(()=>{
                                    key.style.top = `${asteroideRect.height / 2}px`;
                                    key.style.left = `${asteroideRect.width / 2}px`;
                                    key.classList.remove('absolute');
                                    asteroide.style.backgroundImage = bg_original;
                                  },9000)
                              } 
                              asteroide.style.backgroundImage = 'url("horarios/explosion1.png")';
                      
                              setTimeout(()=>{
                                  asteroide.style.backgroundImage = 'url("horarios/explosion2.png")';
                              },80);
                              setTimeout(()=>{
                                  asteroide.style.backgroundImage = 'url("horarios/explosion3.png")';
                              },150);
                              setTimeout(()=>{
                                  asteroide.classList.add('fade-out-anim');
                              },3000); 
                        }
                        bala.style.opacity = 0;
                    }, 10 *  porcentaje); // la animacion de la bala dura 1 segundo. por tanto el % * 10 sera el tiempo en ms para que la bala llegue al asteroide
                    setTimeout(()=>{
                        blur.classList.remove('expand-anim');
                        blur.classList.add('rotate-anim');
                        asteroide.classList.remove('fade-out-anim');
                        asteroide.classList.add('fade-in-anim');
                    },15000)
                    asteroide.classList.remove('fade-in-anim');
                }
            });

            setTimeout(() => {
                bala_small.style.opacity = 0;
                bala.style.opacity = 1;
                bala.style.left = `${container.clientWidth}px`;
            }, 150);
            setTimeout(() => {
                bala.style.opacity = 0;
                bala.style.left = "65px";
            }, 1001); 
            setTimeout(() => {
                balaMovimiento = false;
            }, 1500); 
        }
    });
});

container.addEventListener('mouseleave', () => {
   // container.classList.remove('hide-cursor');
    naveImg.style.opacity = 1;
    crosshair.style.opacity = 0;
});

