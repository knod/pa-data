// nextPage.js

// // vars
// tableSelector;
// pageNumSelector;
// pageNumSelector;
// paginationSelector;
// runData;

const puppeteer = require('puppeteer');
const colors = require('colors');

// In-house
const waitForCurrentPageNumber = require('./waitForCurrentPageNumber.js').waitForCurrentPageNumber;
const getNowHHMM = require('./getNowHHMM.js').getNowHHMM;


async function skipSomePagesIfNeeded (vars, funcs, page, pageData) {
  // have to be paginated to get in here

  // PAGINATION
  // don't download pdfs till we know we're on the right page.
  // don't increment page till we've finished downloading pdfs.
  // only increment page if we're not done.

  const tableSelector = vars.tableSelector;
  const pageNumSelector = vars.pageNumSelector;

  // See the page we were last one when the program stopped
  let previousPageNumber = pageData.previous;
  console.log('Previous page: '.yellow, previousPageNumber);

  console.log('Waiting up to 15 min for search selector to load with large results'.bgWhite.blue + ' @', getNowHHMM());
  await page.waitForSelector(
    pageNumSelector,
    // For large results
    {timeout: 15 * 60 * 1000}
  );

  // let currentPageNumber = await waitForCurrentPageNumber(vars, page, previousPageNumber);

  // // Look to see if our goal page number is in the nav menu
  // // If all pages listed are lower, click the highest one
  // // and return to prevous function to do another loop
  // // with `done` being `false`
  // let skipData = await findSkipping(vars, page, previousPageNumber);
  // console.log('skipData:', skipData);

  // // If we need to keep looking for our goal page,
  // // click on a new page and cycle through this again
  // if (skipData.skip === false) {
  //   return {skip: false, previous: skipData.newPageNumber};
    return {skip: false, previous: 1};

  // } else if (skipData.skip === true) {
  //   console.log('clicking to a new page');
  //   previousPageNumber = skipData.newPageNumber;
  //   await page.click(skipData.selector);
  //   return {skip: true, previous: skipData.newPageNumber};

  // } else {
  //   console.log('What\'s going on with our `skipData`?');
  // }

};  // Ends async skipSomePagesIfNeeded()






// The right page is our goal page number
// Look to see if our goal page number is in the nav menu
// If all pages listed are lower, pick the highest one

// Examples:

// our goal page is 1.
// go to page. starts as 1.
// 1 is not underlined.
// we're at our goal page.

// our goal page is 4
// go to page. starts as 1.
// 4 is underlined.
// click on 4.

// our goal page is 7
// go to page. starts as 1.
// 7 is not there.
// click on 5.

// Returns something like `{skip: true, selector: selector, newPageNumber: parseInt(currentPageNumber)}`
async function findSkipping (vars, page, previousPageNumber) {

  page.on('console', consoleObj => console.log(consoleObj.text()));

  const pageNumSelector = vars.pageNumSelector;
  const paginationSelector = vars.paginationSelector;
  const runData = vars.runData;

  // It's our page goal for where to start downloading files.
  const goalPageNumber = runData.position.page;
  console.log('Goal page: '.blue, goalPageNumber);

  let skipData = await page.evaluate(
    function (paginationSelector, pageNumSelector, goalPageNumber){

      // Haven't implemented passing it in yet
      let currentPageElem = document.querySelector(pageNumSelector);
      let currentPageNumber = currentPageElem.innerText;

      // Get all the page navigation options. Something funky is going on.
      let navElem = document.querySelector(paginationSelector);
      let navText = navElem.innerText;
      console.log('nav:', navText);  // (log comforting info if it's possible in here)

      let goalStr = goalPageNumber.toString();
      console.log('current actual page indicated in nav:', currentPageNumber);

      let atGoal = currentPageNumber === goalStr;
      console.log('current is goal?', currentPageNumber, goalStr, atGoal);
      // If we're there, no need to click on anything
      if (atGoal) {
        console.log('Reached goal page');
        return {skip: false, newPageNumber: currentPageNumber};
      }

      // Will need a selector to click on the right link for the next page
      let selector = null;

      // Look to see if our goal page number is in there
      let navParts = navText.split(/\s/);
      let goalIndex = navParts.indexOf(goalStr);

      // If goal page is there, return it to be clicked
      if (goalIndex !== -1) {
        // CSS is not 0 indexed
        goalIndex += 1;
        console.log('CSS index of link to goal:', goalIndex)
        selector = paginationSelector + ' a:nth-child(' + goalIndex + ')';

      // Otherwise go to the very last page available
      } else {

        // Find the last nav item that is a number
        // Spacing between elements can't be trusted, so we have to do it the hard way
        let indexOfClick = null
        for (let navIndex = 2; navIndex < navParts.length; navIndex++) {
          let navItem = navParts[navIndex];
          if (!isNaN(parseInt(navItem))) {
            indexOfClick = navIndex;
          }
        }
        // CSS is not 0 indexed
        indexOfClick += 1;
        console.log('Index to click on:', indexOfClick);
        selector = paginationSelector + ' a:nth-child(' + goalIndex + ')';
      }

      return {skip: true, selector: selector, newPageNumber: parseInt(currentPageNumber)};
      // Implement this sometime
      // return {skip: true, selector: selector};
    },
    paginationSelector, pageNumSelector, goalPageNumber
  );

  return skipData;
};  // Ends async findSkipping()


module.exports.skipSomePagesIfNeeded = skipSomePagesIfNeeded;
