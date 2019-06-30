// randomize_some_names.js

let fs = require('fs');
let utils = require('./utils.js');
let alternatingNames = require('./names3.json');

// names with only vowel and consonant combinations and
// where the first and last names don't both have the same
// two letters as each other (not even when the letters are
// in a different order - for example 'ob' and 'bo')
let alternating_nonmatching_names = require('./names3.json');

let removeRanges = utils.removeRanges;
let shuffle = utils.shuffle;

let pathPrefix = 'names/';
let cp_alternating_nonmatching_names2007to2019_path = pathPrefix + 'cp_alternating_nonmatching_names2007to2019_remaining_shuffled.json';
let cp_alternating_nonmatching_names06_18to12_18_path = pathPrefix + 'cp_alternating_nonmatching_names06_18to12_18_remaining_shuffled.json';
let cp_alternating_nonmatching_names01_17to12_18_path = pathPrefix + 'cp_alternating_nonmatching_names01_17to12_18_remaining_shuffled.json';

let cp_alternating_nonmatching_names2007to2019_removing = [
  // inclusive
  {start: 0, end: 2094},
  {start: 20001, end: 20319},
  {start: 30001, end: 30408},
];
let cp_alternating_nonmatching_names06_18to12_18_removing = [{start: 92, end: 129}];
let cp_alternating_nonmatching_names01_17to12_18_removing = [{start: 134, end: 174}];

let cp_alternating_nonmatching_names2007to2019_new = removeRanges(alternating_nonmatching_names, cp_alternating_nonmatching_names2007to2019_removing);
let cp_alternating_nonmatching_names06_18to12_18_new = removeRanges(alternating_nonmatching_names, cp_alternating_nonmatching_names06_18to12_18_removing);
let cp_alternating_nonmatching_names01_17to12_18_new = removeRanges(alternating_nonmatching_names, cp_alternating_nonmatching_names01_17to12_18_removing);

let cp_alternating_nonmatching_names2007to2019_shuffled = shuffle(cp_alternating_nonmatching_names2007to2019_new);
let cp_alternating_nonmatching_names06_18to12_18_shuffled = shuffle(cp_alternating_nonmatching_names06_18to12_18_new);
let cp_alternating_nonmatching_names01_17to12_18_shuffled = shuffle(cp_alternating_nonmatching_names01_17to12_18_new);

let cp_alternating_nonmatching_names2007to2019_json = JSON.stringify(cp_alternating_nonmatching_names2007to2019_shuffled)
let cp_alternating_nonmatching_names06_18to12_18_json = JSON.stringify(cp_alternating_nonmatching_names06_18to12_18_shuffled)
let cp_alternating_nonmatching_names01_17to12_18_json = JSON.stringify(cp_alternating_nonmatching_names01_17to12_18_shuffled)

fs.writeFileSync(cp_alternating_nonmatching_names2007to2019_path, cp_alternating_nonmatching_names2007to2019_json);
fs.writeFileSync(cp_alternating_nonmatching_names06_18to12_18_path, cp_alternating_nonmatching_names06_18to12_18_json);
fs.writeFileSync(cp_alternating_nonmatching_names01_17to12_18_path, cp_alternating_nonmatching_names01_17to12_18_json);

// let mdj_alternating_names2007to2019_path = pathPrefix + 'mdj_alternating_names2007to2019.json';
// let mdj_alternating_names06_18to12_18_path = pathPrefix + 'mdj_alternating_names06_18to12_18.json';


