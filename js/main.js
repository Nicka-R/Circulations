import { getCurrentPosition } from './geolocation.js';
import { getStations, getAvailableVelos } from './station.js';
import { displayLocation,displayCovidData, displayPollutionData, displayMeteoData } from './ui.js';
document.addEventListener('DOMContentLoaded', async () => {
    // Variables globales
    let userLocation = null;
    let map = null;

    // initialisation de la carte Leaflet
    function initMap(position) {
        map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        return map;
    }

    const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    // Fonction principale d'initialisation
    async function initialize() {
        try {
            // Obtenir la géolocalisation
            userLocation = await getCurrentPosition();
            
            // Initialiser la carte
            map = initMap(userLocation);

            // Ajouter un marqueur à la position de l'utilisateur 
            L.marker([userLocation.coords.latitude, userLocation.coords.longitude], { icon: redIcon }).addTo(map)
                .bindPopup('📌 Vous êtes ici')
                .openPopup();
            
            // Obtenir les stations
            const stations = await getStations();
            const availableVelos = await getAvailableVelos();

            //marqueurs des stations et le nombre de vélos disponibles dans chaque station
            stations.forEach(station => {
                L.marker([station.lat, station.lon]).addTo(map)
                    .bindPopup(`<h1>${station.name}</h1>
                                <p><a href="https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}" target="_blank">${station.address}</a></p>
                                <p> ${availableVelos.find(velo => velo.station_id === station.station_id).num_bikes_available} vélos disponibles </p>
                                <p> ${availableVelos.find(velo => velo.station_id === station.station_id).num_docks_available} places disponibles </p>`);
            }
            );

            // Afficher les données
            displayLocation(userLocation);
            displayCovidData();
            displayPollutionData();
            displayMeteoData();
           
            
        } catch (error) {
            console.error(error);
        }
    }

    initialize();
});
