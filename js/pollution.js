import { calculateDistance } from './utils.js';
/**
 * fonction pour obtenir les données de pollution 
 * @param {*} lat 
 * @param {*} lon 
 * @returns 
 */
async function getPollutionData(lat, lon) {
    const link = `https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=`;
    const response = await fetch(link);
    const data = await response.json();
    const features = data.features;

    let closestFeature = null;
    let minDistance = Infinity;

    for (const feature of features) {
        const { y_wgs84, x_wgs84 } = feature.attributes;
        const distance = calculateDistance(lat, lon, y_wgs84, x_wgs84);
        if (distance < minDistance) {
            minDistance = distance;
            closestFeature = feature;
        }
    }

    if (closestFeature) {
        return closestFeature.attributes;
    } else {
        throw new Error('No nearby city found');
    }
}



export { getPollutionData }