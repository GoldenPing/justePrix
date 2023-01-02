const pair = new Array(50).fill('').map((e, i) => i*2 )
console.log(pair)
const impaire = pair.map(e => e+1)
console.log(impaire)

const moy = (pair.reduce((a,b) => a+b ,0))/pair.length
console.log(moy)