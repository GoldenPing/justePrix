let a = [];
let sum = 0;
for (let i = 0; i < 50; i++) {
    a.push(Math.floor(Math.random()*100))
    sum += Math.floor(Math.random()*100)
}
console.log(sum);