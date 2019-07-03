// mdj-names.js

const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require("request-promise-native");
const alert = require("./alert.js");
const colors = require('colors');
const mkdirp = require('mkdirp');

// // CP Stuff
// const searchTypeSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_searchTypeListControl",
//       lastNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_lastNameControl",
//       firstNameSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_firstNameControl",
//       docketTypeSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_docketTypeListControl",
//       startDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_beginDateChildControl_DateTextBox",
//       endDateSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_endDateChildControl_DateTextBox",
//       searchSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchCommandControl",
//       resultsSelector = "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel",
//       noResultsSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_noResultsPanel',
//       paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_casePager';

// const url = 'https://ujsportal.pacourts.us/DocketSheets/CP.aspx';

// const searchTypeVal = "Aopc.Cp.Views.DocketSheets.IParticipantSearchView, CPCMSApplication, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
//       docketTypeVal = "Criminal",
//       nameIndexPath = 'cp-name-index.json';
// const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';

// let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel',
//     linksSelector = '.gridViewRow a.DynamicMenuItem',
//     docketIDSelector = '.gridViewRow' + ' td:nth-child(2)';

// let nextSelector = paginationSelector + ' a:nth-last-child(2)';
// let usedDocketsPath = 'data-cp/2017-2018-randomized-alternating-nonmatching/cp-dockets-used.txt';

// let pdfPath = 'data-cp/2017-2018-randomized-alternating-nonmatching/';
// let requiredPrefix = /CP/;
// let type = 'cp';
// let namesFilePath = './names/cp_alternating_nonmatching_names01_17to12_18_remaining_shuffled.json';

// MDJ Stuff
const searchTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_ddlSearchType',
      lastNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtLastName',
      firstNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtFirstName',
      docketTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_ddlDocketType',
      startDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_beginDateChildControl_DateTextBox',
      endDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_endDateChildControl_DateTextBox',
      searchSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_btnSearch',
      resultsSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_lblPreviewInstructions',
      paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
      url = 'https://ujsportal.pacourts.us/DocketSheets/MDJ.aspx';

let noResultsSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_gvDocket';
let noResultsText = 'No Records Found'

const searchTypeVal = "ParticipantName",
      docketTypeVal = "CR";
const pageNumSelector = paginationSelector + ' a[style="text-decoration:none;"]';


let tableSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
    linksSelector = '.gridViewRow a.DynamicMenuItem',
    docketIDSelector = '.gridViewRow' + ' td:nth-child(2)';
let nextSelector = paginationSelector + ' a:nth-last-child(2)';

let requiredPrefix = /MJ/;

// Paths
// // doesn't exist yet
// let namesFilePath = './names/mdj_alternating_nonmatching_names01_17to12_18_remaining_shuffled.json';
// let namesFilePath = './names3.json';  // `require`ed
// let pdfPath = 'data-mdj/';
// let usedDocketsPath = 'mdj-named-dockets-used.txt';
// let nameIndexPath = 'mdj-name-index.json';


// Standard/shared
let versionNumber = '\n0.43.0\n';

// command line command example
// node mdj-names3-test.js 1zz '{"alerts":"no"}'

// In new file? No, we need these vars...
// Get assignment ID from command line
const assignmentID = process.argv[2];
if (!assignmentID) {
  throw Error('Please include your assignment ID. For example: node mdj-names3-test.js 24z \'{"alerts":"no"}\' (that last bit means you won\'t hear the sounds)'.yellow);
} else if (assignmentID === '24z') {
  throw Error('I think you used the default assignemt ID (24z). That\'s not a real one.'.yellow);
}

const assignmentPath = './assignments/' + assignmentID + '.json'
const assignmentData = require(assignmentPath);

// Assignment settings overrides
const commandLineArgvs = process.argv[3];

// An object for this run of the code - combining the two objects
let runData = null;
if (commandLineArgvs && typeof JSON.parse(commandLineArgvs) === 'object') {

  let arvObj = JSON.parse(commandLineArgvs);//console.log('argv obj:', arvObj);
  runData = Object.assign(assignmentData, arvObj);//console.log('combined objects:', runData);

  // Need to be clear about deep cloning
  runData.position = {
    index: runData.position.index,
    page: runData.position.page,
  };

} else {
  runData = Object.assign({}, assignmentData);

  // Need to be clear about deep cloning
  runData.position = {
    index: assignmentData.position.index,
    page: assignmentData.position.page,
  };
}

if (runData.completed && !runData.redo) {
  throw Error('It looks like this assignment is already done! Get a new one! Google doc?'.green)
}

if (!runData.redo) {
  console.warn('Be aware only new name indexes will be used. Nothing will be redone. That\'s good as long as it\'s what you want. You can change that with the "redo" custom property.'.yellow);
} else {
  console.warn('Previously gotten names will be gotten again! Because of your "redo" custom property.'.red);
}


// Using the runData
const type = runData.type;  // cp or mdj

// Paths
const namesFilePath = runData.namesPath;
const dataDirectory = runData.dataDirectory;
const usedDocketsPath = dataDirectory + type + '_' + assignmentID + runData.usedDocketsFileName;
// Make directory if needed
mkdirp(dataDirectory, function (err) {
    if (err) { console.error(err); }
});
// Keeping track of what code version number we're at so
// in future we know where to backtrack to.
fs.appendFileSync(usedDocketsPath, versionNumber, function (err) {
  if (err) console.log(err);
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
runData.position.page = runData.position.page || 1;
let timesRepeated = 0;
console.log('start index: ', nameIndex + ', end index:', namesEndIndex);

// Limit yourself to whatever 429 is going to say.
// 429 error didn't reveal any secrets.
// Assume about 830 downloads per hour
let numPDFs = 0;
let timeStartedRunning = Date.now();












async function byNamesDuring (dates, browser, page) {

  let err = null;

  await page.setViewport({width: 1920, height: 2000});
  page.on('console', consoleObj => console.log(consoleObj.text()));//console.log(consoleObj.text()));

  await page.goto(url)
  await page.waitForSelector(searchTypeSelector)
  // If the page is back, we can start the repeat count again.
  timesRepeated = 0;

  // Fill in fields

  // Select search by name
  page.select(
    searchTypeSelector,
    searchTypeVal
  );

  while (nameIndex <= namesEndIndex) {

    await page.waitFor(throttle * 1);
    // Make sure the page is there
    await page.waitForSelector(lastNameSelector);

    console.log('~\n~\n~\n~\n~\nName index: ' + nameIndex + '\n~\n~\n~\n~\n~\n');
    if (doPlaySound !== 'no') { alert.nameIndex(); }

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

    await page.waitForSelector(searchSelector);
    page.click(searchSelector);

    let count = 0;
    // Look through the page for relevant files
    let pageData = {done: false};
    while (!pageData.done) {

      // apparently this seems to go too fast otherwise somehow and give itself an error...
      // it doesn't even seem to actually wait for a full timeout
      await page.waitFor(throttle);
      // This doesn't actually seem to wait for some reason. Is that
      // because it was found before?
      await page.waitForSelector(searchSelector);

      pageData = await getPDFs(browser, page);

    }  // ends while this name not done

    console.log(18)
    nextIndex();
  }  // ends while name index

  // Record that this data was finished
  assignmentData.completed = true;
  fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));

  console.log(19);
  return;
};  // Ends byNamesDuring()









async function getPDFs (browser, page, pageData) {
  console.log('getting pdfs');


  // See the page we were last one when the program stopped
  // Doesn't actually need to be here, but it's nice for
  // logging something.
  // It's our page goal for where to start downloading
  // files.
  let goalPageNumber = runData.position.page;
  console.log('Goal page: '.blue, goalPageNumber);


  let resultsStartTime = Date.now()
  console.log('start looking for result:', Date().toString());

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

  if (foundNoResults) {
    return {done: true};
  }
  // This will be taken care of by error?
  // if (!foundNoResults && !foundSomeResults) {
  //   return {done: true}
  // }
  
  console.log(3);

  // Do we still need this?
  await page.waitForSelector(tableSelector);

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
    if (arg) { paginated = true; }
  }).catch(function(){
    console.log('One-pager');
  });

  // If we're paginated
  if (paginated) {

    console.log('paginated:', paginated);
    // PAGINATION
    // don't download pdfs till we know we're on the right page.
    // don't increment page till we've finished downloading pdfs.
    // only increment page if we're not done.

    // The right page is our goal page number
    // Look to see if our goal page number is in the nav menu
    // If all pages listed are lower, click the highest one
    // and return to prevous function to do another loop
    // with `done` being `false`
    let navText = null;
    let navData = await page.evaluate(
      function (paginationSelector, pageNumSelector, goalPageNumber) {

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

        // See if we're already on the right page (the number that isn't underlined)
        let currentPageElem = document.querySelector(pageNumSelector);
        if (!currentPageElem) {
          // Wait some more for this to appear
          return false;
        }

        let currentPageNumber = parseInt(currentPageElem.innerText);
        console.log('current actual page indicated in nav:', currentPageNumber);
        let atGoal = currentPageNumber === goalPageNumber;

        // Get all the page navigation options. Something funky is going on.
        let navElem = document.querySelector(paginationSelector);
        let navText = navElem.innerText;
        console.log('nav:', navText);  // (log comforting info if it's possible in here)

        // If we're there, no need to click on anything
        if (atGoal) {
          console.log('Reached goal page');
          return true;
        }

        // Otherwise, what should we click on?
        // Is our goal page on the screen?
        // Or do we need to go to the highest page possible?

        // Look to see if our goal page number is in there
        let navParts = navText.split(/\s/);
        let goalStr = goalPageNumber.toString();
        let goalIndex = navParts.indexOf(goalStr);
        // If goal page is there, return it to be clicked
        if (goalIndex !== -1) {
          // CSS is not 0 indexed
          goalIndex += 1;
          console.log('Index of button to goal:', goalIndex)
          return goalIndex;

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
          return indexOfClick;
        }

      },
      paginationSelector, pageNumSelector, goalPageNumber
    );  // ends wait for nav data

    console.log('navData:'.bgYellow, navData);

    // If we need to keep looking for our goal page,
    // click on a new page and cycle through this again
    if (typeof navData === 'number') {
      let pageButtonSelector = paginationSelector + ' a:nth-child(' + navData + ')';
      console.log('selector:', pageButtonSelector);
      page.click(pageButtonSelector)
      return {done: false};
    }

  }  // ends if paginated make sure to get to our goal

  // return {done: true};


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
      let text = Date.now() + '_' + id + '_namei_' + nameIndex + '_page_' + goalPageNumber;
      let datedText = text + datesText;

      // save docket id for later reference
      fs.appendFileSync(usedDocketsPath, datedText + '\n', function (err) {
        if (err) console.log(err);
      });
      console.log('docket id written');

      // Download pdfs
      await page.waitFor(throttle * 10);
      await downloadPDF(linksText[index + adder], text + '-docket.pdf');
      // Because the linksText list is twice as long
      console.log('docket #' + index, 'saved');
      numPDFs++;

      adder++

      await page.waitFor(throttle * 10);
      await downloadPDF(linksText[index + adder], text + '-summary.pdf');
      console.log('summary #' + index, 'saved');
      numPDFs++;

      console.log('# pdfs downloaded:', numPDFs, ', time elapsed:', (Date.now() - timeStartedRunning)/1000, 'seconds');
    }
  }  // ends for all dockets


  console.log(9);

  let done = true;
  if (paginated) {
    // PAGINATION
    // √ don't download pdfs till we know we're on the right page.
    // √ don't increment page till we've finished downloading pdfs.
    // only increment page if we're not done.

    // if paginated, we're not sure we're done
    done = false;

    console.log(10);
    // Look for what nav elements are disabled
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

    let nextIsDisabled = disabledText.indexOf('Next') > -1;
    if (nextIsDisabled) {
      // Means we're on the last page
      console.log('On the last page');
      done = true;

    } else {

      console.log('still more pages to go!')
      // If there are still more pages to go, add another page number
      // and store it (we're going on to the next page)
      runData.position.page += 1;
      // Don't store other custom command line arguments, though
      assignmentData.position.page += 1;
      fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));

      console.log(13);
      // Nothing fancy, just click the 'next' button
      let nextButton = paginationSelector + ' a:nth-last-child(2)';
      page.click(nextButton);

      console.log(14);
    }  // ends if we're at the last page

    console.log(15);

  }  // ends if paginated

  console.log(16, done);
  return {done: done};
};  // Ends getPDFs()


async function downloadPDF(pdfURL, outputFilename) {
  // console.log(pdfURL);
  let pdfBuffer = await request.get({
    uri: pdfURL, encoding: null,
    headers: {'User-Agent': 'cfb-data-analysis'}
  });
  let path = dataDirectory + outputFilename;
  fs.writeFileSync(path, pdfBuffer, function (err) { if (err) {console.log(err)} });
}


let nextIndex = function () {
  // Permanently save that the current name was completed,
  // but all other data stays the same. Should changing data
  // and non-changing data be in the same file?
  assignmentData.done[nameIndex] = true;
  // Update our temporary data too
  runData.done[nameIndex] = true;

  // If we don't want to do redos, increase the index number
  // till we get to an index that we haven't done
  const weDoNotWantRedos = !runData.redo;
  let alreadyBeenDone = true;

  if (weDoNotWantRedos) {
    while (alreadyBeenDone && nameIndex <= runData.endIndexRange) {
      console.log('been done:', nameIndex);
      // Update to new index
      nameIndex += 1;
      alreadyBeenDone = runData.done[nameIndex] === true;
    }

  // If we want redos, then just go to the next one
  } else if (nameIndex <= runData.endIndexRange) {
    nameIndex += 1;
  }

  // Permanently remember the next name index needed
  assignmentData.position.index = nameIndex;
  // Start page count over again
  assignmentData.position.page = 1;
  fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));

  return;
}  // Ends nextIndex()


// Test
let previousBrowser = null;
async function startNewBrowser () {

  if (previousBrowser) {
    await previousBrowser.close();
  }

  let browser = await puppeteer.launch({ headless: true });
  previousBrowser = browser;
  const page = await browser.newPage();

  try {

    await byNamesDuring(dates, browser, page)
      .then(async function(value){
        console.log('value:', value);
        console.log('success');
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

    console.log('byNamesDuring catch clause @'.yellow, getNowHHMM().yellow);
    console.log(anError);
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
  console.log('timesRepeated:', timesRepeated);

  // How to keep using the previous browser?
  let keepGoing = function () {}

  console.log(errStatusCode, typeof errStatusCode);
  if (errStatusCode === 429) {
    // Website really means business with 429
    // Don't know how long it needs. The 429 page didn't seem to show.
    // This is a guess.
    // Note: Still got 429 while on 500ms throttle (5 secs for pdfs)
    console.log('waiting 15 minutes @', getNowHHMM());
    setTimeout(startNewBrowser, 900000);

  } else {
    if (timesRepeated <= 2) {
      console.log('waiting 1 min @', getNowHHMM());
      setTimeout(startNewBrowser, 60000);

    } else if (timesRepeated <= 5) {
      console.log('waiting an hour @', getNowHHMM());
      setTimeout(startNewBrowser, 3600000);

    } else if (timesRepeated <= 6){
      // wait 15 min
      console.log('3 hours should have passed. Waiting 15 min @', getNowHHMM());
      setTimeout(startNewBrowser, 900000);

    } else {
      // Final error
      console.log("giving up");
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
