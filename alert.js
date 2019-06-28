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

module.exports.success = success;
module.exports.error = error;
