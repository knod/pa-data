// removeCurrentNames.js

const fs = require('fs');

// Full census names lists
const smallNamesList = require('./uniqueCensusNamesSmall.json');
const bigNamesList = require('./uniqueCensusNamesBig.json');

// Already generated, though not all used
const alternating_nonmatching_names = require('../names3.json');
// Not using names.js and names1.js for removing? Did use them waaaay back before synced pdfs.



const withoutPreExisting = function (preexistingStrs, fullListStrs) {
  let count = 0;
  let noPreExistingNames = [];
  // // Want to figure out how many/which non-census names we have in names3.json
  // // is this the way to do it?
  // let nonCensusNames = [];

  for (let fullListName of fullListStrs) {

    if (preexistingStrs.indexOf(fullListName) === -1) {
      noPreExistingNames.push(fullListName);
    }

  }  // ends for full names

  // return {nonDupes: noPreExistingNames, nonCensus: nonCensusNames};
  return {nonDupes: noPreExistingNames};
};  // Ends withoutPreExisting()




let prevNamesStrs = [];
for (let preexistingName of alternating_nonmatching_names) {
  let str = preexistingName.firstName + preexistingName.lastName;
  prevNamesStrs.push(str);
}  // ends for prexisting list
// console.log(prevNamesStrs.length);
// 43680


function onlyUnique(value, index, arr) { 
    return arr.indexOf(value) === index;
}


function nonDupesSmall () {

  let smallNamesStrs = [];
  for (let smallName of smallNamesList) {
    let str = smallName.firstName + smallName.lastName;
    smallNamesStrs.push(str);
  }  // ends for small list

  // console.log(smallNamesStrs.length);
  // let uniqueSmall = smallNamesStrs.filter( onlyUnique );
  // console.log(uniqueSmall.length);

  let data = withoutPreExisting(prevNamesStrs, smallNamesStrs);
  // 61582 of 94998 = -33416 (-43680 = 10264)
  console.log('Num census-non-dupes:', data.nonDupes.length);
}

function nonDupesBig () {

  let bigNamesStrs = [];
  for (let bigName of bigNamesList) {
    let str = bigName.firstName + bigName.lastName;
    bigNamesStrs.push(str);
  }  // ends for small list

  // console.log(bigNamesStrs.length);
  // console.log(bigNamesList.length);
  // let uniqueBig = bigNamesStrs.filter( onlyUnique );
  // console.log(uniqueBig.length);

  let data = withoutPreExisting(prevNamesStrs, bigNamesStrs);
  // 139038 of 181476 = -42438 (-43680 = 1242)
  console.log('Num census-non-dupes:', data.nonDupes.length);
}


let argv = process.argv[2];

if (argv === 'small') {
  console.log('doing small');
  nonDupesSmall();
} else if (argv === 'big') {
  console.log('doing big');
  nonDupesBig();
}

