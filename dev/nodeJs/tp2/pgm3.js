const fs = require('fs-extra')
const crypt = require('crypto')
//
const image = fs.readFileSync("1.jpg", "base64")
const binImage = Buffer.from(image, 'base64').toString('binary');
fs.writeFileSync("image.jpg", binImage, "binary")

const parentDir = './res/'
const arr = [];
for (let i = 0; i <= 500; i++) {
    arr.push(i);
}
main(arr)

async function f(dir, str) {
    // const promise1 = await fs.outputFile(dir + "/todo.txt", str)
    // const promise2 = await fs.copy("./1.jpg", dir + "/img.png");
    return Promise.all([fs.outputFile(dir + "/todo.txt", str), fs.copy("./image.jpg", dir + "/img.png")])
}

async function main(arr) {
    console.time('pgm')
    await Promise.all(arr.map(async i => {
        const str = crypt.createHash('sha256').update(i.toString()).digest('hex');
        await fs.mkdirs(parentDir + str)
        return f(parentDir + str, str)
    }))
    console.timeEnd('pgm')
}