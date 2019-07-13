// makeShuffledCensusNames.js

const fs = require('fs');

// In-house
const censusSmall = require('./uniqueCensusNamesSmall.json');
let utils = require('./utils.js');

let shuffle = utils.shuffle;


const makeShuffledCensusNames = function () {
  let shuffled = shuffle(censusSmall);
  let json = JSON.stringify(shuffled);
  fs.writeFileSync('./names/censusNamesSmallShuffled.json', json);
}

makeShuffledCensusNames();
