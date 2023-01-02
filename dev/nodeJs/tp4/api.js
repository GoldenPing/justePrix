require('dotenv').config()
const api = process.env.API_KEY;

// const res = apiWeatherReq('current', 'Grenoble')
// console.log(res.then(resolve => {
//     console.log(resolve)}))

main();


async function apiWeatherReq(url, days = '', ville = 'Grenoble') {
    const base = 'http://api.weatherapi.com/v1' + url +
        '?key=' + api +
        "&q=" + ville +
        "&days=" + days
    const params = {
        method: "GET",

    }
    return await fetch(base, params).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('Mauvaise réponse')
        }
    }).catch(error => {
        console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message)
    })
}

async function main() {
    const [moyReq, humReq] = await Promise.all([apiWeatherReq('/forecast.json', 5), apiWeatherReq('/forecast.json', 1)])

    const sumRes = moyReq.forecast.forecastday
        .map(e => e.day.avgtemp_c)
        .reduce((a, b) => a + b, 0)
    const moyRes = sumRes / moyReq.forecast.forecastday.length
    const humRes = humReq.forecast.forecastday[0].hour.map(e => e.humidity).reduce((a, b) => {
        if (b > a) {
            return b;
        }
        return a
    }, 0)
    console.log("Exo 1:")
    console.log("Moyenne des 5 dernière température", moyRes)
    console.log("Exo 2:")
    console.log("Humidité", humRes)

    const ville = ['Grenoble', 'Tokyo', 'New York'];

    const weatherData = await showData(ville)
    console.log("Exo 3:")
    console.log("Températures Villes : ",weatherData)

    const jourSorted = await sortJourTemp()
    console.log("Exo 4:")
    console.log(jourSorted)

    const upedTemp = await upTemp()
    console.log("Exo 5:")
    console.log(upedTemp)

    console.log("Exo 6:")
    const countedJour = await countDay()
    console.log(countedJour)
}

async function countDay(){
    const data = await apiWeatherReq('/forecast.json',1)
    const forecast = [... data.forecast.forecastday];
    return  forecast[0].hour.reduce((a,b) => {
       if (b.temp_c > forecast[0].day.avgtemp_c){
           a++;
       }
       return a
    },0)
}

async function upTemp(){
    const data = await apiWeatherReq('/current.json')
    data.current.temp_c += 2
    data.current.temp_f = (data.current.temp_c * 9/5) + 32
    return data;
}

async function sortJourTemp(){
    const data = await apiWeatherReq('/forecast.json',4)
    const forecast = [... data.forecast.forecastday]
        forecast.sort((a,b) => {
          return parseFloat(b.day.avgtemp_c) + parseFloat(a.day.avgtemp_c)})
    //console.log(sortedForecast)
      return forecast.map(a => [a.date,a.day.avgtemp_c]);
}

async function showData(ville) {
    const data = ville.map(e => {
        return Promise.all([apiWeatherReq('/forecast.json', 5, e), apiWeatherReq('/forecast.json', 1, e)])
    })
    const villeData = await Promise.all(data)

    return villeData.map(ville => {
        const sumRes = ville[0].forecast.forecastday
            .map(e => e.day.avgtemp_c)
            .reduce((a, b) => a + b, 0)
        const moyRes = sumRes / ville[0].forecast.forecastday.length
        const humRes = ville[1].forecast.forecastday[0].hour.map(e => e.humidity).reduce((a, b) => {
            if (b > a) {
                return b;
            }
            return a
        }, 0)
        let retour = [];
        retour[ville[0].location.name] = {"temperature": moyRes, "humidite": humRes}
        return retour;
    });
}
