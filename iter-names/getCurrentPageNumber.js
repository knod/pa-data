// waitForDifferentPageNumber.js

// // vars
// pageNumSelector


const puppeteer = require('puppeteer');


async function waitForDifferentPageNumber (vars, page, previousPageNumber) {

  const pageNumSelector = vars.pageNumSelector;

  // First wait till the nav links load
  await page.waitForSelector(pageNumSelector);
  let waitedForCurrentPage = await page.waitFor(
    function (pageNumSelector, previousPageNumber){

      let currentPageElem = document.querySelector(pageNumSelector);
      let currentPageNumber = parseInt(currentPageElem.innerText);
      // If we're on the same page as before,
      // we need to wait some more
      if (previousPageNumber !== null && currentPageNumber === previousPageNumber){
        return false;
      } else {
        console.log('on new page:', currentPageNumber);
        return currentPageNumber;
      }
    },
    {},
    pageNumSelector, previousPageNumber
  );

  // Implement this sometime. Maybe outside of here passed in.
  let currentPageNumber = waitedForCurrentPage._remoteObject.value;
  console.log('waited for current page:', currentPageNumber);

  return currentPageNumber;
};  // Ends async waitForDifferentPageNumber()


module.exports.waitForDifferentPageNumber = waitForDifferentPageNumber;
