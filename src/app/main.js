const express = require('express')
var bodyParser = require("body-parser");
const game = require('./game');

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use('/', express.static('src/website'))
app.use('/images', express.static('images'))
app.use(function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({
      error: 'No credentials sent!'
    });
  }
  next();
});

const getUsername = req =>
  Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();

const asyncMiddleware = fn =>
  (req, res, next) => {
    console.log(`${getUsername(req)}\t:\t${req.originalUrl}`)
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.get('/cards/:type', asyncMiddleware(async (req, res, next) => {
  const cards = await game.getCards(req.params.type)
  res.send(JSON.stringify(cards))
}))

app.post('/cards/draw/:typeKey/:count', asyncMiddleware(async (req, res, next) => {
  const count = parseInt(req.params.count);
  const cards = await game.draw(req.params.typeKey, count);
  res.send(JSON.stringify(cards))
}))

app.post('/cards/discard', asyncMiddleware(async (req, res, next) => {
  await game.discard(req.body);
  res.sendStatus(204)
}))

app.post('/reset', asyncMiddleware(async (req, res, next) => {
  await game.reset();
  res.sendStatus(204)
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

;
(async () => {
  await game.initialize();
})();