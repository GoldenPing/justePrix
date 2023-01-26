const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Quel age a tu ? ', age => {
    console.log(`Hey there ${age}!`);
    readline.close();
});