const tata = new Promise((resolve, reject) => {
    console.log("start");
    const yolo = setTimeout(() => resolve("timeout"), 3000)
    if (1 === 1) {
       // clearTimeout(yolo)
        reject("fin")
    }
})


// tata.then(result => {
//     console.log(result)
// }).catch(error => {
//
//     console.log(error)
// })

go()

async function go() {
    try {
        console.log(tata)
    } catch (e) {
        console.log(e)
    }
}

