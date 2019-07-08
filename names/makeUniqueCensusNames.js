// makeUniqueCensusNames.js

const fs = require('fs');

const firstNames = require('./uniqueCensusFirstNames.json');  // 426
const lastNames = require('./uniqueCensusLastNames.json');  // 223

// Is it exponential, factoral, or multiplication

let uniqueCombosArr = [];

let makeFirstNameSpecificCombos = function () {

  for (let firstName of firstNames) {
    for (let lastName of lastNames) {
      uniqueCombosArr.push({
        lastName: lastName.toLowerCase(),
        firstName: firstName.toLowerCase(),
      });
    }
  }

};  // Ends putUniqueInCombos()


let makeAllCombos = function () {

  for (let firstName of lastNames) {
    for (let lastName of lastNames) {
      uniqueCombosArr.push({
        lastName: lastName.toLowerCase(),
        firstName: firstName.toLowerCase(),
      });
    }
  }

};  // Ends putUniqueInCombos()


console.log(process.argv[2]);
if (process.argv[2] === '1') {
  makeFirstNameSpecificCombos();  // 94998
  fs.writeFileSync('names/uniqueCensusNamesSmall.json', JSON.stringify(uniqueCombosArr), null, 2);
}

if (process.argv[2] === '2') {
  makeAllCombos();  // 181476
  fs.writeFileSync('names/uniqueCensusNamesBig.json', JSON.stringify(uniqueCombosArr), null, 2);
}
