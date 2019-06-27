// cp-names.js
const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require("request-promise-native");

// // CP Stuff
// const searchTypeSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_searchTypeListControl",
//       lastNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_lastNameControl",
//       firstNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_firstNameControl",
//       docketTypeSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_docketTypeListControl",
//       startDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_beginDateChildControl_DateTextBox",
//       endDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_endDateChildControl_DateTextBox",
//       searchSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchCommandControl",
//       resultsSelctor = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel",
//       paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_casePager';
// const dates = {start: "01/01/2007", end: "06/25/2019"};

// const url = 'https://ujsportal.pacourts.us/DocketSheets/CP.aspx'

// const searchTypeVal = "Aopc.Cp.Views.DocketSheets.IParticipantSearchView, CPCMSApplication, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
//       docketTypeVal = "Criminal"
//       nameIndexPath = 'cp-name-index.json';
// const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';

// let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel',
//     linksSelector = '.gridViewRow a.DynamicMenuItem',
//     docketIDSelector = '.gridViewRow' + ' td:nth-child(2)';

// let nextSelector = paginationSelector + ' a:nth-last-child(2)';
// let usedDocketsPath = 'named-dockets-used.txt';

// let pdfPath = 'data-cp';

// MDJ Stuff
const searchTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_ddlSearchType',// "ParticipantName"
      lastNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtLastName',
      firstNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtFirstName',
      docketTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_ddlDocketType', // "CR"
      startDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_beginDateChildControl_DateTextBox',
      endDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_endDateChildControl_DateTextBox',
      searchSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_btnSearch',
      resultsSelctor = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel',
      paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel',// > table .PageNavigationContainer a',
      url = 'https://ujsportal.pacourts.us/DocketSheets/MDJ.aspx';

const searchTypeVal = "ParticipantName",
      docketTypeVal = "CR"
      nameIndexPath = 'mdj-name-index.json';
const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';


let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
    linksSelector = '.gridViewRow a.DynamicMenuItem',
    docketIDSelector = '.gridViewRow' + ' td:nth-child(2)';
let nextSelector = paginationSelector + ' a:nth-last-child(2)';
let usedDocketsPath = 'mdj-named-dockets-used.txt';

let pdfPath = 'data-mdj';








// Standard
const dates = {start: "01/01/2007", end: "06/25/2019"};
const throttle = 10 * 1000;
// Inclusive
// orignal run: index?
// last run: ? ?
let namesStartIndex = process.argv[2],
    namesEndIndex   = process.argv[3];

async function byNamesDuring (dates) {

  fs.writeFileSync(nameIndexPath, namesStartIndex);

  // // Get last stored name index (number)
  // let nameIndex = JSON.parse(fs.readFileSync(nameIndexPath, 'utf8'));

  // // Get next name after that
  // nameIndex += 1;
  // let names = JSON.parse(fs.readFileSync('names.json', 'utf8'));
  // let name = names[nameIndex];
  // console.log(name);

  // submit to site along with date
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 2000});

  await page.goto(url)

  // if page not found, stop
  let notFound = false;
  await page.waitForSelector(searchTypeSelector)
    .catch(function(err){
      notFound = true;
      console.log('page not found');
      await browser.close();
      return false
    });
  if (notFound) {
    await browser.close();
    return false
  };

  // Select search by name
  page.select(
    searchTypeSelector,
    searchTypeVal
  );

  await page.waitForSelector(lastNameSelector);


  // Get last stored name index (number)
  let nameIndex = JSON.parse(fs.readFileSync(nameIndexPath, 'utf8'));
  let names = JSON.parse(fs.readFileSync('names.json', 'utf8'));

  while (nameIndex <= namesEndIndex) {
    console.log('~\n~\n~\n~\n~\n~\n~\n~\n~\n~\n');
    let name = names[nameIndex];
    console.log(name);

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

    page.select(
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

    console.log(1);
    page.click(searchSelector)

    let pageData = {done: false, page: 0};
    while (!pageData.done) {
      console.log(1.5);
      pageData = await getPDFs(browser, page, pageData.page);
      console.log(17);
      console.log('pageData', pageData);
    }  // ends while this name not done

    console.log(18)

    // Update to new index
    nameIndex += 1;
    fs.writeFileSync(nameIndexPath, nameIndex);
  }  // ends while name index

  console.log(19);
  await browser.close();
  return null;
};  // Ends byNamesDuring



async function getPDFs (browser, page, lastPageNum) {

  await page.waitFor(throttle);

  // wait for results to load
  console.log(2, 'last pg', lastPageNum);
  let newPageNum = lastPageNum + 1;
  console.log('new pg', newPageNum)

  // await page.waitForSelector(
  //     '#loading[style*="display: none;"]',
  //     {timeout: 180000}
  // );

  await page.waitForSelector(
      resultsSelctor//,
      // {timeout: 180000}
  ).catch(function(err){
    // console.log(err);
  });
  
  console.log(3);

  await page.waitForSelector(
      tableSelector,
      {timeout: 5000}
  ).catch(function(err){
    // console.log(err);
  });

  console.log(4);
  // See if we're on the last page of multiple pages
  // Also wait a bit to let the table items load
  // I know of no other way that would be useful
  let paginated = false;
  let nextSelector = paginationSelector + ' a:nth-last-child(2)';
  await page.waitForSelector(
      nextSelector,
      {timeout: 5000}
  ).then(function(arg){
    // console.log('pagination next:', arg.innerText);
    if (arg) {
      paginated = true;
    }
  }).catch(function(err){
    // console.log(err);
  });

  // Make sure we're done going to the next page
  if (paginated) {
    await page.waitFor(
      async function (newPageNum, pageNumSelector) {
        let elem = document.querySelector(pageNumSelector);
        let currPage = parseInt(elem.innerText);
        let isNew = currPage === newPageNum;
        return isNew;
      },
      {},
      newPageNum, pageNumSelector
    ).catch(function(err){
      // console.log(err);
    });
  }

  console.log(4.5)
  // Because we're somehow missing this sometimes...?
  const navText = await page.evaluate(
    (paginationSelector) => {
      return document.querySelector(paginationSelector).innerText;
    },
    paginationSelector
  ).then(function (navText) {
    if (navText) {
      console.log('nav:', paginated, navText);
      paginated = true;
    }
  }).catch(function (err){
    // console.log(err);
  });
  console.log('nav:', paginated, navText);

  console.log(5);
  // go down rows getting links and ids
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
  // console.log(linksText.length, linksText);
  console.log(6);


  const docketIDTexts = await page.evaluate(
    (docketIDSelector) => {
      let ids = Array.from(
        document.querySelectorAll(docketIDSelector),
        element => element.innerText
      )
      return ids;
    },
    docketIDSelector
  );
  // console.log(docketIDTexts);

  console.log(7);

  // (Because the linksText list is twice as long)
  let adder = 0;

  console.log(8);
  // download both pdfs
  for (let index = 0; index < docketIDTexts.length; index++) {

    // See if docket was already gotten?

    let id = docketIDTexts[index]
    // We just want CP data, or so they tell us
    if (/CP/.test(id)) {
      let text = '\n' + Date.now() + '_' + id + '_page_' + newPageNum;

      // save docket id to dockets-used.txt?
      fs.appendFileSync(usedDocketsPath, text, function (err) {
        if (err) console.log(err);
      });

      // Download pdfs
      downloadPDF(linksText[index + adder], id + '-docket.pdf');
      // Because the linksText list is twice as long
      adder++
      downloadPDF(linksText[index + adder], id + '-summary.pdf');
    }
  }


  console.log(9, paginated);
  // hit 'next' if we need to

  let done = true;
  if (paginated) {
    // have to check
    done = false;

    console.log(10);
    const disabledText = await page.evaluate(
      (paginationSelector) => {
        let selector = paginationSelector + ' a[disabled]';

        console.log(11);
        let allDisabled = Array.from(
          document.querySelectorAll(selector),
          element => element.innerText
        )
        return allDisabled;
      },
      paginationSelector
    );


    console.log(12);
    // let thisPageNum = await page.evaluate(
    //   (pageNumSelector) => {
    //     return parseInt(document.querySelector(pageNumSelector).innerText);
    //   },
    //   pageNumSelector
    // );

    if (disabledText.indexOf('Next') === -1) {


      // console.log('new page', newPageNum)

      console.log(13);
      // console.log(paginated, disabledText);

      // const nextLink = await page.evaluate(
      //   (paginationSelector) => {
      //     let selector = paginationSelector + ' a:nth-last-child(2)';
      //     return document.querySelector(selector).innerText;
      //   },
      //   paginationSelector
      // );

      let nextButton = paginationSelector + ' a:nth-last-child(2)';
      page.click(nextButton)


      console.log(14);
      // await getPDFs(browser, page, newPageNum);
      // If done
      // return {done: false, page: newPageNum};
    } else {
      // return {done: true, page: newPageNum};
      done = true;
    } // ends if on the last page

    // should never get here
    console.log(15);

  }  // ends if paginated
  console.log(16, done);
  console.log('new pg at end', newPageNum);
  return {done: done, page: newPageNum};
};  // Ends next


// async function downloadPDF(pdfURL, docket, outputFilename) {
async function downloadPDF(pdfURL, outputFilename) {
  // console.log(pdfURL);
  let pdfBuffer = await request.get({
    uri: pdfURL, encoding: null,
    headers: {'User-Agent': 'cfb-data-analysis'}
  });
  let path = pdfPath + outputFilename;
  // console.log("To " + path);
  fs.writeFileSync(path, pdfBuffer, function (err) { if (err) {console.log(err)} });
}


// Test
byNamesDuring(dates)
  .then((value) => {
    // gotIt = true;
    console.log('success');
    // console.log(value); // Success!
  }).catch((err) => {
    console.log(err);
});
