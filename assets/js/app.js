// variables globals

let countriesTab = [];
let countries = 0;
let myGlobe;

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('globeContainer');
    
    myGlobe = Globe({
        rendererConfig: {
            antialias: true,
            alpha: true
        },
        waitForGlobeReady: true,
        animateIn: true
    })(container)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .pointsData([])
        .pointAltitude([0.1]);

    myGlobe
        .showGlobe(true)
        .showGraticules(false)
        .showAtmosphere(true)
        .atmosphereColor('lightskyblue')
        .atmosphereAltitude(0.3);

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

function fetchCountryInfo(countryName) {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch(`https://restcountries.com/v3.1/name/${countryName}`, requestOptions)
        .then((response) => response.json())
        .then((result) => result)
        .catch((error) => console.error(error));
}

fetchCountries().then((countries) => {

    console.log(countries)

    countries.forEach(function (country) { 

        fetchCountryInfo(country.country).then((countryInfo) => {
            const latitude = countryInfo[0].latlng[0];
            const longitude = countryInfo[0].latlng[1];
            console.log(`Latitude of ${country.country}: ${latitude}`);
            console.log(`Longitude of ${country.country}: ${longitude}`);
            
            countriesTab.push({ 
                lat: latitude, 
                lng: longitude, 
                label: country.country, 
            });
            console.log(countriesTab)
            myGlobe.pointsData(countriesTab)

        }).catch((error) => console.error(error));

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

    fetchCountries()