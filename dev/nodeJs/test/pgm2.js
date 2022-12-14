// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
// readline.question('Quel age a tu ? ', age => {
//     console.log(`Tu as ${age}!`);
//     readline.close();
// });

process.stdin.on("data", data => {
    const dateUser = data.toString().split('/')
    if (dateUser.length === 1) {
        process.stderr.write("error! entrer pas conforme\n")
        return;
    }
    const date = findAge(dateUser);
    process.stdout.write(date + "\n____________________________________\n")
})


function findAge(data) {

    const date = new Date();

    let year = date.getFullYear() - data[0];
    if (year < 0) {
        return "tu est né dans le futur Marty c'est toi ?";
    }
    if (data[1] > date.getMonth()) {
        return year;
    } else if (data[1] < date.getMonth()) {
        return year--;
    } else {
        console.log(date.getDate())
        if (data[2] >= date.getDate()) {
            return year
        } else if (data[1] < date.getMonth()) {
            return year--;
        }
    }
}