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

exports.data = {
  majorCards,
  minorCards,
  uniqueCards
}

exports.getCards = async function (type) {
  return await storage.getItem(type);
}

function reshuffleDeck(type){

}
exports.draw = async function (type, count) {
  const allCards = (await storage.getItem(type));
  let deckCards = allCards.filter(c => c.deck);
  
  if (deckCards.length < count) {
    reshuffleDeck(type)
   deckCards = allCards.filter(c => c.deck);

   if (deckCards.length < count) {
     count = deckCards.length;
   }
  }
  // generate :count indices of deck cards 
  var randomIndices = []
  while (randomIndices.length < count) {
    const i = getRandomInt(0, deckCards.length - 1);
    if (randomIndices.indexOf(i) === -1) randomIndices.push(i);
  }

  // take cards out of deck and into the response
  randomIndices.forEach(i => {
    console.log(allCards[deckCards[i].id])
    allCards[deckCards[i].id].deck = false;
  });

  await storage.setItem(type, allCards);

  return deckCards.filter((_, i) => randomIndices.includes(i)).map(e => e.id);
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