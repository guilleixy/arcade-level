import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.min.js';



const provisional = document.querySelector('.container-provisional');

provisional.addEventListener('click', (event) => {
    provisional.classList.remove('container-provisional-dim');
    provisional.classList.add('container-provisional-dim-2');
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

