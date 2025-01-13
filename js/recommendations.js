/**
 * fonction qui donne des recommendations en fonction des données de pollution
 * @param {*} pollutionData 
 * @returns 
 */
function getPollutionRecommendation(pollutionData) {
    const recommendation = [];
    if (pollutionData.code_qual === 1) {
        recommendation.push('La qualité de l\'air est bonne, profitez-en pour prendre l\'air 😊');
    } else if (pollutionData.code_qual === 2) {
        recommendation.push('La qualité de l\'air est moyenne, évitez les efforts intenses 😐');
    } else if (pollutionData.code_qual === 3) {
        recommendation.push('La qualité de l\'air est mauvaise, évitez les activités en extérieur 😷');
    } else if (pollutionData.code_qual >= 4) {
        recommendation.push('La qualité de l\'air est très mauvaise, restez chez vous 🚫');
    } else {
        recommendation.push('La qualité de l\'air est inconnue ❓');
    }

    return recommendation;

}


/**
 * fonction qui donne des recommendations sur le fait de prendre son vélo
 * en fonction des données de la météo
 * @param {Array} meteoData - données météo
 */

function getMeteoRecommendation(meteoData) {
    const recommendation = new Set();

    let hasHighTemperature = false;
    let hasRain = false;
    let hasSnow = false;
    let hasStrongWind = false;

    meteoData.forEach(data => {
        if (data.temperature > 20) {
            hasHighTemperature = true;
        }
        if (data.rain > 0) {
            hasRain = true;
        }
        if (data.snow === 'oui') {
            hasSnow = true;
        }
        if (data.wind > 50) {
            hasStrongWind = true;
        }
    });

    if (hasHighTemperature) {
        recommendation.add('Il fait chaud, pensez à vous hydrater 🌞');
    }
    if (hasRain) {
        recommendation.add('Il risque pleuvoir, pensez à prendre un anorak ☔');
    }
    if (hasSnow) {
        recommendation.add('Il va neiger, attention aux routes ❄️');
    }
    if (hasStrongWind) {
        recommendation.add('⚠️ Attention, risque de tempête ⚠️');
    }

    //sinon
    if (recommendation.size === 0) {
        recommendation.add('Les conditions météo sont idéales pour prendre votre vélo 🚴‍♂️');
    }

    return Array.from(recommendation).join(' ');
}

/** 
 * fonction qui détermine la recommandation pour le covid en fonction des données du covid et des eaux usées
 * @param {Array} data - données du covid
 * @param {Array} wasteWaterData - données du covid dans les eaux usées
 */
function getCovidRecommendation(data, wasteWaterData) {
    const recommendations = [];
    const latestData = data[data.length - 1];
    const latestWasteWaterData = wasteWaterData[wasteWaterData.length - 2];

    if (latestData.tx_pos) {
        recommendations.push('Le taux de positivité est très élevé, restez chez vous 🏠');
    }
    if (latestData.hosp > 100) {
        recommendations.push('Le nombre d\'hospitalisations est très élevé, restez chez vous 🏥');
    }
    if (latestData.rea > 50) {
        recommendations.push('Le nombre de réanimations est très élevé, restez chez vous 🚑');
    }
    if (latestWasteWaterData.maxeville >  1000 ) {
        recommendations.push('La présence de Covid dans les eaux usées est élevée, restez chez vous 🏠');
    }

    //sinon
    if (recommendations.length === 0) {
        recommendations.push('La situation est sous contrôle, respectez tout de même les gestes barrières 😷');
    }
    return recommendations.join(' ');
}

export {getCovidRecommendation, getPollutionRecommendation, getMeteoRecommendation };