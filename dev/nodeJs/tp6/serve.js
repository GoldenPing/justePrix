import express from 'express'

const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json


app.post('/saveData', (req, res) => {
    console.log(req.body.data)
    res.send('ok')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})