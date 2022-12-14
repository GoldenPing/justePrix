const tata = new Promise((resolve, reject) => {
    console.log("start");
    setTimeout(() => resolve("timeout"), 1000)
    if (1 === 2) {
        reject("fin")
    }
})

tata.then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})

// try{
//     const resolve = await tata
// }catch (e){
//     console.log(e)
// }