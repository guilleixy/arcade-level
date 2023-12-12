var map = L.map('map').setView([41.59464, -0.94052], 18);

var marker = L.marker([41.59464, -0.94052]).addTo(map);

marker.bindPopup("<b>Arcade Levels</b><br>Carretera Valencia KM 7.8 Nave 72A").openPopup();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);