// variables globals

let countries = 0;

// globe terrestre

document.addEventListener('DOMContentLoaded', function () {
    // Sélectionner le conteneur
    const container = document.getElementById('globeContainer');

    // Configurer et initialiser le globe
    const myGlobe = Globe({
        rendererConfig: {
            antialias: true,
            alpha: true
        },
        waitForGlobeReady: true,
        animateIn: true
    })(container)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .pointsData([
            { lat: 48.87, lng: 2.33, label: 'Paris' },
        ]);

    myGlobe
        .showGlobe(true)
        .showGraticules(false)
        .showAtmosphere(true)
        .atmosphereColor('lightskyblue')
        .atmosphereAltitude(0.15);

    myGlobe.render();
});

function fetchCountries() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch("https://disease.sh/v3/covid-19/countries", requestOptions)
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => console.error(error));
}

fetchCountries().then((countries) => {
    countries.forEach(function(country) {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        return fetch("https://restcountries.com/v3.1/name/", requestOptions)
            .then((response) => response.json())
            .then((result) => result)
            .catch((error) => console.error(error));
            
    });
});

// Graphique

// Effectuer une requête à l'API pour obtenir les données
fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
        // Extraire le nombre de personnes infectées et guéries
        const infected = data.cases;
        const recovered = data.recovered;

        // Créer un graphique en donut
        const donutChart = new Chart(document.getElementById('donutChart'), {
            type: 'doughnut',
            data: {
                labels: ['Cases', 'Recovered'],
                datasets: [{
                    data: [infected, recovered],
                    backgroundColor: ['#FF5733', '#33FF57']
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Nombre de personnes infectées et guéries'
                }
            }
        });
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    });

fetch('https://disease.sh/v3/covid-19/historical/all')
    .then(response => response.json())
    .then(data => {
        const dates = Object.keys(data.cases);
        const casesData = Object.values(data.cases);

        const lineChart = new Chart(document.getElementById('lineChart'), {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Nombre de cas de COVID-19',
                    data: casesData,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Nombre de cas'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return new Intl.NumberFormat().format(context.parsed.y);
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
    });