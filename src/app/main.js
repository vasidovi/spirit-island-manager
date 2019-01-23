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

app.post('/cards/draw/:type/:count', async (req, res) => {
  const count = parseInt(req.params.count);
  const cards = await game.draw(req.params.type, count);
  res.send(JSON.stringify(cards))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

;
(async () => {
  //you must first call storage.init
  await game.initialize();
  // await storage.setItem('name', 'yourname')
  // console.log(await storage.getItem('name')); // yourname
})();