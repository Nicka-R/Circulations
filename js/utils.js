/**
 * fonction qui permet de calculer la distance entre deux points géographiques
 * @param {*} lat1 latitude du premier point 
 * @param {*} lon1 longitude du premier point
 * @param {*} lat2 latitude du deuxième point
 * @param {*} lon2 longitude du deuxième point
 * @returns la distance en km
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

function formatDate(date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
}

function formatTime(date) {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleTimeString('fr-FR', options);
}

export { calculateDistance, formatDate, formatTime };