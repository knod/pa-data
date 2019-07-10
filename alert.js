// alert.js
const player = require('play-sound')();

let success = function () {
  player.play('media/cluck.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

let error = function () {
  player.play('media/error.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

let nameIndex = function () {
  player.play('media/light.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

let gaveUp = function () {
  player.play('media/gave-up/gave-up.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

module.exports.success = success;
module.exports.error = error;
module.exports.nameIndex = nameIndex;
module.exports.gaveUp = gaveUp;
