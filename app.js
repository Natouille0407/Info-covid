const apiUrl = 'https://disease.sh/v3/covid-19/countries/france';

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data)

    let svgMapDataGPD = {
      data: {
        cas: {
          nb: data.cases
        },

        death: {
          nb: data.deaths
        },

        tests: {
          nb: data.tests
        }

      },
      applyData: 'gdpAdjusted',
      values: {
        FR: { cas: "nombre de cas : " + data.cases, death: "nombres de mort : " + data.deaths, tests: "nombres de test : " + data.tests},
        link: 'https://cssscript.com',
        linkTarget: '_blank'
      }
    };

    new svgMap({
      targetElementID: 'svgMapExample',
      data: svgMapDataGPD
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  }); 
