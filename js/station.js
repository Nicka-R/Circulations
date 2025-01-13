/**
 * fonction pour obtenir les données des stations
 * @returns {Array} - données des stations
 */
async function getStations() {
    const response = await fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/station_information.json');
    const data = await response.json();
    return data.data.stations;
}

/**
 * fonction pour récupérer les vélos disponibles dans les stations
 * @returns {Array} - données des vélos disponibles
 */
async function getAvailableVelos() {
    const response = await fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/station_status.json');
    const data = await response.json();
    return data.data.stations;
}

export { getStations, getAvailableVelos };