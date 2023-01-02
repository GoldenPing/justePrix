const gens = ['marron','leStylo',"mejanchon"];
const votes = new Array(101).fill('').map(e => gens[Math.floor(Math.random()*gens.length)])

const votecheat = votes.map(e=> gens[gens.findIndex(e => e === "mejanchon")])
console.log(votecheat)

const winner = findWinner(gens,votes)
console.log('Gagnant' , winner)

const voteLeStylo = nbVote(gens,votes,'leStylo')
console.log('Vote leStylo', voteLeStylo)

const voteLeStyloMarron = votes.filter(e => e === 'leStylo' || e === 'marron')
console.log(voteLeStyloMarron)

function findWinner(gens,vote){
    const groupedVotes = groupVote(gens,vote);
    const winner = groupedVotes.reduce((winnerIndex, group, index) => {
        const nbVote = group.length;
        const nbVoteWinner = groupedVotes[winnerIndex].length;
       if (nbVote > nbVoteWinner ) {
           return index
       }
       return winnerIndex
    },0)
     return  gens[winner];
}

function nbVote(gens,vote,candidat) {
    const leStyloIndex = gens.findIndex(e => e === candidat)
    return groupVote(gens,vote)[leStyloIndex].length
}

function getVotes(gens,vote,candidat) {
    const leStyloIndex = gens.findIndex(e => e === candidat)
    return groupVote(gens,vote)[leStyloIndex]
}

function groupVote (gens,vote){
   return gens.map(gens => vote.filter(e => e === gens))
}