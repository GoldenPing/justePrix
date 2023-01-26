import readline from 'readline';
import distance from 'gps-distance';
import Amadeus from 'amadeus';
import dotenv from 'dotenv';
dotenv.config({path:"./.env"})
console.log('env', process.env.API_KEY)
console.log('env', process.env.API_SECRET)


const readLineAsync = () => {
    const rl = readline.createInterface({
        input: process.stdin
    });

    return new Promise((resolve) => {
        rl.prompt();
        rl.on('line', (line) => {
            rl.close();
            resolve(line);
        });
    });
};

async function asyncGetTokenApi() {
    let obj;
    const strLinks = "https://test.api.amadeus.com/v1/security/oauth2/token"
    const res = await fetch(strLinks,
        {
            "method": "POST",
            "headers": {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            "body": {
                grant_type : 'client_credentials',
                client_id : process.env.API_KEY,
                client_secret :  process.env.API_SECRET
            }

        }
    )
    obj = await res.json();
    return obj;
}


console.log(await asyncGetTokenApi())


//
// console.log('X1')
// const x1 = await readLineAsync()
//
// console.log('Y1')
// const y1 = await readLineAsync()
//
// console.log('X2')
// const x2 = await readLineAsync()
//
// console.log('Y2')
// const y2 = await readLineAsync()
//
// console.log(distance(parseFloat(x1), parseFloat(y1), parseFloat(x2), parseFloat(y2)))