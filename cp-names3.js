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
      paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_casePager';

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
//       paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
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

// let type = 'mdj';

// // Paths
// // // doesn't exist yet
// // let namesFilePath = './names/mdj_alternating_nonmatching_names01_17to12_18_remaining_shuffled.json';
// let namesFilePath = 'names3.json';
// let pdfPath = 'data-mdj/';
// let usedDocketsPath = 'mdj-named-dockets-used.txt';
// let nameIndexPath = 'mdj-name-index.json';


// Limit yourself to whatever 429 is going to say.
let numPDFs = 0;
let timeStartedRunning = Date.now();
// start 8,095
// 9,164
// 9,667


// Standard/shared

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

  let arvObj = JSON.parse(commandLineArgvs);console.log('argv obj:', arvObj);
  runData = Object.assign(assignmentData, arvObj);console.log('combined objects:', runData);

} else {
  runData = assignmentData;
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
const usedDocketsPath = dataDirectory + runData.usedDocketsFileName;
// Make directory if needed
mkdirp(dataDirectory, function (err) {
    if (err) { console.error(err); }
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
let startPageNum = runData.position.index || 0;
let timesRepeated = 0;
console.log('start index: ', nameIndex + ', end index:', namesEndIndex);

















// // Maybe sometimes in the middle of a page it gets overloaded, but doesn't give 429
// let names = require(namesFilePath);
// const dates = {start: "01/01/2017", end: "12/31/2018"};
// let throttle = 15;
// let timesRepeated = 0;
      
// let dateOb = new Date;
// let datesText = '_' + dateOb.getTime(dates.start) + '_' ;

// // Inclusive
// // orignal run: index 41
// // latest: node cp-names.js 41 45
// let namesStartIndex = parseInt(process.argv[2]),
//     namesEndIndex   = parseInt(process.argv[3]);
// let nameIndex = namesStartIndex;
// let doPlaySound = process.argv[5];

// if (process.argv[4]) {
//   throttle = parseInt(process.argv[4]);
// }

// fs.writeFileSync(nameIndexPath, namesStartIndex);
// console.log('start index: ', namesStartIndex + ', end index:', namesEndIndex);











async function byNamesDuring (dates, browser, page) {

  let err = null;

  await page.setViewport({width: 1920, height: 2000});
  // page.on('console', consoleMessageObject => function (consoleMessageObject) {
  //   if (consoleMessageObject._type !== 'warning') {
  //     console.debug(consoleMessageObject._text)
  //   }
  // });
  // page.on('console', consoleObj => console.log(consoleObj.text + '\n'));//console.log(consoleObj.text()));  // untried

  await page.goto(url)
  await page.waitForSelector(searchTypeSelector)

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
    // Search through the pages
    let pageData = {done: false, page: 0, err: {message: null, value: null}};
    while (!pageData.done) {

      // apparently this seems to go too fast otherwise somehow and give itself an error...
      // it doesn't even seem to actually wait for a full timeout
      await page.waitFor(throttle);
      await page.waitForSelector(searchSelector);
      // If the page is back, we can start the repeat count again.
      timesRepeated = 0;

      pageData = await getPDFs(browser, page, pageData.page);

    }  // ends while this name not done

    // Start page count over again
    assignmentData.position.page = 0;
    fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));

    console.log(18)
    updateIndex();
  }  // ends while name index

  // Record that this data was finished
  assignmentData.completed = true;
  fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));

  console.log(19);
  return;
};  // Ends byNamesDuring()


let pageCount = 0;
async function getPDFs (browser, page, lastPageNum) {
  console.log('getting pdfs');

  let newPageNum = lastPageNum + 1;
  console.log('page: '.blue, newPageNum)

  // Permanently remember the page we were on
  assignmentData.position.page = newPageNum || 0;
  fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));

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
      { timeout: 120000 },
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
    return {done: true, page: null};
  }
  if (!foundNoResults && !foundSomeResults) {
    return {done: true, page: null, err: {message: 'not found', value: anError}}
  }
  
  console.log(3);

  await page.waitForSelector(tableSelector, {timeout: 5000});

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

  // Make sure we finish getting to the correct page
  if (paginated) {
    await page.waitFor(
      async function (newPageNum, pageNumSelector) {
        // The correct number should have no underline
        let elem = document.querySelector(pageNumSelector);
        let currPage = parseInt(elem.innerText);
        let isNew = currPage === newPageNum;
        return isNew;
      },
      {},
      newPageNum, pageNumSelector
    );
  }

  console.log(4.5)
  // Because we're somehow missing this sometimes...?
  let navText = null;
  await page.evaluate(
    (paginationSelector) => {
      return document.querySelector(paginationSelector).innerText;
    },
    paginationSelector
  ).then(function (returnedNavText) {
    if (returnedNavText) {
      navText = returnedNavText;
      paginated = true;
    }
  }).catch(function (err){
    // Not sure if we need to catch this one or not
  });
  console.log('paginated:', paginated, ', nav:', navText);
  if (navText) {
    let pages = navText.match(/\d+/g);
    let lastPage = pages[pages.length - 1];
  }

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
      let text = Date.now() + '_' + id + '_namei_' + nameIndex + '_page_' + newPageNum;
      let datedText = text + datesText;

      // save docket id for later reference
      fs.appendFileSync(usedDocketsPath, datedText, function (err) {
        if (err) console.log(err);
      });
      console.log('docket id written');

      await page.waitFor(throttle * 10);
      // Download pdfs
      await downloadPDF(linksText[index + adder], text + '-docket.pdf');
      // Because the linksText list is twice as long
      console.log('docket #' + index, 'saved');
      numPDFs++;

      adder++

      await page.waitFor(throttle * 10);
      await downloadPDF(linksText[index + adder], text + '-summary.pdf');
      console.log('summary #' + index, 'saved');
      numPDFs++;

      console.log('# pdfs downloaded:', numPDFs, ', time elapsed:', (Date.now() - timeStartedRunning)/1000);
    }
  }


  console.log(9);

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

    // hit 'next' if we need to (if the next button isn't disabled)
    if (disabledText.indexOf('Next') === -1) {

      console.log(13);
      let nextButton = paginationSelector + ' a:nth-last-child(2)';
      page.click(nextButton)

      console.log(14);

    } else {
      // if the next button is disabled for results that have multiple pages
      // we're done with all the pages
      done = true;
    } // ends if on the last page

    console.log(15);

  }  // ends if paginated

  console.log(16, done);
  return {done: done, page: newPageNum};
};  // Ends getPDFs()


// async function downloadPDF(pdfURL, docket, outputFilename) {
async function downloadPDF(pdfURL, outputFilename) {
  // console.log(pdfURL);
  let pdfBuffer = await request.get({
    uri: pdfURL, encoding: null,
    headers: {'User-Agent': 'cfb-data-analysis'}
  });
  let path = dataDirectory + outputFilename;
  fs.writeFileSync(path, pdfBuffer, function (err) { if (err) {console.log(err)} });
}


let updateIndex = function () {
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
  console.log('been done', alreadyBeenDone);
  if (weDoNotWantRedos) {
    while (alreadyBeenDone && nameIndex <= runData.endIndexRange) {
  console.log('while index', nameIndex);
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
  fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));

  return;
}  // Ends updateIndex()


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
  
//     .then(async (result) => {
//       let value = result[0],
//           err = result[1];
//       if (value === 'not found') {
//         console.log('page/element not found. page probably not loading.');
//         console.log('status code:', err.statusCode);
//         if (doPlaySound !== 'no') {
//           // Temporary error
//           alert.error();
//           console.log('\n#\n#\n# >> Let this go till log says "giving up". Or stop it yourself and deal with it a different way. 1\n#\n#\n#');
//           console.log(err.statusCode)
//           if (err.statusCode === 429) {
//             await show429(page);
//             await browser.close();
//             process.exit()
//             // browser.close()
//             // console.log('waiting two minutes');
//             // setTimeout(function(){waitThenRepeat(browser)}, 120000);
//           } else {
//             // repeat with increased wait
//             waitThenRepeat(browser);
//           }
//         }
//       } else {
//         console.log('success');
//         if (doPlaySound !== 'no') {
//           alert.success();
//         }
//         process.exit();
//       }
//       // gotIt = true;

//       try {
//         brower.close();
//       } catch (err) {
//         // probably already closed
//       }

//     }).catch(async (err) => {
//       console.log('\n****\n****\n****\n****\n****\n****\n****\n****\n****\n****\n');
//       console.log('status code:', err.statusCode);
//       // setTimeout(function () {
//       // startNewBrowser();
//       // }, 60000);
//       if (doPlaySound !== 'no') {
//         // Temporary error
//         alert.error();
//       }
//       console.log('status code:', err.statusCode);

//       // browser.close();
//       console.log('\n#\n#\n#\n### Let this go till log says "giving up". Or stop it yourself and deal with it a different way. 2\n#\n#\n#');
//       console.log(err.statusCode)
//       if (err.statusCode === 429) {
//         await show429(page);
//         await browser.close();
//         // console.log('waiting two minutes');
//         // setTimeout(function () {waitThenRepeat(browser)}, 120000);
//         process.exit()
//       } else {
//         waitThenRepeat(browser);
//       }
//     });



async function waitThenRepeat (dates, browser, page, errStatusCode) {
  timesRepeated++;
  timesRepeated % 7;  // Will turn into 0
  console.log('timesRepeated:', timesRepeated);

  // How to keep going only at the right times?
  let keepGoing = function () {}

  if (errStatusCode === 429) {
    // Website really means business with 429
    // Don't know how long it needs. The 429 page didn't seem to show.
    // This is a guess.
    console.log('waiting an hour @', getNowHHMM());
    setTimeout(startNewBrowser, 3601000);

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


let getNowHHMM = function () {
  let date = new Date();  // now
  let time = date.toTimeString();
  let hhmm = time.substring(0, 5); // military time
  return hhmm;
}


startNewBrowser();
