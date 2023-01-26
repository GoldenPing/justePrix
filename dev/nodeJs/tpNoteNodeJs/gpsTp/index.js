import readline from 'readline';
import distance from 'gps-distance';

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

console.log('X1')
const x1 = await readLineAsync()

console.log('Y1')
const y1 = await readLineAsync()

console.log('X2')
const x2 = await readLineAsync()

console.log('Y2')
const y2 = await readLineAsync()

console.log(distance(parseFloat(x1), parseFloat(y1), parseFloat(x2), parseFloat(y2)))