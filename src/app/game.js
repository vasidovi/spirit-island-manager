const storage = require('node-persist');
const data = require('./data');
const _ = require('lodash')

// powerCards.forEach( function(index, value){...});
const powerCards = data.powerCards.filter(card => card.set === data.productSet.Basegame);

powerCards.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
})

const majorCards = powerCards.filter(card => card.type === data.powerDeckType.Major);
const minorCards = powerCards.filter(card => card.type === data.powerDeckType.Minor);
const uniqueCards = powerCards.filter(card => Object.values(data.unique).includes(card.type));

const cardData = {
  major: majorCards,
  minor: minorCards,
  unique: uniqueCards
}
exports.cards = cardData

exports.getCards = async function (type) {
  return await storage.getItem(type);
}

function reshuffleDeck(cards) {
  cards
  // not needed yet
  // .filter(c => c.discard)
  .forEach(card => {
    card.deck = true;
    card.discard = false
  })
}

function drawCards(deck, indices) {
  indices.forEach(i => {
    deck[i].deck = false;
  });
  return deck.filter((_, i) => indices.includes(i))
}

function getRandomIndices(deck, count) {
  var indices = []
  while (indices.length < count) {
    const i = getRandomInt(0, deck.length - 1);
    if (indices.indexOf(i) === -1) indices.push(i);
  }
  return indices;
}

exports.draw = async function (type, count) {
  const allCards = await storage.getItem(type);
  let deck = allCards.filter(c => c.deck);

  // Need to make sure there are enough cards to draw
  if (deck.length < count) {
    reshuffleDeck(allCards)
    deck = allCards.filter(c => c.deck);

    if (deck.length < count) {
      count = deck.length;
    }
  }

  var randomIndices = getRandomIndices(deck, count)

  const cards = drawCards(deck, randomIndices)

  await storage.setItem(type, allCards);
  return cards.map(e => {
    return {
      id: e.id,
      name: cardData[type][e.id].name
    }
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.initialize = async function () {
  await storage.init( /* options ... */ );

  if (!await storage.getItem("initialized")) {
    let i;
    i = 0;
    const majors = majorCards.map(e => {
      return {
        id: i++,
        deck: true,
        discard: false
      }
    });
    i = 0;

    const minors = minorCards.map(e => {
      return {
        id: i++,
        deck: true,
        discard: false
      }
    });
    await storage.setItem("major", majors);
    await storage.setItem("minor", minors);

    await storage.setItem("initialized", true);
    console.log("Storage has been successfully initialized.")
  } else {
    console.log("Storage already initialized.")
  }
}
