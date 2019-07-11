// makeCensusNameLetterCombos.js

const fs = require('fs');

const last1990 = require('./censusData/census1990LastNames.js');
const last2000 = require('./censusData/census2000LastNames.js');
const first1990 = require('./censusData/census1990FirstNames.js');

// We're not actually going to split them into first
// and last names. We're going to extract all the
// unique first-two-letter combos

let allUniqueCombos = {};
let uniqueCombosArr = [];

let putUniqueInCombos = function (nameArr) {

  for (let name of nameArr) {
    let firstTwo = name.substring(0, 2);

    if (!allUniqueCombos[firstTwo]) {
      allUniqueCombos[firstTwo] = true;
      uniqueCombosArr.push(firstTwo);
    }
  }

};  // Ends putUniqueInCombos()


putUniqueInCombos(last1990);
putUniqueInCombos(last2000);
putUniqueInCombos(first1990);

fs.writeFileSync('names/uniqueCensusNameLetters', JSON.stringify(uniqueCombosArr), null, 2);

console.log(uniqueCombosArr.length);  // 426
