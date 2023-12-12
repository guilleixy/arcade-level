const burgerButton = document.getElementById("burger-nav");

const nav = document.querySelector('.nav-list');

console.log(burgerButton);

let menuToggled = false;

function toggleNavMenu (){
    if(menuToggled){
        burgerButton.src = "burger1.gif";
        nav.classList.remove('mobile-hidden');
        console.log("hola");
    }
    else{
        burgerButton.src = "burger2.gif";
    }
}