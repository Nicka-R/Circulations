import { formatDate, formatTime } from './utils.js';
// Fonction principale pour obtenir la position
async function getCurrentPosition() {
    //récupérer la date
    const date = new Date();

    // géolocalisation du navigateur
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        //récupérer la ville 
        const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${position.coords.longitude}&lat=${position.coords.latitude}`);
        const data = await response.json();
        
        const city = data.features[0].properties.city;

        return {
            coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            },
            city: city,
            date: formatDate(date), 
            time: formatTime(date),
        };
    } catch (error) {

        // En cas d'échec, utiliser l'API de géolocalisation IP
        try {
            const ip = await fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => data.ip);
            
            const geolocApi = `http://ip-api.com/json/${ip}`;
            const response = await fetch(geolocApi);
            const data = await response.json();
            
            return {
                coords: {
                    latitude: data.lat,
                    longitude: data.lon,
                },
                city: data.city,
                date: formatDate(date), 
                time: formatTime(date),
            };
        } catch (fallbackError) {
            // Si tout échoue, utiliser les coordonnées par défaut de Nancy
            return {
                coords: {
                    latitude: 48.6921,
                    longitude: 6.1844,
                },
                city: 'Nancy',
                date: date,
                date: formatDate(date), 
                time: formatTime(date),
            };
        }
    }
}

export { getCurrentPosition };