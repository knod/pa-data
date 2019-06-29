// alert.js
const player = require('play-sound')();

let success = function () {
  player.play('cluck.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

let error = function () {
  player.play('police.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

let nameIndex = function () {
  player.play('light.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

let gaveUp = function () {
  player.play('gave-up/gave-up.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
  });
};

module.exports.success = success;
module.exports.error = error;
module.exports.nameIndex = nameIndex;
module.exports.gaveUp = gaveUp;
