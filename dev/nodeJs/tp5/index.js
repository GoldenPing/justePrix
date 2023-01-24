const express = require('express')
const app = express()
const port = 3000
require('dotenv').config()
const api = process.env.API_KEY;
console.log(api)

app.get('/', (req, res) => {
    const link = [
        "jour chaud", "monter temperature", "trie jour", "montrer villes",
    ]
    res.send(
        "<h1>Hello</h1>" +
        "<h2>Voici quelque route d'api : </h2>" +
        link.join("<br>"));
})

app.get('/villes', async (req, res) => {
    try {
        const data = await showData(req.query.villes.split(','))
        console.log('get villes' ,data)
        res.json(data)
    }catch (e){
        console.log(e)
        next(e);
    }
})

app.get('/test',async (req,res)=> {
    const base = 'http://api.weatherapi.com/v1/current.json'+
        '?key=' + api +
        "&q=Grenoble";
    const params = {
        method: "GET",

    }
     const response = await fetch(base, params)
    const data = await response.json()
    res.send(data)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


async function apiWeatherReq(url, days = '', ville = 'Grenoble') {
    const base = 'http://api.weatherapi.com/v1' + url +
        '?key=' + api +
        "&q=" + ville +
        "&days=" + days
    const params = {
        method: "GET",

    }
    try{
    const response =  await fetch(base, params)
        if (response.ok) {
            return response.json();
        } else {
            console.log('Mauvaise réponse')
        }
    }catch(error)  {
        console.log('Il y a eu un problème avec l\'opération fetch : ' + error.message)
    }
}

async function countDay() {
    const data = await apiWeatherReq('/forecast.json', 1)
    const forecast = [...data.forecast.forecastday];
    return forecast[0].hour.reduce((a, b) => {
        if (b.temp_c > forecast[0].day.avgtemp_c) {
            a++;
        }
        return a
    }, 0)
}

async function upTemp() {
    const data = await apiWeatherReq('/current.json')
    data.current.temp_c += 2
    data.current.temp_f = (data.current.temp_c * 9 / 5) + 32
    return data;
}

async function sortJourTemp() {
    const data = await apiWeatherReq('/forecast.json', 4)
    const forecast = [...data.forecast.forecastday]
    forecast.sort((a, b) => {
        return parseFloat(b.day.avgtemp_c) + parseFloat(a.day.avgtemp_c)
    })
    //console.log(sortedForecast)
    return forecast.map(a => [a.date, a.day.avgtemp_c]);
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