const fs = require('fs-extra')
const crypt = require('crypto')
console.time('pgm')
const parentDir = './res/'
fs.mkdirsSync("./res/")
for (let i = 0; i <= 500; i++) {
    const str = crypt.createHash('sha256').update(i.toString()).digest('hex');

    fs.mkdirs(parentDir + str, (onerror) => {
        f(parentDir + str, str)
    })
}
console.timeEnd('pgm')

async function f(dir, str) {
    const promise1 = await fs.outputFile(dir + "/todo.txt", str)
    const promise2 = await fs.copy("./1.jpg", dir + "/img.png");

    Promise.all([promise1, promise2])
}