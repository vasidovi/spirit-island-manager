const storage = require('node-persist');

exports.getCards = async function () {
  return await storage.getItem('cards');
}
exports.saveCards = async function (cards) {
  return await storage.setItem('cards', cards);
}

async function reset(objects) {
  for (key of Object.keys(objects)) {
    await storage.removeItem(key);
    await storage.setItem(key, objects[key])
  };
}

exports.reset = reset;

exports.initialize = async function (callback) {
  await storage.init( /* options ... */ );

  if (!await storage.getItem("initialized")) {
    await callback();

    await storage.setItem("initialized", true);
    console.log("Storage has been successfully initialized.")
  } else {
    console.log("Storage already initialized.")
  }
}