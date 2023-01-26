import puppeteer from 'puppeteer';
import fetch from "node-fetch";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.meteo-grenoble.com/previsions');

    // const allLine = await page.waitForSelector('.forecast-line');
    const dateWeekDayContentArray = await getContent(".forecast-line__date--dow",page)
    const dateDayContentArray = await getContent(".forecast-line__date--day",page)
    let tempContentArray = await getContent(".forecast-line__pictos--temp",page)
    tempContentArray = (tempContentArray.map((e,k)=>{
        if (k %2 === 0){
            return [e,tempContentArray[k+1]];
        }
    })).filter(e => e !== undefined)
    const dirWindContentArray = await getContent('.forecast-line__wind--direction',page)
    let speedWindContentArray = await getContent('.forecast-line__wind--speed',page)
    speedWindContentArray = speedWindContentArray.map(e => e.replace(/(\r\n|\n|\r)/gm,'').substring(-4))

    let rainContentArray = await getContent('.forecast-line__additionnal--rain-quantity', page)

    rainContentArray = rainContentArray.map(e => {
       return e.match(/[0-9]+mm/g).indexOf('0mm') === -1
    })

    const retour = new Array(dateWeekDayContentArray.length).fill('').map((e,k) =>{
        return {
            date: {
                jourName: dateWeekDayContentArray[k],
                jourNum: parseInt(dateDayContentArray[k]),
            },
            temperature: {
                tempMin: tempContentArray[k][0],
                tempMax: tempContentArray[k][1],
            },
            wind: {
                dir: dirWindContentArray[k],
                speed: parseInt(speedWindContentArray[k]) ,
            },
            probaRain: rainContentArray[k]
        }
    })

    await browser.close();
    const reponse = await fetch('http://localhost:3000/saveData',{
        method: 'POST',
        body: JSON.stringify({data: retour}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(await reponse.text())
})()


async function  getContent(selector,page){
    const pageRes = await page.$$(selector);
    return await Promise.all(
        pageRes.map(async (element) => {
            return await page.evaluate(
                (el) => el.textContent,
                element
            );
        })
    );
}