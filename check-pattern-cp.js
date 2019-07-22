// cp-names.js

// WARNING! RELIES HEAVILY ON GLOBAL VARIABLES!

const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require("request-promise-native");
const alert = require("./alert.js");
const colors = require('colors');
const mkdirp = require('mkdirp');

// CP Stuff
const searchTypeSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_searchTypeListControl",
      lastNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_lastNameControl",
      firstNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_firstNameControl",
      docketTypeSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_docketTypeListControl",
      startDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_beginDateChildControl_DateTextBox",
      endDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_endDateChildControl_DateTextBox",
      searchSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchCommandControl",
      resultsSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel",
      noResultsSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_noResultsPanel',
      pageNavContainerSelector = '',
      paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_casePager',
      filingDateSelectorStart = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel > table > tbody > tr.gridViewRow:nth-child(',
      filingDateSelectorEnd = ') td:nth-child(4)';

const url = 'https://ujsportal.pacourts.us/DocketSheets/CP.aspx';

const searchTypeVal = "Aopc.Cp.Views.DocketSheets.IParticipantSearchView, CPCMSApplication, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
      docketTypeVal = "Criminal";
const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';

let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel',
    linksSelector = '.gridViewRow a.DynamicMenuItem',
    docketIDSelector = '.gridViewRow td:nth-child(2)';

let nextSelector = paginationSelector + ' a:nth-last-child(2)';
let requiredPrefix = /CP/;

// // MDJ Stuff
// const searchTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_ddlSearchType',
//       lastNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtLastName',
//       firstNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtFirstName',
//       docketTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_ddlDocketType',
//       startDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_beginDateChildControl_DateTextBox',
//       endDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_endDateChildControl_DateTextBox',
//       searchSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_btnSearch',
//       resultsSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_lblPreviewInstructions',
//       pageNavContainerSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel > table > tbody > tr:nth-child(2) > td',
//       paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
//       filingDateSelectorStart = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_gvDocket > table > tbody > tr.gridViewRow:nth-child(',
//       filingDateSelectorEnd = ') td:nth-child(5)',
//       url = 'https://ujsportal.pacourts.us/DocketSheets/MDJ.aspx';

// let noResultsSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_gvDocket';
// let noResultsText = 'No Records Found'

// const searchTypeVal = "ParticipantName",
//       docketTypeVal = "CR";
// const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';


// let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
//     linksSelector = '.gridViewRow a.DynamicMenuItem',
//     docketIDSelector = '.gridViewRow' + ' td:nth-child(2)';
// let nextSelector = paginationSelector + ' a:nth-last-child(2)';

// let requiredPrefix = /MJ/;


// For finding all current dockets
let assignmentsPathStart = './assignments/pattern/';

// // For downloading PDFS
// assignmentsPathStart = './assignments/';





// Standard/shared
let versionNumber = '\nv0.67.0\n';

// command line command example
// node mdj-names3-test.js 1zz "{\"alerts\":\"no\"}"


// In new file? No, we need these vars...
// Get assignment ID from command line
const assignmentID = process.argv[2];
if (!assignmentID) {
  throw Error('Please include your assignment ID. For example: node mdj-names3-test.js 24z \'{"alerts":"no"}\' (that last bit means you won\'t hear the sounds)'.yellow);
} else if (assignmentID === '24z') {
  throw Error('I think you used the default assignemt ID (24z). That\'s not a real one.'.yellow);
}

const assignmentPath = assignmentsPathStart + assignmentID + '.json'
const assignmentData = require(assignmentPath);




// Assignment settings overrides
const commandLineArgvs = process.argv[3];

// An object for this run of the code - combining the two objects
let runData = null;
if (commandLineArgvs && typeof JSON.parse(commandLineArgvs) === 'object') {

  let arvObj = JSON.parse(commandLineArgvs);
  runData = Object.assign({}, assignmentData, arvObj);

} else {
  runData = Object.assign({}, assignmentData);
}

// Need to be clear about deep cloning
runData.position = {
  index: runData.position.index,
  page: runData.position.page || 0,
};

runData.done = Object.assign({}, runData.done);

if (runData.completed && !runData.redo) {
  throw Error('It looks like this assignment is already done! Get a new one! Google doc?'.red)
}




// let checkingIDs = false;
// let afterNameIndex = async function () {};
if (runData.mode === 'check' || runData.mode === 'pattern') {
  // checkingIDs = true;
  // doWithDocket = justIDs;

  // For finding all current dockets
  doWithDocket = makeIDCollection;
} else {
  // For downloading PDFS
  let doWithDocket = downloadBothFiles;
}





let stringify = function (toStringify) {
  let string = JSON.stringify(toStringify, null, 2);
  return string;
};

const logDir = runData.dataDirectory + 'logs/';
const logPath = logDir + assignmentID + '.txt';
// Make directory if needed
mkdirp.sync(logDir, async function (err) {
    if (err) { log('Error::', err); }
});

// TODO: Make this a higher order function taking a 'logPath' arg
// Doesn't work in `page` higher order functions (think it can't save file there)
// Try this sometime (though `window.log` didn't work): https://stackoverflow.com/a/52176714
async function log (...all) {
  console.log(...all);

  let thisLogPath = logPath;

  let combined = all.join(' ');
  let runPosition = JSON.stringify(runData.position);
  try {
    fs.appendFileSync(thisLogPath, '\n' + combined + '\n' + runPosition);

    // If error, file doesn't exist yet
  } catch (err) {
    try {
      fs.writeFileSync(thisLogPath, combined);
      fs.appendFileSync(thisLogPath, '\n' + combined + '\n' + runPosition);
    } catch (err) {
      throw err;
    }  // second try
  }  // first try
}

// let logObj = {log: log};







if (!runData.redo) {
  log('Warning:', 'Be aware only new name indexes will be used. Nothing will be redone. That\'s good as long as it\'s what you want. You can change that with the "redo" custom property.'.yellow);
} else {
  log('Warning:', 'Previously gotten names will be gotten again! Because of your "redo" custom property.'.red);
}

log('runData:\n', stringify(runData));


// Using the runData
const type = runData.type;  // cp or mdj

// Paths
const namesFilePath = runData.namesPath;
const dataDirectory = runData.dataDirectory + assignmentID + '/';
const usedDocketsPath = dataDirectory + type + runData.usedDocketsFileName;
// Make directory if needed
mkdirp.sync(dataDirectory, async function (err) {
    if (err) { log('Error::', err); }
});
// Keeping track of what code version number we're at so
// in future we know where to backtrack to.
fs.appendFileSync(usedDocketsPath, versionNumber, async function (err) {
  if (err) {log(err);}
});

// Assigned variables
const names = require(namesFilePath);
const namesEndIndex = runData.endIndexRange;

const dates = {
  start: runData.startDate,
  end: runData.endDate,
};

/// *** CHANGE THIS INTO META DATA (PDFs. Psh.)
const dateTextParts = [
  dates.start.substring(0, 2),  // startMonth
  dates.start.substring(dates.start.length-2, dates.start.length),  // startYear
  dates.end.substring(0, 2),  // endMonth
  dates.end.substring(dates.end.length-2, dates.end.length),  // endYear
];
const datesText = '_' + dateTextParts.join('_');

const throttle = runData.wait;
const doPlaySound = runData.alerts;





// Global mutating state vars
let nameIndex = runData.position.index || runData.startIndexRange;
runData.position.page = runData.position.page || 0;
let timesRepeated = 0;
// await log('start index: ', nameIndex + ', end index:', namesEndIndex);

// Limit yourself to whatever 429 is going to say.
// 429 error didn't reveal any secrets.
// Assume about 830 downloads per hour
let numPDFs = 0;
let timeStartedRunning = Date.now();













async function byNamesDuring (dates, browser, page) {

  let err = null;

  await page.setViewport({width: 1920, height: 2000});
  page.on('console',
    async function pageLog (consoleObj) {
      await log(consoleObj.text());
    }
  );//await log(consoleObj.text()));

  await log('Opening page');
  let goto = await page.goto(url);
  await log('Status:', goto.status());
  let status = goto.status();
  if (status === 429 || status === 500) {
    throw Error('Error code ' + status);
  }

  await page.waitForSelector(searchTypeSelector)
  // If the page is back, we can start the repeat count again.
  timesRepeated = 0;

  // Fill in fields

  // Select search by name
  await page.select(
    searchTypeSelector,
    searchTypeVal
  );

  while (nameIndex <= namesEndIndex) {

    await page.waitFor(throttle * 1);
    // Make sure the page is there
    await page.waitForSelector(lastNameSelector);

    await log('~\n~\n~\n~\n~\nName index: ' + nameIndex + '\n~\n~\n~\n~\n~\n');
    if (doPlaySound !== 'no') { alert.nameIndex(); }

    let name = names[nameIndex];
    await log(name);

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

    // wait 15 min
    await log('Waiting up to 15 min for large results to load'.bgWhite.blue + ' @', getNowHHMM());
    await page.waitForSelector(
      searchSelector,
      {timeout: 15 * 60 * 1000}
    );
    await page.click(searchSelector);

    let count = 0;
    // Look through the page for relevant files
    let pageData = {done: false, previous: null};
    while (!pageData.done) {

      // apparently this seems to go too fast otherwise somehow and give itself an error...
      // it doesn't even seem to actually wait for a full timeout
      await page.waitFor(throttle);
      // wait 15 min
      await log('Waiting up to 15 min for large results to load'.bgWhite.blue + ' @', getNowHHMM());
      await page.waitForSelector(
        searchSelector,
        {timeout: 15 * 60 * 1000}
      );

      pageData = await getPDFs(browser, page, pageData);

    }  // ends while this name not done

    await log(18)
    await nextIndex(pageData.foundNonResult);
  }  // ends while name index

  // Record that this data was finished
  assignmentData.completed = true;
  fs.writeFileSync(assignmentPath, stringify(assignmentData, null, 2));

  await log(19);
  return;
};  // Ends byNamesDuring()





async function getPDFs (browser, page, pageData) {
  await log('new page'.bgYellow);

  // See the page we were last one when the program stopped
  // Doesn't actually need to be here, but it's nice for
  // logging something.
  // It's our page goal for where to start downloading
  // files.
  let goalPageNumber = runData.position.page || 1;
  await log('Goal page: '.blue, goalPageNumber);
  let previousPageNumber = pageData.previous;
  await log('Previous page: '.yellow, previousPageNumber);


  let resultsStartTime = Date.now()
  await log('start looking for result:', Date().toString());

  // wait for results to load
  let err = null;
  let resultsElem = page.waitForSelector(
    resultsSelector,
    { 'timeout': 120000 }
  );
  let noResultsElem = null;

  if (type === 'cp') {
    noResultsElem = page.waitForSelector(noResultsSelector,
      { 'timeout': 120000 });
  } else {
    noResultsElem = page.waitForFunction(
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
  let foundNonResult = false;
  try {
    await Promise.race([resultsElem, noResultsElem])
      .then(async function(value) {
        await log('race value:', value._remoteObject.description);
        foundSomeResults = value._remoteObject.description.indexOf(resultsSelector) >= 0;
        foundNonResult = !foundSomeResults;
        await log('results found?', foundSomeResults);
        await log('no results found?', foundNonResult);
      });
  } catch (anError) {
    await log('no results or non-results elements found');
    throw anError;
  }

  let endTime = Date.now();
  let elapsed = endTime - resultsStartTime;
  await log('Time elapsed to find results:', elapsed, '(seconds:', elapsed/1000 + ')');

  if (foundNonResult) {
    return {done: true, foundNonResult: foundNonResult};
  }
  // This will be taken care of by error?
  // if (!foundNonResult && !foundSomeResults) {
  //   return {done: true}
  // }
  
  await log(3);

  // Do we still need this?
  await page.waitForSelector(tableSelector);

  await log(4);
  // See if we're on the last page of multiple pages
  // Also wait a bit to let the table items load
  // I know of no other way that would be useful
  let paginated = false;
  // Waiting for a long time mostly hurst one-pagers
  // With a long date range, names that have one-pagers should be more rare
  // TODO: possibly remember pagination and know... to wait longer...? Problematic.
  // One pagers have results with no nav, but there's no positive to look
  // for, just the missing place where the nav should be...
  await page.waitForSelector(
      nextSelector,
      {timeout: 1/2 * 60 * 1000}
  ).then(async function(arg){
    if (arg) { paginated = true; }
  }).catch(async function(){
    await log('One-pager');
  });

  // If we're paginated
  if (paginated) {

    await log('paginated:', paginated);
    // PAGINATION
    // don't download pdfs till we know we're on the right page.
    // don't increment page till we've finished downloading pdfs.
    // only increment page if we're not done.

    // The right page is our goal page number
    // Look to see if our goal page number is in the nav menu
    // If all pages listed are lower, click the highest one
    // and return to prevous function to do another loop
    // with `done` being `false`

    await page.waitForSelector(
      pageNumSelector,
      {timeout: 60000}
    );
    // console.log('a', typeof log);
    let waitedForCurrentPage = await page.waitForFunction(
      function (pageNumSelector, previousPageNumber){
        // console.log('b', JSON.stringify(pageNumSelector), JSON.stringify(previousPageNumber), typeof log);
        let currentPageElem = document.querySelector(pageNumSelector);
        let currentPageNumber = parseInt(currentPageElem.innerText);
        // If we're on the same page as before,
        // we need to wait some more
        // console.log('c:', JSON.stringify(previousPageNumber), JSON.stringify(currentPageNumber));
        if (previousPageNumber !== null && currentPageNumber === previousPageNumber){
          return false;
        } else {
          // await log('on new page:', currentPageNumber);
          console.log('on new page:', currentPageNumber);
          return currentPageNumber;
        }
      },
      {timeout: 15 * 60 * 1000},
      pageNumSelector, previousPageNumber
    );

    // console.log('d');
    // Implement this sometime
    let currentPage = waitedForCurrentPage._remoteObject.value;
    await log('waited for current page:', currentPage);

    // console.log('e');
    let navData = await page.evaluate(
      function (paginationSelector, pageNumSelector, goalPageNumber){
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

        // let funcStr = logObj.log;
        // let log = new Function(`return ${funStr}.apply(null, arguments)`);

        // // think this doesn't work because trying to save stuff at the root folder, etc
        // log('\n\n\n\n\n\n\n\n\nblah\n\n\n\n\n\n\n\n\n');

        let currentPageElem = document.querySelector(pageNumSelector);
        let currentPageNumber = currentPageElem.innerText;

        // Get all the page navigation options. Something funky is going on.
        let navElem = document.querySelector(paginationSelector);
        let navText = navElem.innerText;
        // await log('nav:', navText);  // (log comforting info if it's possible in here)
        console.log('nav:', navText);  // (log comforting info if it's possible in here)

        let goalStr = goalPageNumber.toString();
        // await log('current actual page indicated in nav:', currentPageNumber);
        console.log('current actual page indicated in nav:', currentPageNumber);

        let atGoal = currentPageNumber === goalStr;
        // await log('current is goal?', currentPageNumber, goalStr, atGoal);
        console.log('current is goal?', currentPageNumber, goalStr, atGoal);
        // If we're there, no need to click on anything
        if (atGoal) {
          // await log('Reached goal page');
          console.log('Reached goal page');
          return {reachedGoal: true, navText: navText};
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
          // await log('CSS index of link to goal:', goalIndex)
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
          // await log('Index to click on:', indexOfClick);
          console.log('Index to click on:', indexOfClick);
          selector = paginationSelector + ' a:nth-child(' + indexOfClick + ')';
        }

        return {selector: selector, newPageNumber: parseInt(currentPageNumber), navText: navText};
        // Implement this sometime
        // return {selector: selector};
      },
      paginationSelector, pageNumSelector, goalPageNumber
    );

    await log('navData:', navData);

    // If we need to keep looking for our goal page,
    // click on a new page and cycle through this again
    if (navData.reachedGoal !== true) {
      await log('clicking to a new page');
      previousPageNumber = navData.newPageNumber;
      page.click(navData.selector);
      return {done: false, previous: navData.newPageNumber};
    }

  }  // ends if paginated make sure to get to our goal


  await log(5);
  // go down rows getting links and ids
  await page.waitForSelector(linksSelector).catch(async function(err){
    await log('no link to pdf? maybe no results.')
  });
  const linksText = await page.evaluate(
    async function (linksSelector) {
      let links = Array.from(
        document.querySelectorAll(linksSelector),
        element => element.href
      )
      return links;
    },
    linksSelector
  ).catch(async function(err){
    await log('no link to pdf? maybe no results.')
  });

  await log(6);

  await page.waitForSelector(docketIDSelector)
    .catch(async function(err){
      await log('no docket number? maybe no results.')
    });
  const docketIDTexts = await page.evaluate(
    async function (docketIDSelector) {
      let ids = Array.from(
        document.querySelectorAll(docketIDSelector),
        element => element.innerText
      )
      return ids;
    },
    docketIDSelector
  ).catch(async function(err){
    await log('no docket number? maybe no results.')
  });

  await log(7);

  // (Because the linksText list is twice as long)
  let adder = 0;

  await log(8);
  // download both pdfs
  for (let index = 0; index < docketIDTexts.length; index++) {

    // See if docket was already gotten?

    let id = docketIDTexts[index]
    // We just want some kinds of data, or so they tell us
    if (requiredPrefix.test(id)) {
      adder = await doWithDocket(id, goalPageNumber, page, linksText, index, adder);
    }
  }  // ends for all dockets


  await log(9);

  let done = true;
  if (paginated) {
    // PAGINATION
    // √ don't download pdfs till we know we're on the right page.
    // √ don't increment page till we've finished downloading pdfs.
    // only increment page if we're not done.

    // if paginated, we're not sure we're done
    done = false;

    await log(10);
    // Look for what nav elements are disabled
    const disabledText = await page.evaluate(
      function (paginationSelector) {
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

    await log(12);

    await log('disabledText:'.bgYellow, disabledText)
    let nextIsDisabled = disabledText.indexOf('Next') > -1;
    if (nextIsDisabled) {
      // Means we're on the last page
      await log('On the last page');
      done = true;

    } else {

      await log('Still more pages to go! Clicking the next button'.yellow)
      // If there are still more pages to go, add another page number
      // and store it (we're going on to the next page)
      runData.position.page = goalPageNumber;
      runData.position.page += 1;
      // Don't store other custom command line arguments, though
      assignmentData.position.page = runData.position.page;
      fs.writeFileSync(assignmentPath, stringify(assignmentData, null, 2));

      await log(13);
      // Nothing fancy, just click the 'next' button
      let nextButton = paginationSelector + ' a:nth-last-child(2)';
      await page.click(nextButton);

      await log(14);
    }  // ends if we're at the last page

    await log(15);

  }  // ends if paginated

  await log(16, done);
  return {done: done, previous: previousPageNumber};
  // Implement this sometime
  // return {done: done, previous: currentPage};
};  // Ends getPDFs()


async function downloadBothFiles (docketID, goalPageNumber, page, linksText, index, adder) {

  let text = Date.now() + '_' + docketID + '_namei_' + nameIndex + '_page_' + goalPageNumber;
  let datedText = text + datesText;

  // save docket id for later reference
  fs.appendFileSync(usedDocketsPath, datedText + '\n', async function (err) {
    if (err) await log(err);
  });
  await log('docket id written:', text);

  // Download pdfs
  await page.waitFor(throttle * 10);
  await downloadPDF(linksText[index + adder], text + '-docket.pdf', docketID);
  // Because the linksText list is twice as long
  await log('docket #' + index, 'saved');
  numPDFs++;

  adder++

  await page.waitFor(throttle * 10);
  await downloadPDF(linksText[index + adder], text + '-summary.pdf', docketID);
  await log('summary #' + index, 'saved');
  numPDFs++;

  await log('# pdfs downloaded:', numPDFs, ', time elapsed:', (Date.now() - timeStartedRunning)/1000, 'seconds');

  // Keep iterating properly through the links
  return adder;
};  // Ends async downloadBothFiles()




async function downloadPDF(pdfURL, outputFilename) {
  // await log(pdfURL);
  let pdfBuffer = await request.get({
    uri: pdfURL, encoding: null,
    headers: {'User-Agent': 'cfb-data-analysis'}
  });
  let path = dataDirectory + outputFilename;
  fs.writeFileSync(path, pdfBuffer, async function (err) { if (err) {await log(err)} });
}





// For now just create all the docket ids in each file
// for each assignment. Later check them against each other
async function makeIDCollection (docketID, goalPageNumber, page, linksText, index, adder) {

  let dir = runData.dataDirectory;
  mkdirp.sync(dir, async function (err) {
      if (err) { log('Error::', err); }
  });

  let resultsPath = await getIDsResultsPath(runData);

  let cssIndex = index + 1;
  let thisFilingDateSelector = filingDateSelectorStart + cssIndex + filingDateSelectorEnd;

  let currentDocketsData;
  // If the file already exists, get that
  try {
    let pastDockets = require(resultsPath);  // JSON - array? Object?
    currentDocketsData = pastDockets || { found: {} };

  // If not, we'll create it later
  } catch (err) {
    currentDocketsData = {};
  }

  let filingDate = await page.evaluate(
    function (thisFilingDateSelector) {
      return document.querySelector(thisFilingDateSelector).innerText;
    },
    thisFilingDateSelector
  );

  let position = require(assignmentPath).position;
  await log('position:', JSON.stringify(position));
  await log('id:', docketID);
  await log('filing date:', filingDate);

  let rowData = {
    assignmentID: assignmentID,
    position: position,
    id: docketID,
    filingDate: filingDate,
    foundTimestamp: Date.now(),
  };

  // See if docket was already gotten? Maybe in future.

  // Add data to a file
  currentDocketsData[docketID] = rowData;

  // // Prepare for checking on missing at... end of nameIndex?
  // if (checkingIDs) {
  //   if (Array.isArray(currentDocketsData.found[nameIndex])) {
  //     currentDocketsData.found[nameIndex].push(docketID);
  //   } else {
  //     currentDocketsData.found[nameIndex] = [ docketID ];
  //   }
  // }

  let json = stringify(currentDocketsData, null, 2);
  // Will also create file if it doesn't exist
  fs.writeFileSync(resultsPath, json);

  numPDFs++;
  await log('num found so far:', numPDFs);

};  // Ends async makeIDCollection()




// Should we store these ones by name index now...?
// Compounding problems? Hmm
// async function justIDs (docketID, nameIndex) {
async function justIDs (docketID) {
  let resultsPath = await getIDsResultsPath(runData);
  let results = require(resultsPath) || {};

  if (!Array.isArray(results[nameIndex])) {
    results[nameIndex] = [ docketID ];
  } else {
    results[nameIndex].push(docketID);
  }

  let json = stringify(results);

  fs.writeFileSync(resultsPath, json);
};  // Ends async justIDs()



// // This can only work if we stored them by name index, which we didn't
// // So we'll have to wait to check them in a separate script after
// // they've all been processed :(
// async function checkIDs (nameIndex, resultsPath) {

//   if (!resultsPath) {
//     resultsPath = await getIDsResultsPath(runData);
//   }

//   let initialDocketsDir = 'data-' + runData.type + '/pattern/';
//   let initialDocketsPath = initialDocketsDir + assignmentData.initialDockets;
//   let initialDockets = require(initialDocketsPath);

//   // Get current name index ids found. Now where's that being stored...?
//   let IDsFoundInThisIndex = require(resultsPath);

//   // Damn. Way I stored them we have to go through all of them each time. Bleh.
//   for (let key in initialDockets) {
//     if (!docketsToCheck.includes(key)) {
//       log('docket not found');
//     }
//   }

// };  // Ends async checkIDs()


async function getIDsResultsPath (runData) {
  let dir = runData.dataDirectory;
  mkdirp.sync(dir, async function (err) {
      if (err) { log('Error::', err); }
  });

  let fileName = runData.patternIDFileName + '_' + assignmentID + '.json';
  let resultsPath = dir + fileName;
  return resultsPath;
};




async function nextIndex (nonResultWasFound) {
  await log('onto the next index');
  // Permanently save that the current name was completed,
  // but all other data stays the same. Should changing data
  // and non-changing data be in the same file?
  if (nonResultWasFound) {
    assignmentData.done[nameIndex] = 0;
  } else {
    assignmentData.done[nameIndex] = runData.position.page;
  }
  // Update our temporary data too
  runData.done[nameIndex] = runData.position.page;

  // If we don't want to do redos, increase the index number
  // till we get to an index that we haven't done
  const weDoNotWantRedos = !runData.redo;
  let alreadyBeenDone = true;

  if (weDoNotWantRedos) {
    while (alreadyBeenDone && nameIndex <= runData.endIndexRange) {
      await log('been done:', nameIndex);
      // Update to new index
      nameIndex += 1;
      alreadyBeenDone = typeof runData.done[nameIndex] === 'number';
    }

  // If we want redos, then just go to the next one
  } else if (nameIndex <= runData.endIndexRange) {
    nameIndex += 1;
  }

  // Permanently remember the next name index needed
  assignmentData.position.index = nameIndex;
  // Start page count over again
  await log('resetting page to 1');
  runData.position.page = 1;
  assignmentData.position.page = 0;
  fs.writeFileSync(assignmentPath, stringify(assignmentData, null, 2));

  // afterNameIndex(nameIndex - 1);

  return;
}  // Ends nextIndex()


// Test
let previousBrowser = null;
async function startNewBrowser () {

  if (previousBrowser) {
    await previousBrowser.close();
  }

  await log('Creating browser');
  let browser = await puppeteer.launch({ headless: true });
  previousBrowser = browser;
  const page = await browser.newPage();

  try {

    await byNamesDuring(dates, browser, page)
      .then(async function(value){
        await log('value:', value);
        await log('success');
        if (doPlaySound !== 'no') {
          alert.success();
        }

        try {
          await brower.close();
        } catch (anError) {
          // probably already closed
        }
        process.exit();

      });

  } catch (anError) {

    await log('byNamesDuring catch clause @'.yellow, getNowHHMM().yellow);
    await log(anError);
    if (doPlaySound !== 'no') {
      // Temporary error
      alert.error();
    }

    await waitThenRepeat(dates, browser, page, anError.statusCode);

  }  // ends catch byNamesDuring errors

};



async function waitThenRepeat (dates, browser, page, errStatusCode) {
  timesRepeated++;
  timesRepeated % 7;  // Will turn into 0
  await log('Hang tight, the code will work on taking care of this'.bgWhite.blue.underline.bold);
  await log('timesRepeated:', timesRepeated);

  // How to keep using the previous browser?
  let keepGoing = function () {}

  await log(errStatusCode, typeof errStatusCode);
  if (errStatusCode === 429) {
    // Note: Still got 429 while on 550ms throttle (5 secs for pdfs)
    // on some machines.
    // Website really means business with 429. 1 hour.
    // Add 5 min to make sure time is reached
    // then go straight to an hour.
    timesRepeated = 3;
    await log('waiting 5 minutes'.bgWhite.blue + ' @', getNowHHMM());
    setTimeout(startNewBrowser, 300000);

  } else {
    if (timesRepeated <= 2) {
      await log('waiting 1 min'.bgWhite.blue + ' @', getNowHHMM());
      setTimeout(startNewBrowser, 60000);

    } else if (timesRepeated <= 5) {
      await log('waiting an hour'.bgWhite.blue + ' @', getNowHHMM());
      setTimeout(startNewBrowser, 3600000);

    } else if (timesRepeated <= 6){
      // wait 15 min
      await log('3 hours should have passed. Waiting 15 min'.bgWhite.blue + ' @', getNowHHMM());
      setTimeout(startNewBrowser, 900000);

    } else {
      // Final error
      await log("giving up").red;
      alert.gaveUp();
      await browser.close();
      process.exit(1);
    }
  }
};


// Just keep track of the darn time
let getNowHHMM = function () {
  let date = new Date();  // now
  let time = date.toTimeString();
  let hhmm = time.substring(0, 5); // military time
  return hhmm;
}


startNewBrowser();
