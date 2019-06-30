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

// command line command example
// node mdj-names3-test.js 1zz '{"alerts":"no"}'
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
  console.warn('Be aware only new name indexes will be used. Nothing will be redone. That\'s good as long as it\'s what you want. You can change that with the "redo" custom property.');
} else {
  console.warn('Previously gotten names will be gotten again! Because of your "redo" custom property.');
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
/// *** CHANGE THIS INTO A TYPE STAMP
// let dateStartObj = new Date(dates.start);
// let dateEndObj = new Date(dates.end);
// let datesText = '_' + dateStartObj.getTime() + '_' + dateEndObj.getTime();
// let datesText = '_' + dateOb.getTime(dates.start) + '_' ;

// Need to find a way to put this stuff in the metadata
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
let nameIndex = runData.currentIndex;
let timesRepeated = 0;
console.log('start index: ', nameIndex + ', end index:', namesEndIndex);





// FUNCTIONALITY
async function byNamesDuring (dates, browser) {

  let err = null;

  // submit to site along with date
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 2000});
  // page.on('console', consoleMessageObject => function (consoleMessageObject) {
  //   if (consoleMessageObject._type !== 'warning') {
  //     console.debug(consoleMessageObject._text)
  //   }
  // });
  // page.on('console', consoleObj => console.log(consoleObj.text + '\n'));//console.log(consoleObj.text()));  // untried

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

    // Search through the pages
    let pageData = {done: false, page: 0, err: {message: null, value: null}};
    while (!pageData.done) {

      // Make sure page is still there
      await page.waitForSelector(searchSelector)
        .catch(function(theError){
          err = theError;
          found = false;
          console.log('elment not found. 7.5')
        });
      if (found === false) {return ['not found', err];}

      // If there were results, we can start the repeat count again.
      timesRepeated = 0;

      console.log(1.5);
      pageData = await getPDFs(browser, page, pageData.page, nameIndex);
      console.log(17);
      console.log('pageData', pageData);

      // Return from error if needed
      if (pageData.err && (pageData.err.message || pageData.err.value)) {
        return [pageData.err.message, pageData.err.value];
      }
    }  // ends while this name not done

    console.log(18)

    // Permanently save that the current name was completed,
    // but all other data stays the same. Should changing data
    // and non-changing data be in the same file?
    assignmentData.done[currentNameIndex] = true;
    // Update our temporary data too
    runData.done[nameIndex] = true;

    // If we don't want to do redos, increase the index number
    // till we get to an index that we haven't done
    const weDoNotWantRedos = !runData.redo;
    let thisNameIndexIsDone = true;

    if (weDoNotWantRedos) {
      while (thisNameIndexIsDone) {
        // Update to new index
        nameIndex += 1;
        thisNameIndexIsDone = runData.done[nameIndex] === true;
      }

    // If we want redos, then just go to the next one
    } else {
      nameIndex += 1;
    }

    // Permanently remember the next name index needed
    assignmentData.currentIndex = nameIndex;
    fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData));

  }  // ends while name index <= ending index

  // Record that this data was finished
  assignmentData.completed = true;
  fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData));

  console.log(19);
  await browser.close();
  return [null, err];
};  // Ends byNamesDuring



async function getPDFs (browser, page, lastPageNum, currentNameIndex) {

  await page.waitFor(throttle);

  // wait for results to load
  console.log(2, 'last pg', lastPageNum);
  let newPageNum = lastPageNum + 1;
  console.log('new pg', newPageNum)

  let startTime = Date.now()
  console.log('start looking for result:', Date().toString());

  let anError = null;
  let resultsElem = page.waitForSelector(resultsSelector,
    { 'timeout': 120000 });
  let noResultsElem = null;
  // noResultsElem = page.waitForSelector(noResultsSelector,
  //     { 'timeout': 120000 });

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
      { 'timeout': 120000 },
      noResultsSelector, noResultsText
    );
  }

  let foundSomeResults = false;
  let foundNoResults = false;
  await Promise.race([resultsElem, noResultsElem])
    .then(function(value) {
      console.log('race value:', value._remoteObject.description);
      foundSomeResults = value._remoteObject.description.indexOf(resultsSelector) >= 0;
      foundNoResults = !foundSomeResults;
      console.log('results found?', foundSomeResults);
      console.log('no results found?', foundNoResults);
      // Both resolve, but promise2 is faster
    })
    .catch(function (theError) {
      anError = theError;
    });

  let endTime = Date.now();
  let elapsed = endTime - startTime;
  console.log('Time elapsed to find results:', elapsed, '(seconds:', elapsed/1000 + ')');

  if (anError) {
    return {done: true, page: null, err: {message: 'not found', value: anError}}
  }

  if (foundNoResults) {
    return {done: true, page: null};
  }
  if (!foundNoResults && !foundSomeResults) {
    return {done: true, page: null, err: {message: 'not found', value: anError}}
  }

  // if (type === 'cp' && !foundResults) {
  //   return {done: true, page: null};
  // }

  // if (!foundResults) {
  //   try {
  //     await page.waitFor(
  //       function (noResultsSelector, noResultsText) {
  //         let elem = document.querySelector(noResultsSelector);
  //         let text = elem.innerText;
  //         let hasNoResults = text === noResultsText;
  //         return isNew;
  //       },
  //       {},
  //       noResultsSelector, noResultsText
  //     )
  //   } catch (theError) {
  //     // Didn't find any expected elements
  //     return {
  //       value: 'not found',
  //       err: theError,
  //     };
  //   }
  // }
////


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
    // console.log(err);
  });
  console.log('paginated:', paginated, ', nav:', navText);
  if (navText) {
    let pages = navText.match(/\d+/g);
    let lastPage = pages[pages.length - 1];  // was logged as working
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
      let datedText = Date.now() + '_' + id + datesText + '_namei_' + nameIndex + '_page_' + newPageNum;

      // save docket id for later reference
      fs.appendFileSync(usedDocketsPath, datedText, function (err) {
        if (err) console.log(err);
      });
      console.log('docket id written');

      // Download pdfs
      await downloadPDF(linksText[index + adder], text + '-docket.pdf');
      // Because the linksText list is twice as long
      console.log('docket', index, 'saved');
      adder++
      await downloadPDF(linksText[index + adder], text + '-summary.pdf');
      console.log('summary', index, 'saved');
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
  let path = dataDirectory + outputFilename;
  // console.log("To " + path);
  fs.writeFileSync(path, pdfBuffer, function (err) { if (err) {console.log(err)} });
}


// Test

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
          // Temporary error
          alert.error();
          console.log('\n#\n#\n# >> Let this go till log says "giving up". Or stop it yourself and deal with it a different way. 1\n#\n#\n#');
          console.log(err.statusCode)
          if (err.statusCode === 429) {
            console.log('waiting two minutes');
            setTimeout(waitThenRepeat, 120000);
          } else {
            // repeat with increased wait
            waitThenRepeat();
          }
        }
      } else {
        console.log('success');
        if (doPlaySound !== 'no') {
          alert.success();
        }
        process.exit();
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
      if (doPlaySound !== 'no') {
        // Temporary error
        alert.error();
      }
      console.log(err);
      // How do we close the old browser?
      browser.close();
      console.log('\n#\n#\n#\n### Let this go till log says "giving up". Or stop it yourself and deal with it a different way. 2\n#\n#\n#');
      console.log(err.statusCode)
      if (err.statusCode === 429) {
        console.log('waiting two minutes');
        setTimeout(waitThenRepeat, 120000);
      } else {
        waitThenRepeat();
      }
    });
};

// BUG: Something is triggering multiple processes at the same time
// Something above this must be calling this twice. Where is this happening?
// Also, though, instantiating two different `timesRepeated` vars.
// How can that even happen?
const waitThenRepeat = async () => {
  timesRepeated++;
  timesRepeated % 11;  // 11 will turn into 0
  console.log('timesRepeated:', timesRepeated);

  if (timesRepeated <= 4) {
    setTimeout(startNewBrowser, 20000);
  } else if (timesRepeated <= 8) {
    // wait an hour before trying again
    console.log('an hour should pass.');
    setTimeout(startNewBrowser//, 60000);
    , 3600000);
  } else if (timesRepeated <= 9){
    // wait 15 min
    console.log('4 hours should have passed');
    setTimeout(startNewBrowser//, 30000);
    , 900000);
  } else {
    // Final error
    console.log("giving up");
    alert.gaveUp();
    process.exit(1);
  }

};

startNewBrowser();
