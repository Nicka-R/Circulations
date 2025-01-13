// fonction pour récupérer les données du covid en csv avec cette url : https://www.data.gouv.fr/fr/datasets/r/5c4e1452-3850-4b59-b11c-3dd51d7fb8b5

/**
 * fonction pour récupérer les données du covid
 * @returns {Array} - données du covid
 */
async function getCovidData() {
    const response = await fetch('https://www.data.gouv.fr/fr/datasets/r/5c4e1452-3850-4b59-b11c-3dd51d7fb8b5');
    const data = await response.text();
    //on ne veut que les données de la meurthe et moselle et la date et tout le reste
    const rows = data.split('\n');
    const result = rows.filter(row => row.includes('Meurthe-et-Moselle')).map(row => {
        const values = row.split(',');
        return {
            date: values[1],
            tx_pos: values[5],
            hosp: values[9],
            rea: values[10]
        };
    });
    return result;
}

/**
 * fonction qui permet de dessiner un graphique pour les données du covid
 * @param {*} chartId le nom de l'id du graphique en html
 * @param {*} data les données du covid
 * @param {*} label le nom du label
 * @param {*} row_name le nom de la colonne
 * @param {*} color la couleur du graphique
 * @returns 
 */
function createCovidChart(chartId, data, label, row_name, color = 'blue') {
    const ctx = document.getElementById(chartId).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(row => row['date']),
            datasets: [{
                label: label,
                data: data.map(row => row[row_name]),
                borderColor: color,
                fill: true,
            }]
        }
    });
    return chart;
}

// API pour récupérer les données du covid en csv dans les égouts https://www.data.gouv.fr/fr/datasets/r/2963ccb5-344d-4978-bdd3-08aaf9efe514
/**
 * fonction qui récupère les données du covid dans les eaux usées à Maxéville
 * @returns {Array} - données du covid dans les eaux usées
 */
async function getWasteWaterCovidData() {
    const response = await fetch('https://www.data.gouv.fr/fr/datasets/r/2963ccb5-344d-4978-bdd3-08aaf9efe514');
    const data = await response.text();
    const rows = data.split('\n');
    const headers = rows[0].split(';');
    const maxevilleIndex = headers.indexOf('\"MAXEVILLE\"');
    
    //récupérer la colonne de maxeville avec maxevilleIndex
    // pour chaque ligne récupérer la semaine [0] et la colonne de [maxevilleIndex]
    const result = rows.slice(1).map(row => {
        const values = row.split(';');
        return {
            date: values[0].replace(/"/g, ''),
            maxeville: parseFloat(values[maxevilleIndex]) || 0
        };
    }).filter(row => !isNaN(row.maxeville))
    ; 
    return result;
}

export { getCovidData, getWasteWaterCovidData, createCovidChart };