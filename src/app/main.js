const express = require('express')
var bodyParser = require("body-parser");
const game = require('./game');

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use('/', express.static('src/website'))
app.use('/images', express.static('images'))


app.get('/cards/:type', async (req, res) => {
  const cards = await game.getCards(req.params.type)
  res.send(JSON.stringify(cards))
})

app.post('/cards/draw/:typeKey/:count', async (req, res) => {
  const count = parseInt(req.params.count);
  const cards = await game.draw(req.params.typeKey, count);
  res.send(JSON.stringify(cards))
})

app.post('/cards/discard', async (req, res) => {
  await game.discard(req.body);
  res.sendStatus(204)
})

app.post('/reset', async (req, res) => {
  await game.reset();
  res.sendStatus(204)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

;
(async () => {
  await game.initialize();
})();