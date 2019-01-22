const express = require('express')
var bodyParser = require("body-parser");
const actions = require('./actions');

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(express.static('src/website'))

const data = actions.data

app.get('/cards/:type', async (req, res) => {
  const cards = await actions.getCards(req.params.type)
  res.send(JSON.stringify(cards))
})

app.get('/cards/draw/:type/:count', async (req, res) => {
  const count = parseInt(req.params.count);
  const cards = await actions.draw(req.params.type, count);
  res.send(JSON.stringify(cards))
})

app.post('/majorCards', (req, res) => {
  const modification = req.body;
  for (const key in modification) {
    data[key] += modification[key];
  }
  res.send(data)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


;
(async () => {
  //you must first call storage.init
  await actions.initialize();
  // await storage.setItem('name', 'yourname')
  // console.log(await storage.getItem('name')); // yourname
})();