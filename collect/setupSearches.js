// setupSearches.js

// // vars
// runData.dates;
// lastNameSelector;
// firstNameSelector;
// docketTypeSelector;
// docketTypeVal;
// startDateSelector;
// endDateSelector;
// searchSelector;

const puppeteer = require('puppeteer');


async function setupSiteSearchValues (vars, page) {

  // Run data
  const runData = vars.runData;
  const dates = {
    start: runData.startDate,
    end: runData.endDate,
  };

  console.log('dates:', dates);

  // Selectors
  const searchTypeSelector = vars.searchTypeSelector;
  const searchTypeVal = vars.searchTypeVal;
  const docketTypeSelector = vars.docketTypeSelector;
  const docketTypeVal = vars.docketTypeVal;
  const startDateSelector = vars.startDateSelector;
  const endDateSelector = vars.endDateSelector;

  // Fill in fields

  // Select search by participant name. 
  await page.select(
    searchTypeSelector,
    searchTypeVal
  );

  // Wait for participant name fields to load
  await page.waitForSelector(endDateSelector);

  await page.select(
    docketTypeSelector,
    docketTypeVal
  );

  await page.$eval(
    startDateSelector,
    function (el, str) { el.value = str },
    dates.start
  );

  await page.$eval(
    endDateSelector,
    function (el, str) { el.value = str },
    dates.end
  );

};  // Ends async setupSiteSearchValues()


// Puts values into inputs
async function setupNameSearch (vars, page, name) {

  console.log(name);

  // Selectors
  const lastNameSelector = vars.lastNameSelector;
  const firstNameSelector = vars.firstNameSelector;
  const searchSelector = vars.searchSelector;

  // Fill in fields

  await page.$eval(
    lastNameSelector,
    function (el, str) { el.value = str },
    name.lastName
  );

  await page.$eval(
    firstNameSelector,
    function (el, str) { el.value = str },
    name.firstName
  );

};  // Ends async setupNameSearch()


module.exports.setupSiteSearchValues = setupSiteSearchValues;
module.exports.setupNameSearch = setupNameSearch;
