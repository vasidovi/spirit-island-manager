const data = require('./data');
const persistence = require('./persistence');
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



const uniqueCardTypes = {};

Object.keys(data.unique).forEach(key => {
  if (powerCards.some(card => card.type === data.unique[key])) {
    uniqueCardTypes[key] = data.unique[key];
  };
});

powerCards.forEach(card => card.imgSrc = getImgSrc(card));

const cardTypeKeys = _.merge(_.invert(data.powerDeckType), (_.invert(uniqueCardTypes)));

function returnDiscardedCards(cards) {
  cards
    .filter(c => c.discard)
    .forEach(card => {
      card.deck = true;
      card.discard = false
    });
}

function drawCards(deck, indices) {
  indices.forEach(i => {
    deck[i].deck = false;
  });
  return deck.filter((_, i) => indices.includes(i))
}

exports.discard = async function (cards) {

  const persistedCards = await persistence.getCards();
  cards.forEach(card => {

    const storageCard = persistedCards.find(c => c.id === card.id);
    if (storageCard) {
      storageCard.discard = true;
      delete storageCard.user;
    } else {
      console.log("Failed to discard card");
      console.log(card);
    }
  });

  await persistence.saveCards(persistedCards);
}

exports.draw = async function (typeKey, count) {
  const persistedCards = await persistence.getCards();
  const allCards = persistedCards.filter(c => c.typeKey === typeKey)
  let deck = allCards.filter(c => c.deck);

  // Need to draw all cards
  if (count === -1) {
    returnDiscardedCards(allCards)
    deck = allCards.filter(c => c.deck);
    count = deck.length
  } else if (deck.length < count) {
    // Need to make sure there are enough cards to draw

    returnDiscardedCards(allCards)
    deck = allCards.filter(c => c.deck);

    if (deck.length < count) {
      count = deck.length;
    }
  }

  var randomIndices = getRandomIndices(deck, count)

  const cards = drawCards(deck, randomIndices)

  await persistence.saveCards(persistedCards);
  return mapToPowerCards(cards);
};

function mapToPowerCards(cards) {

  return cards.map(e => {
    const cardCopy = _.cloneDeep(powerCards[e.id]);
    cardCopy.id = e.id
    // cardCopy.typeKey = e.typeKey
    return cardCopy;
  });

};


async function assignCardsToUser(cards, username) {
  // cards = [];
  // all saved in persistance cards
  const persistedCards = await persistence.getCards();

  persistedCards.filter(persistedCard =>
      cards.some(card => persistedCard.id === card.id))
    .forEach(function (persistedCard) {
      persistedCard.user = username;
    });

  await persistence.saveCards(persistedCards);
}

exports.assignCardsToUser = assignCardsToUser;


async function getSpirits() {
  return _.mapValues(uniqueCardTypes, o => o.split(":")[1].trim())
}

exports.getSpirits = getSpirits;

async function getUserCards(username) {
  const persistedCards = await persistence.getCards();
  const persistedUserCards = persistedCards.filter(persistedCard => persistedCard.user === username);
  return mapToPowerCards(persistedUserCards);
}

exports.getUserCards = getUserCards;

function getImgSrc(card) {
  const name = card.name.toLowerCase().replace(/ /g, "_").replace(/['\-,]/g, "") + ".jpg";
  const src = "/images/powers/" + name;
  return src;
};

// cards info is not persisted in persitence
async function reset() {
  const cards = powerCards.map(c => {
    return {
      id: powerCards.indexOf(c),
      deck: true,
      discard: false,
      typeKey: cardTypeKeys[c.type]
    }
  });
  await persistence.reset({
    cards
  });
}

exports.reset = reset;

// setsItems in persistence
exports.initialize = async function () {
  persistence.initialize(reset);
}