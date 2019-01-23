const data = require('./data');
const persistance = require('./persistance');
const _ = require('lodash')


function getRandomIndices(deck, count) {
  var indices = []
  while (indices.length < count) {
    const i = getRandomInt(0, deck.length - 1);
    if (indices.indexOf(i) === -1) indices.push(i);
  }
  return indices;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


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
  return await persistance.getCards.filter(type);
}

function reshuffleDeck(cards) {
  cards
    .filter(c => c.discard)
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

exports.discard = async function (cards) {

  const persistedCards = await persistance.getCards();
  cards.forEach(card => {

    const storageCard = persistedCards.find(c => c.id === card.id);
    if (storageCard) {
      storageCard.discard = true;
    } else {
      console.log("Failed to discard card");
      console.log(card);
    }
  })

  await persistance.saveCards(persistedCards);
}

exports.draw = async function (typeKey, count) {
  const persistedCards = await persistance.getCards()
  const allCards = persistedCards.filter(c => c.typeKey === typeKey)
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

  await persistance.saveCards(persistedCards);
  return cards.map(e => {
    const cardCopy = _.cloneDeep(powerCards[e.id]);
    cardCopy.id = e.id
    cardCopy.typeKey = e.typeKey
    return cardCopy
  });
}

const getTypeKey = t => t.split(' ')[0].toLowerCase()

async function reset() {
  const cards = minorCards.concat(majorCards).map(c => {
    return {
      id: powerCards.indexOf(c),
      deck: true,
      discard: false,
      typeKey: getTypeKey(c.type)
    }
  });
  await persistance.reset({
    cards
  });
}

exports.reset = reset

exports.initialize = async function () {
  persistance.initialize(reset);
}