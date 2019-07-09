let fs = require('fs');

let getIndexOfName = function (obj) {
  let names = JSON.parse(fs.readFileSync('names3.json', 'utf8'));
  let index = null;
  for (let namei = 0; namei < names.length; namei++) {
    let name = names[namei];
    if (name.firstName === obj.firstName && name.lastName === obj.lastName) {
      index = namei;
    }
  }
  return index;
}


console.log(getIndexOfName({ firstName: 'ba', lastName: 'mi' }))

// Have any time today/this evening/overnight to lend some processing power to scraping? And know anyone else that might be into it and can keep data private?
// It involves cloning a repo and let me assign you some numbers to type into your terminal. I can walk you through it if that helps.
// Also, if you know anyone else you'd feel comfortable pinging, I'd be into it.
