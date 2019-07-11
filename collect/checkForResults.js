// checkForResults.js

// // vars
// runData.type;
// resultsSelector;
// noResultsSelector;
// noResultsText;


const puppeteer = require('puppeteer');

// In-house
const getNowHHMM = require('./getNowHHMM.js').getNowHHMM;


// See which element is on the page when it finishes loading -
// a results element or a no results element
async function checkForResults (vars, page) {

  const type = vars.runData.type;
  // Selectors
  const resultsSelector = vars.resultsSelector;
  const noResultsSelector = vars.noResultsSelector;
  const noResultsText = vars.noResultsText;

  let resultsStartTime = Date.now()
  console.log('start looking for result:', Date().toString());

  // let err = null;

  // wait for large results to load
  console.log('Waiting up to 15 min for large results to load'.bgWhite.blue + ' @', getNowHHMM());
  let resultsElem = page.waitForSelector(
    resultsSelector,
    {timeout: 15 * 60 * 1000}
  );
  let noResultsElem = null;

  // The two pages have two different html structures
  if (type === 'cp') {
    noResultsElem = page.waitForSelector(
      noResultsSelector,
      { 'timeout': 2 * 60 * 1000 }  // This won't take as long we can hope
    );
  } else {
    noResultsElem = page.waitFor(
      function (noResultsSelector, noResultsText) {
        let elem = document.querySelector(noResultsSelector)
        if (!!elem) {
          let text = elem.innerText;
          let hasText = text === noResultsText;
          if (hasText) {
            return elem;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      {},
      noResultsSelector, noResultsText
    );
  }

  let foundSomeResults = false;
  let foundNoResults = false;
  try {
    await Promise.race([resultsElem, noResultsElem])
      .then(function(value) {
        console.log('race value:', value._remoteObject.description);
        foundSomeResults = value._remoteObject.description.indexOf(resultsSelector) >= 0;
        foundNoResults = !foundSomeResults;
        console.log('results found?', foundSomeResults);
        console.log('no results found?', foundNoResults);
      });
  } catch (anError) {
    console.log('no results or non-results elements found');
    throw Error(anError);
  }

  let endTime = Date.now();
  let elapsed = endTime - resultsStartTime;
  console.log('Time elapsed to find results:', elapsed, '(seconds:', elapsed/1000 + ')');
  
  console.log(3);

  if (foundNoResults) {
    return false;
  } else {
    return true;
  }

};  // Ends async checkForResults()


module.exports.checkForResults = checkForResults;
