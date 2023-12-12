import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.min.js';

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

/*

const provisional = document.querySelector('.container-provisional');

provisional.addEventListener('click', (event) => {
    provisional.classList.remove('container-provisional-dim');
    provisional.classList.remove('pointer');
    provisional.classList.add('container-provisional-dim-2');
    provisional.classList.add('padding-1');
    const hiddenElements = provisional.querySelectorAll('.hidden');
    hiddenElements.forEach((element) => {
      element.classList.remove('hidden');
    });         
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        // fade: true,
        asNavFor: '.slider-nav',
        centerMode: true
      });
      $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: true,
        centerMode: true,
        focusOnSelect: true,
        arrows: false
      }); 
    
});

document.addEventListener('click', (event) => {
    if (!provisional.contains(event.target)) {
      provisional.classList.remove('container-provisional-dim-2');
      provisional.classList.add('container-provisional-dim');
    }
  });

*/


const arcade_carteles = document.querySelectorAll('.panel-arcade');

arcade_carteles.forEach(arcade_cartel =>{
  const hidden = arcade_cartel.querySelectorAll('.hidden');
  const gradiente = arcade_cartel.querySelector('.gradient-up');

  const initialClasses = [...arcade_cartel.classList];
  arcade_cartel.addEventListener('click', (event) => { //si ya hay un cartel activo es como que esto no ocurre pero si se añaden las clases? entonces
    gradiente.style.display = 'none';                  //de momento  lo hago cutre y simula un click para que el slick funcione
    arcade_cartel.classList.remove('inline-block');
    arcade_cartel.classList.remove('hover-red-border');
    //arcade_cartel.classList.remove('scale-1'); //hay que usar los margenes para usar scale pero si hace falta hacer todo mas pequeño servira perfecto
    arcade_cartel.classList.remove('pointer');
    arcade_cartel.classList.add('flex');
    arcade_cartel.classList.add('fake-panel-arcade-dim');
    arcade_cartel.classList.add('small-shadow');
    //para que aparezca la animacion entre inline y flex ponemos unas dimensiones falsas por 1 milisegundo
    setTimeout(()=>{
      arcade_cartel.classList.remove('fake-panel-arcade-dim');
      arcade_cartel.classList.add('panel-arcade-dim');
    },1);
    hidden.forEach(element => {
      element.classList.remove('hidden');
    });

    setTimeout(()=>{ //espera 1 ms para cargarlo para que de tiempo al anterior a quitarse
      $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        // fade: true,
        asNavFor: '.slider-nav',
        centerMode: true
      });
      $('.slider-nav').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: true,
        centerMode: true,
        focusOnSelect: true,
        arrows: false
      }); 
    },1) 
  });
  
  let timeoutcont = true;
  
  arcade_cartel.addEventListener('mouseenter', ()=>{
    if(timeoutcont && arcade_cartel.classList.contains('hover-red-border')){
      socket.emit('hover');
      timeoutcont = false;
    }
    else{
      return;
    }
    setTimeout(()=>{
      timeoutcont  =  true;
    },1000); 
  });
  document.addEventListener('click', (event) => {
    if (!arcade_cartel.contains(event.target) && arcade_cartel.classList.contains('panel-arcade-dim')) {

      const currentClasses = [...arcade_cartel.classList];
      const classesToRemove = currentClasses.filter(className => !initialClasses.includes(className));
      const classesToAdd = initialClasses.filter(className => !currentClasses.includes(className));

      arcade_cartel.classList.add('fake-panel-arcade-dim');
      setTimeout(()=>{
        arcade_cartel.classList.remove('fake-panel-arcade-dim');
        classesToRemove.forEach(className => {
          arcade_cartel.classList.remove(className);
        });
    
        classesToAdd.forEach(className => {
          arcade_cartel.classList.add(className);
        });
      },1);

      hidden.forEach(element => {
        element.classList.add('hidden');
      });
      gradiente.style.display = 'flex';
      if ($('.slider-for').hasClass('slick-initialized')) {
        $('.slider-for').slick('unslick');
        console.log("quitado");
      }
      
      if ($('.slider-nav').hasClass('slick-initialized')) {
        $('.slider-nav').slick('unslick');
      }
    }
  });
});
/*
const arcade_cartel = document.querySelector('.panel-arcade'); //selecciona el elemento con clase .hover-red-border

arcade_cartel.addEventListener('click', (event) => {
  const gradiente = arcade_cartel.querySelector('.gradient-up');
  gradiente.style.display = 'none';
  arcade_cartel.classList.remove('inline-block');
  arcade_cartel.classList.remove('hover-red-border');
  arcade_cartel.classList.remove('pointer');
  arcade_cartel.classList.add('flex');
  arcade_cartel.classList.add('fake-panel-arcade-dim');
  //para que aparezca la animacion entre inline y flex ponemos unas dimensiones falsas por 1 milisegundo
  setTimeout(()=>{
    arcade_cartel.classList.remove('fake-panel-arcade-dim');
    arcade_cartel.classList.add('panel-arcade-dim');
  },1);
  const hidden = arcade_cartel.querySelectorAll('.hidden');
  hidden.forEach(element => {
    element.classList.remove('hidden');
  });
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    // fade: true,
    asNavFor: '.slider-nav',
    centerMode: true
  });
  $('.slider-nav').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: true,
    centerMode: true,
    focusOnSelect: true,
    arrows: false
  }); 
});

let timeoutcont = true;

arcade_cartel.addEventListener('mouseenter', ()=>{
  if(timeoutcont){
    socket.emit('hover');
    timeoutcont = false;
  }
  else{
    return;
  }
  setTimeout(()=>{
    timeoutcont  =  true;
  },1000);
}); */