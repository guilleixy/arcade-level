window.addEventListener('load', function() {
    // Obtén el elemento de la sección por su id
    const tarifasSection = document.getElementById('tarifas-section');
    
    // Verifica si la sección existe en la página
    if (tarifasSection) {
      // Realiza el desplazamiento suave hacia la sección
      tarifasSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
