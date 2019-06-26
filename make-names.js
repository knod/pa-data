// make-names.js
let fs = require('fs');


let vowels = [
  'a', 'e', 'i', 'o', 'u',
];
let letters = [
  'b', 'c', 'd', 'f', 'g', 'h',
  'j', 'k', 'l', 'm', 'n', 'p',
  'q', 'r', 's', 't', 'v', 'w',
  'x', 'y', 'z',
];

//st, letter + r?

let objs = [];

// for (letter1 of letters) {
//   for (letter2 of letters) {
//     let newObj = 
//   }
// }

for (letter of letters) {
  for (vowel of vowels) {
    objs.push({
      firstName: letter + vowel,
      lastName: letter + vowel,
    });
    objs.push({
      firstName: vowel + letter,
      lastName: vowel + letter,
    });
    objs.push({
      firstName: letter + vowel,
      lastName: vowel + letter,
    });
    objs.push({
      firstName: vowel + letter,
      lastName: letter + vowel,
    });
  }
}

fs.writeFile("names.json", JSON.stringify(objs), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
