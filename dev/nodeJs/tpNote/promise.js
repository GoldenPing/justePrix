const promiseA = (letter) => new Promise((res, rej) => {
    if(letter === "C"){
        rej("C letter")
    }
    setTimeout(() => res(letter), 1000)
})
const promiseB = (num) => new Promise((resolve, reject) => {
    if(num === 2){
        reject(2)
    }
    else {
        resolve(num)
    }
})

promiseA("A")
    .then(res => {
        console.log('res', res)
        Promise.all([ promiseB(10), promiseA("C")])
            .then( ([res1, res2]) => console.log('results', res1, res2) )
            .catch(e => console.log('error on promise all', e))
    })
    .catch(e => {
        console.log('error A', e)
        promiseB(2)
            .then(result => console.log('result', result))
            .catch(error=> console.log('catch result', error))
    })

async function main(){
    try{
        console.log('res', await promiseA("A"))
        try {
            const allPromise = await Promise.all([ promiseB(10), promiseA("C")])
            console.log('result',allPromise[1],allPromise[1])
        }catch (e){
            console.log('error on promise all', e)
        }
    }catch (e){
        console.log('error A', e)
        try  {
            console.log('result',await promiseB(2))
        }catch (e){
            console.log('catch result', e)
        }
    }
}

main();