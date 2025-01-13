/**
 * fonction qui récupère les données météo de l'API Infoclimat
 * @param {*} lat latitude de la position
 * @param {*} lon longitude de la position
 * @returns 
 */
async function getMeteoData(lat, lon) {
    const response = await fetch(`https://www.infoclimat.fr/public-api/gfs/xml?_ll=${lat},${lon}&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2`);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const meteoData = [];
    const echeances = xmlDoc.getElementsByTagName("echeance");
    for (let i = 0; i < 8; i++) {
        const echeance = echeances[i];
        const timestamp = echeance.getAttribute("timestamp");
        const hour = timestamp.split(" ")[1].substring(0, 5);
        const temperature = parseFloat(echeance.getElementsByTagName("temperature")[0].getElementsByTagName("level")[0].textContent) - 273.15;
        const humidity = parseFloat(echeance.getElementsByTagName("humidite")[0].getElementsByTagName("level")[0].textContent);
        const rain = parseFloat(echeance.getElementsByTagName("pluie")[0].textContent);
        const snow = echeance.getElementsByTagName("risque_neige")[0].textContent;
        const pressure = parseFloat(echeance.getElementsByTagName("pression")[0].getElementsByTagName("level")[0].textContent) / 100;
        const wind = parseFloat(echeance.getElementsByTagName("vent_moyen")[0].getElementsByTagName("level")[0].textContent);

        meteoData.push({
            hour: hour,
            temperature: temperature.toFixed(1),
            humidity: humidity.toFixed(1),
            rain: rain.toFixed(1),
            snow: snow,
            pressure: pressure.toFixed(1),
            wind: wind.toFixed(1)
        });
    }

    return meteoData;
}


export { getMeteoData };