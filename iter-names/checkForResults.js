// checkForResults.js

const puppeteer = require('puppeteer');


// See which element is on the page when it finishes loading -
// a results element or a no results element
async function checkForResults (vars, page) {

  page.on('console', consoleObj => console.log(consoleObj.text()));

  const type = vars.runData.type;
  // Selectors
  const resultsSelector = vars.resultsSelector;
  const noResultsSelector = vars.noResultsSelector;
  const noResultsText = vars.noResultsText;

  let resultsStartTime = Date.now()
  console.log('start looking for result:', Date().toString());

  // wait for results to load
  let err = null;
  let resultsElem = page.waitForSelector(
    resultsSelector,
    { 'timeout': 2 * 60 * 1000}
  );
  let noResultsElem = null;

  // The two pages have two different html structures
  if (type === 'cp') {
    noResultsElem = page.waitForSelector(noResultsSelector,
      { 'timeout': 2 * 60 * 1000 });
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
    throw anError;
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
