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

// let type = process.argv[2];
// let commandLineArgs = JSON.parse(process.argv[3]);

// let nameIndexPath = type + '-name-index.json';
// let nameIndexVal = require('./' + nameIndexPath);
// let end = nameIndexVal + 100;
// console.log('nameIndex required:', nameIndexVal);
// let defaultArgs = {
//   start: nameIndexVal,
//   end: nameIndexVal + 100,
//   wait: 300,
//   volume: 10,
//   getFrom: 'names3.json',
//   type: type,
// }

// let args = Object.assign(defaultArgs, commandLineArgs);
// if (!args.user || args.user === 'yourNameHere') {
//   throw ReferenceError('You must at least write \'{"user":"yourFirstNameHere"}\' after the script name to add the "user" property.');
// }
// if (args.user === 'yourFirstNameHere') {
//   throw Error('Replace "yourFirstNameHere" with your actual first name. Sorry for not being clear.')
// }
// console.log(args);

module.exports.success = success;
module.exports.error = error;
module.exports.nameIndex = nameIndex;
module.exports.gaveUp = gaveUp;
