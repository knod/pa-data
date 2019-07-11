// setupSearch.js

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


// Puts values into inputs
async function setupSearch (vars, page, name) {

  console.log(name);

  // Run data
  const datesData = vars.runData.dates;
  const dates = {
    start: datesData.startDate,
    end: datesData.endDate,
  };

  // Selectors
  const lastNameSelector = vars.lastNameSelector;
  const firstNameSelector = vars.firstNameSelector;
  const docketTypeSelector = vars.docketTypeSelector;
  const docketTypeVal = vars.docketTypeVal;
  const startDateSelector = vars.startDateSelector;
  const endDateSelector = vars.endDateSelector;
  const searchSelector = vars.searchSelector;

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

  await page.waitForSelector(
    searchSelector,
    // For large results
    {timeout: 15 * 60 * 1000}
  );

};  // Ends async setupSearch()


module.exports.setupSearch = setupSearch;
