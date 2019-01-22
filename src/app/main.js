const express = require('express')
var bodyParser = require("body-parser");

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(express.static('src/website'))

const data = {
  majorCards: 52
}

app.get('/majorCards', (req, res) => res.send(data))

app.post('/majorCards', (req, res) => {
  const modification = req.body;
  for (const key in modification) {
    data[key] += modification[key];
  }
  res.send(data)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))