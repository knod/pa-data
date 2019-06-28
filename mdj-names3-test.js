// mdj-names.js

const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require("request-promise-native");
const alert = require("./alert.js");

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
//       nameIndexPath = 'name-index.json';
// const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';

// let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel',
//     linksSelector = '.gridViewRow a.DynamicMenuItem',
//     docketIDSelector = '.gridViewRow' + ' td:nth-child(2)';

// let nextSelector = paginationSelector + ' a:nth-last-child(2)';
// let usedDocketsPath = 'named-dockets-used.txt';

// let pdfPath = 'data-cp';

// let requiredPrefix = /CP/;

// MDJ Stuff
const searchTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_ddlSearchType',
      lastNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtLastName',
      firstNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtFirstName',
      docketTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_ddlDocketType',
      startDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_beginDateChildControl_DateTextBox',
      endDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_endDateChildControl_DateTextBox',
      searchSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_btnSearch',
      resultsSelctor = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel',
      paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
      url = 'https://ujsportal.pacourts.us/DocketSheets/MDJ.aspx';

const searchTypeVal = "ParticipantName",
      docketTypeVal = "CR",
      nameIndexPath = 'mdj-name-index.json';
const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';


let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
    linksSelector = '.gridViewRow a.DynamicMenuItem',
    docketIDSelector = '.gridViewRow' + ' td:nth-child(2)';
let nextSelector = paginationSelector + ' a:nth-last-child(2)';
let usedDocketsPath = 'mdj-named-dockets-used.txt';

let pdfPath = 'data-mdj/';
let requiredPrefix = /MJ/;



// Standard
let names = JSON.parse(fs.readFileSync('names3.json', 'utf8'));
// let names = require('./names3.json');
const dates = {start: "01/01/2007", end: "06/25/2019"};
let throttle = 15 * 1000;
let timesRepeated = 0;
// Inclusive
// orignal run: index 41
// latest: node cp-names.js 41 45
let namesStartIndex = parseInt(process.argv[2]),
    namesEndIndex   = parseInt(process.argv[3]);

if (process.argv[4]) {
  throttle = parseInt(process.argv[4]);
  fs.writeFileSync(nameIndexPath, namesStartIndex);
}

console.log(namesStartIndex, namesEndIndex);

async function byNamesDuring (dates, browser) {

  let err = null;
  // fs.writeFileSync(nameIndexPath, namesStartIndex);

  // // Get last stored name index (number)
  // let nameIndex = JSON.parse(fs.readFileSync(nameIndexPath, 'utf8'));

  // // Get next name after that
  // nameIndex += 1;
  // let names = JSON.parse(fs.readFileSync('names3.json', 'utf8'));
  // let name = names[nameIndex];
  // console.log(name);

  // submit to site along with date
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 2000});

  await page.goto(url)

  // if page not found, stop
  let notFound = false;
  await page.waitForSelector(searchTypeSelector)
    .catch(async function(theError){
      err = theError;
      notFound = true;
      console.log('page not found');
      return 'not found';
    });
  if (notFound) {
    await browser.close();
    return ['not found', err];
  };

  // Select search by name
  page.select(
    searchTypeSelector,
    searchTypeVal
  );

  await page.waitForSelector(lastNameSelector);

  // Get last stored name index (number)
  let nameIndex = JSON.parse(fs.readFileSync(nameIndexPath, 'utf8'));
  // let names = JSON.parse(fs.readFileSync('names3.json', 'utf8'));

  while (nameIndex <= namesEndIndex) {
    console.log('~\n~\n~\n~\n~\nName index: ' + nameIndex + '\n~\n~\n~\n~\n~\n');
    if (doPlaySound !== 'no') { alert.nameIndex(); }

    await page.waitFor(throttle * 10);

    let name = names[nameIndex];
    console.log(name);

    let found = true;

    await page.waitForSelector(lastNameSelector)
      .catch(function(theError){
        err = theError;
        found = false;
        console.log('elment not found. 1')
      });
    if (found === false) {return ['not found', err];}

    try {
      await page.$eval(
        lastNameSelector,
        function (el, str) { el.value = str },
        name.lastName
      );
    } catch (theError) {
      err = theError;
      found = false;
      console.log('elment not found. 2')
    }
    if (found === false) {return ['not found', err];}

    await page.waitForSelector(firstNameSelector)
      .catch(function(theError){
        err = theError;
        found = false;
        console.log('elment not found. 3')
      });
    if (found === false) {return ['not found', err];}

    try {
      await page.$eval(
        firstNameSelector,
        function (el, str) { el.value = str },
        name.firstName
      ); /// *** notes stopped here at try/catch
    } catch (theError) {
      err = theError;
      found = false;
      console.log('elment not found. 3.5')
    }
    if (found === false) {return ['not found', err];}

    await page.waitForSelector(docketTypeSelector)
      .catch(function(theError){
        err = theError;
        found = false;
        console.log('elment not found. 4')
      });
    if (found === false) {return ['not found', err];}
    page.select(
      docketTypeSelector,
      docketTypeVal
    );

    await page.waitForSelector(startDateSelector)
      .catch(function(theError){
        err = theError;
        found = false;
        console.log('elment not found. 5')
      });
    if (found === false) {return ['not found', err];}
    await page.$eval(
      startDateSelector,
      function (el, str) { el.value = str },
      dates.start
    );

    await page.waitForSelector(endDateSelector)
      .catch(function(theError){
        err = theError;
        found = false;
        console.log('elment not found. 6')
      });
    if (found === false) {return ['not found', err];}

    try {
      await page.$eval(
        endDateSelector,
        function (el, str) { el.value = str },
        dates.end
      );
    } catch (theError) {
      err = theError;
      found = false;
      console.log('elment not found. 6.5')
    }
    if (found === false) {return ['not found', err];}

    console.log(1);
    await page.waitForSelector(searchSelector)
      .catch(function(theError){
        err = theError;
        found = false;
        console.log('elment not found. 7')
      });
    if (found === false) {return ['not found', err];}
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
  return [null, err];
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

  let noResults = false;
  await page.waitForSelector(
      resultsSelctor//,
      // {timeout: 180000}
  ).catch(function(err){
    // if no results, skip this page?
    noResults = true;
    console.log('no results');
    return 'no results';
    // console.log(err);
  });
  // If no results, return to continue loop
  if (noResults) {
    return {done: true, page: null};
  }

  // If there were results, we can start the repeat count again.
  timesRepeated = 0;
  
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
  await page.waitForSelector(linksSelector).catch(function(err){
    console.log('no link to pdf? maybe no results.')
  });
  const linksText = await page.evaluate(
    (linksSelector) => {
      let links = Array.from(
        document.querySelectorAll(linksSelector),
        element => element.href
      )
      return links;
    },
    linksSelector
  ).catch(function(err){
    console.log('no link to pdf? maybe no results.')}
    );
  // console.log(linksText.length, linksText);
  console.log(6);


  await page.waitForSelector(docketIDSelector).catch(function(err){
    console.log('no docket number? maybe no results.')
  });
  const docketIDTexts = await page.evaluate(
    (docketIDSelector) => {
      let ids = Array.from(
        document.querySelectorAll(docketIDSelector),
        element => element.innerText
      )
      return ids;
    },
    docketIDSelector
  ).catch(function(err){
    console.log('no docket number? maybe no results.')
  });
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
    if (requiredPrefix.test(id)) {
      let text = '\n' + Date.now() + '_' + id + '_page_' + newPageNum;
      let fixedText = text + '_stabilized';
      // fixed at cp-names3 20184

      // save docket id to dockets-used.txt?
      fs.appendFileSync(usedDocketsPath, fixedText, function (err) {
        if (err) console.log(err);
      });

      // await page.waitFor(3000);  // untried
      // Download pdfs
      await downloadPDF(linksText[index + adder], text + '-docket.pdf');
      // Because the linksText list is twice as long
      // await page.waitFor(3000);  // untried
      adder++
      await downloadPDF(linksText[index + adder], text + '-summary.pdf');
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
    // timeout: 10000,  // untried
    headers: {'User-Agent': 'cfb-data-analysis'}
  });
  let path = pdfPath + outputFilename;
  // console.log("To " + path);
  fs.writeFileSync(path, pdfBuffer, function (err) { if (err) {console.log(err)} });
}


// Test

let doPlaySound = process.argv[5];
async function startNewBrowser () {

  let browser = await puppeteer.launch({ headless: true });
  byNamesDuring(dates, browser)
    .then((result) => {
      let value = result[0],
          err = result[1];
      if (value === 'not found') {
        console.log('page/element not found. page probably not loading.');
        console.log(err);
        if (doPlaySound !== 'no') {
          alert.error();
          console.log('\n#\n#\n# >> Let this go till log says "giving up". Or stop it yourself and deal with it a different way.\n#\n#\n#');
        }
        // repeat with increased wait
        waitThenRepeat();
      } else {
        console.log('success');
        if (doPlaySound !== 'no') {
            alert.success();
        }
      }
      // gotIt = true;

      try {
        brower.close();
      } catch (err) {
        // probably already closed
      }

    }).catch((err) => {
      console.log('\n****\n****\n****\n****\n****\n****\n****\n****\n****\n****\n');
      console.log(err);
      // setTimeout(function () {
      // startNewBrowser();
      // }, 60000);
      if (doPlaySound !== 'no') { alert.error(); }
      console.log(err);
      // How do we close the old browser?
      browser.close();
      console.log('\n#\n#\n# >> Let this go till log says "giving up". Or stop it yourself and deal with it a different way.\n#\n#\n#');
      waitThenRepeat();
    });
};

const waitThenRepeat = async () => {
  timesRepeated++;
  timesRepeated % 11;  // 11 will turn into 0
  console.log('timesRepeated:', timesRepeated);
 
  if (timesRepeated <= 4) {
    setTimeout(startNewBrowser, 10000);
  } else if (timesRepeated <= 8) {
    // wait an hour before trying again
    console.log('an hour will pass.');
    setTimeout(startNewBrowser, 3600000);
    //, 60000);
  } else if (timesRepeated <= 9){
    // wait 15 min
    console.log('4 hours have passed');
    setTimeout(startNewBrowser, 900000);
    //, 30000);
  } else {
    console.log("giving up");
    alert.gaveUp();
    process.exit(1);
  }

};

startNewBrowser();