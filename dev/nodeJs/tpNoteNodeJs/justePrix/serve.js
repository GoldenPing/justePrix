import express from 'express';
import http from "http";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {Server} from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const player = []
let turnPlayer = 0;
let findNumber;
let win = false;

const restart = () => {
    setTimeout(() => {
        findNumber = Math.floor(Math.random() * 100)
        console.log(findNumber, "restart")
    }, 3000)
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    player.push(socket.id);
    if (player.length === 3) {
        findNumber = Math.floor(Math.random() * 100)
        console.log(findNumber)
        io.to(player[turnPlayer]).emit('joueur', 'C\'est à toi de deviner  ');
        let otherPlayer = player.slice();
        otherPlayer.splice(turnPlayer, 1)
        otherPlayer.map((e) => {
            io.to(e).emit('spectateur', 'Ce n\'est malheureusement pas ton tour  ');
        })
    }
    socket.on('find', async (msg) => {
        socket.broadcast.emit('play', 'le joueur a joué : ' + msg)
        await controlNumber(msg)
        if (win) {
            restart()
        }
    })
    socket.on('disconnect', () => {
        player.shift(player.find(e => e === socket.io), 1)
    });

    socket.on('pass',()=>{
        console.log('there')
        turnPlayer = (turnPlayer + 1 )% player.length ;

        io.to(player[turnPlayer]).emit('joueur', 'C\'est à toi de deviner  ');
        let otherPlayer = player.slice();
        otherPlayer.splice(turnPlayer, 1)
        otherPlayer.map((e) => {
            io.to(e).emit('spectateur', 'Ce n\'est malheureusement pas ton tour  ');
        })
    })
})


server.listen(3000, () => {
    console.log('listening on *:3000');
});

function controlNumber(msg) {
    const number = parseInt(msg)
    if (isNaN(number)) {
        return;
    }
    let str = 'le nombre : ' + msg + ' est '

    if (msg > findNumber) {
        str += 'plus grand';
    } else if (msg < findNumber) {
        str += 'plus petit'
    } else {
        str += 'le bon nombre'
        win = true;
    }
    console.log(msg, str)
    io.emit('indice', str)
}