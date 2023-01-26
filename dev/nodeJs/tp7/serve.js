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
let tabPlays = {}

const strMoves = {
    chi: {
        chi: 'draw',
        fu: 'win',
        mi: 'lose'
    },
    fu: {
        chi: 'lose',
        fu: 'draw',
        mi: 'win'
    },
    mi: {
        chi: 'win',
        fu: 'lose',
        mi: 'draw'
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('coup joueur', (msg) => {
        console.log(msg)
        tabPlays[socket.id] = msg
        let resultat = {}
        if (Object.keys(tabPlays).length === 4) {
            resultat = findWinner(tabPlays)
        }

        Object.keys(resultat).forEach((key) => {
            io.to(key).emit('resultat', resultat[key].score);
        })
    });
});


function findWinner(moves) {
    let firstMove;
    let firstPlayer;
    const resultat = {};

    const allMove = [...new Set(Object.values(moves))].length
    if (allMove === 3 ) {
        Object.keys(moves).forEach((key) => {
            resultat[key] = {score: 'draw',move: moves[key]}
        })
        tabPlays = {};
        console.log(resultat)
        return resultat
    }

    for (const player in moves) {
        if (!firstMove) {
            firstMove = moves[player]
            firstPlayer = player
            continue;
        }
        const playerMove = moves[player];
        if (Object.keys(moves).length === 2 || Object.keys(resultat).length === 0) {
            resultat[firstPlayer] = {score: strMoves[firstMove][playerMove], move: firstMove}
            resultat[player] = {score: strMoves[playerMove][firstMove], move: playerMove}
        } else {
                const resNewPlayer = []
                Object.keys(resultat).forEach((key) => {
                    resNewPlayer.push(strMoves[playerMove][resultat[key].move])
                })
                if (resNewPlayer.indexOf('win') !== -1) {
                    if (Object.values(resultat).map((e) => {
                        return e.score
                    }).indexOf('draw') !== -1) {
                        Object.keys(resultat).forEach((key) => {
                            resultat[key].score = 'lose'
                        })
                    }
                    resultat[player] = {score: 'win', move: playerMove}
                } else if (resNewPlayer.indexOf('lose') !== -1) {
                    resultat[player] = {score: 'lose', move: playerMove}
                } else {
                    resultat[player] = {score: 'draw', move: playerMove}
                }
            }
        }

    tabPlays = {};
    console.log(resultat)
    return resultat
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});