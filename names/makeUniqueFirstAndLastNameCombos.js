// makeUniqueFirstAndLastNames.js

const fs = require('fs');

// In-house
const last1990 = require('./census1990LastNames.js');
const last2000 = require('./census2000LastNames.js');
const first1990 = require('./census1990FirstNames.js');


let putUniqueInCombos = function (arrAccumulator, objAccumulator, nameArr) {

  for (let name of nameArr) {
    let firstTwo = name.substring(0, 2);

    if (!objAccumulator[firstTwo]) {
      objAccumulator[firstTwo] = true;
      arrAccumulator.push(firstTwo);
    }
  }

  return {
    arr: arrAccumulator,
    obj: objAccumulator,
  }
};  // Ends putUniqueInCombos()


// Last names
let last1990Combos = putUniqueInCombos([], {}, last1990);
let last1990Arr = last1990Combos.arr,
    last1990Obj = last1990Combos.obj;
let lastAll = putUniqueInCombos(last1990Arr, last1990Obj, last2000);
let lastAllArr = lastAll.arr;
fs.writeFileSync('names/uniqueCensusLastNames.json', JSON.stringify(lastAllArr), null, 2);

// First names
let first1990Combos = putUniqueInCombos([], {}, first1990);
let firstArr = first1990Combos.arr;
fs.writeFileSync('names/uniqueCensusFirstNames.json', JSON.stringify(firstArr), null, 2);

console.log(lastAllArr.length, firstArr.length); // 426^223
