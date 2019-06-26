// cp-names.js
const fs = require('fs');
const puppeteer = require('puppeteer');

const typeSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_searchTypeListControl",
      lastNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_lastNameControl",
      firstNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_firstNameControl",
      startDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_beginDateChildControl_DateTextBox",
      endDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_endDateChildControl_DateTextBox",
      searchSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchCommandControl",
      resultsSelctor = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel",
      paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_casePager';
const dates = {start: "01/01/2007", end: "06/25/2019"};


async function byNamesDuring (dates) {

  // Get last stored name index (number)
  let index = JSON.parse(fs.readFileSync('name-index.json', 'utf8'));

  // Get next name after that
  index += 1;
  let names = JSON.parse(fs.readFileSync('names.json', 'utf8'));
  let name = names[0];
  // console.log(name);

  // submit to site along with date
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 2000});

  await page.goto('https://ujsportal.pacourts.us/DocketSheets/CP.aspx');

  await page.waitForSelector(typeSelector);

  // Select search by name
  page.select(
    typeSelector,
    "Aopc.Cp.Views.DocketSheets.IParticipantSearchView, CPCMSApplication, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null"
  );

  await page.waitForSelector(lastNameSelector);

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

  console.log(1);
  page.click(searchSelector)

  // wait for results to load
  console.log(2)
  await page.waitForSelector(
      resultsSelctor,
      {timeout: 180000}
  );



  await getPDFs(browser, page);



  await page.screenshot({path: 'name-test.png'});
  await browser.close();
  return null;
};  // Ends byNamesDuring


async function getPDFs (browser, page) {
  
  let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel',
      linksSelector = tableSelector + ' table tr td:first-child',
      docketIDSelector = tableSelector + ' table tr td:nth-child(2)';

  await page.waitForSelector(
      tableSelector,
      {timeout: 5000}
  );

  const linksText = await page.evaluate(
    (linksSelector) => {
      let links = Array.from(
        document.querySelectorAll(linksSelector),
        element => element.href
      )
      return links;
    },
    linksSelector
  );

  console.log(linksText);


  const docketIDText = await page.evaluate(
    (docketIDSelector) => {
      let links = Array.from(
        document.querySelectorAll(docketIDSelector),
        element => element.innerText
      )
      return links;
    },
    docketIDSelector
  );

  console.log(docketIDText);


  // go down rows. for each row:
  // See if docket was already hit?
  // download both pdfs
  // save docket id to dockets-used.txt?


  // // See if we're on the last page of multiple pages
  // let paginated = false;
  // await page.waitForSelector(
  //     paginationSelector,
  //     {timeout: 5000}
  // ).then(function(arg){
  //   if (arg) {
  //     paginated = true;
  //   }
  // }).catch(function(err){
  //   // console.log(err);
  // });

  // // hit 'next' if we need to
  // if (paginated) {

  //   const disabledText = await page.evaluate(
  //     (paginationSelector) => {
  //       let selector = paginationSelector + ' a[disabled]';
  //       let allDisabled = Array.from(
  //         document.querySelectorAll(selector),
  //         element => element.innerText
  //       )
  //       return allDisabled;
  //     },
  //     paginationSelector
  //   );

  //   if (disabledText.indexOf('Next') === -1) {
  //     console.log(paginated, disabledText);

  //     // const nextLink = await page.evaluate(
  //     //   (paginationSelector) => {
  //     //     let selector = paginationSelector + ' a:nth-last-child(2)';
  //     //     return document.querySelector(selector).innerText;
  //     //   },
  //     //   paginationSelector
  //     // );

  //     let nextButton = paginationSelector + ' a:nth-last-child(2)';
  //     page.click(nextButton)

  //     // await getPDFs();
  //   }

  //   return null;
  // }  // ends if paginated
};  // Ends next


// Test
byNamesDuring(dates)
  .then((value) => {
    gotIt = true;
    console.log('success');
      // console.log(value); // Success!
  }).catch((err) => {
    console.log(err);
});
