import { getCovidData, getWasteWaterCovidData, createCovidChart } from './covid.js';
import { getPollutionData } from './pollution.js';
import { getCurrentPosition } from './geolocation.js';
import { getMeteoData } from './meteo.js';
import { getCovidRecommendation, getPollutionRecommendation, getMeteoRecommendation } from './recommendations.js';

/**
 * fonction qui affiche la localisation de l'utilisateur
 */
async function displayLocation() {
    const locationInfo = document.getElementById('location-info');
    const location = await getCurrentPosition();
    locationInfo.innerHTML = `<div class="location-details">
                                    <span> ${location.city} </span>
                                    <span> ${location.date} </span>
                                    <span> ${location.time} </span>
                                </div>`;
}

/**
 * fonction qui affiche les données du covid et les graphiques associés
 */
async function displayCovidData() {
    try {
        const data = await getCovidData();
        const wasteWaterData = await getWasteWaterCovidData();
        const recommandation = getCovidRecommendation(data, wasteWaterData);
        document.getElementById('covid-recommendation').innerHTML = `<span>${recommandation}</span>`;
        createCovidChart('covid-chart-txpos', data, 'Taux de positivité', 'tx_pos', 'red');
        createCovidChart('covid-chart-hosp', data, 'Nombre d\'hospitalisations', 'hosp', 'green');
        createCovidChart('covid-chart-rea', data, 'Nombre de réanimations', 'rea', 'orange');
        createCovidChart('covid-chart-maxeville', wasteWaterData, 'Présence de Covid dans les eaux usées à Maxéville', 'maxeville');
    } catch (error) {
        console.error(error);
    }
}

/**
 * fonction qui affiche les données de la pollution et la recommendation
 */
async function displayPollutionData() {
    try {
        const position = await getCurrentPosition();
        const pollutionData = await getPollutionData(position.coords.latitude, position.coords.longitude);
        const recommendation = getPollutionRecommendation(pollutionData);
        document.getElementById('air-quality').innerHTML = `
            <div class="air-quality-header">
                <h2>Qualité de l'air : ${pollutionData.lib_qual}</h2>
            </div>
            <div class="air-quality-details">
                <div class="air-quality-color" style="background-color: ${pollutionData.coul_qual}">
                    <span>${pollutionData.code_qual}</span>
                </div> 
                <p>${recommendation}</p>
            </div>
            `;
    } catch (error) {
        console.error(error);
    }
}

/**
 * fonction qui affiche les données météo et la recommendation
 */
async function displayMeteoData() {
    try {
        const position = await getCurrentPosition();
        const meteoData = await getMeteoData(position.coords.latitude, position.coords.longitude);
        const recommendation = getMeteoRecommendation(meteoData);

        document.getElementById('weather-info').innerHTML += `
            <h2>Météo</h2>
            <span>${recommendation}</span>
            <div id="weather-container"></div>
            `;
    
        
        document.getElementById('weather-container').innerHTML += meteoData.map((data) => {
            const icon = getWeatherIcon(data);
            return `
                <div class="weather-card" onclick="this.querySelector('.weather-details').style.display = this.querySelector('.weather-details').style.display === 'none' ? 'block' : 'none'">
                    <span class="weather-hour">${data.hour}h</span>
                    <span class="weather-icon">${icon}</span>
                    <span class="weather-temp">${data.temperature}°C</span>
                    <div class = "weather-details" style="display:none">
                        <span>Pluie: ${data.rain}mm</span>
                        <span>Vent: ${data.wind}km/h</span>
                        <span>Hum. ${data.humidity}%</span>
                        <span>Pression ${data.pressure}hPa</span>
                    </div>
                </div>
            `;
        }).join('');
            
    } catch (error) {
        console.error(error);
    }
}

/**
 * fonction qui retourne l'emoji correspondant à la météo
 * @param {*} data données météo
 * @returns emoji
 */
function getWeatherIcon(data) {
    if (data.snow === 'oui') {
        return '❄️';
    } else if (data.rain > 0) {
        return '🌧️';
    } else if (data.wind > 50) {
        return '💨';
    } else if (data.temperature > 30) {
        return '🌞';
    } else if (data.temperature < 0) {
        return '☁️';
    } else {
        return '☀️';
    }
}


export {displayLocation, displayCovidData, displayPollutionData, displayMeteoData }