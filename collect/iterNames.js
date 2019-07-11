// iter-names.js

const fs = require('fs');
const puppeteer = require('puppeteer');

// // vars
// nameIndex;  // global
// names;
// assignmentData;  // For now this gets mutated :/
// runData;  // Used in this and its child processes from now on
// throttle;
// url;  // Remove after testing
// searchTypeSelector;
// searchTypeVal;
// lastNameSelector;
// firstNameSelector;  // Remove after testing
// searchSelector;
// runData;
// nextSelector;

// // funcs
// funcs.updateTimesRepeated;
// funcs.updateAssignment;


// // In-house
const alert = require('../alert.js');
const setupSearches = require('./setupSearches.js');
const setupSiteSearchValues = setupSearches.setupSiteSearchValues;
const setupNameSearch = setupSearches.setupNameSearch;
const getNowHHMM = require('./getNowHHMM.js').getNowHHMM;
// const checkForResults = require('./checkForResults.js').checkForResults;
// const skipSomePagesIfNeeded = require('./skipSomePagesIfNeeded.js').skipSomePagesIfNeeded;
// const doWithDocketsFuncs = require('./doWithDocketsFuncs.js');
// const doWithDocketsRows = doWithDocketsRowsFuncs.doWithDocketsRows;
// const arePagesDone = require('./arePagesDone.js').arePagesDone;

// Global
let nameIndex = null;

async function iterNames (vars, funcs, page) {

  // await page.setViewport({width: 1920, height: 2000});  // for snapshot peeking
  page.on('console', consoleObj => console.log(consoleObj.text()));

  const runData = vars.runData;  // Used in this and its child processes from now on
  const assignmentData = vars.assignmentData;  // For now this gets mutated :/

  // Global vars
  nameIndex = runData.position.index || runData.startIndexRange;  // global

  // arg vars
  const names = runData.names;
  const namesEndIndex = runData.endIndexRange;  // Inclusive √
  const doPlaySound = runData.alerts;
  const throttle = runData.wait;

  // Callback funcs
  const updateTimesRepeated = funcs.updateTimesRepeated;
  const updateAssignment = funcs.updateAssignment;

  // Site-specific data
  const searchTypeSelector = vars.searchTypeSelector; 
  const searchTypeVal = vars.searchTypeVal;
  const lastNameSelector = vars.lastNameSelector;
  const searchSelector = vars.searchSelector;


  await page.waitForSelector(searchTypeSelector)
  // If the page is back, we can start the repeat count again.
  updateTimesRepeated(0);

  // Should only have to do these onces once per site load
  await setupSiteSearchValues(vars, page);

  // while (nameIndex <= namesEndIndex) {

  //   // Not needed anymore?
  //   await page.waitFor(throttle * 1);
  //   // Make sure the page is there
  //   await page.waitForSelector(lastNameSelector);

    console.log('~\n~\n~\n~\n~\nName index: ' + nameIndex + '\n~\n~\n~\n~\n~\n');
    if (doPlaySound !== 'no') { alert.nameIndex(); }

    let name = names[nameIndex];

    await setupNameSearch(vars, page, name);
    // Click to run search
    await page.click(searchSelector);

    console.log('Waiting up to 15 min for large results to load'.bgWhite.blue + ' @', getNowHHMM());
    await page.waitForSelector(
      searchSelector,
      // For large results
      {timeout: 15 * 60 * 1000}
    );

    await page.screenshot({path: './collect/test.png'});

  //   // Look through the page for relevant files
  //   let doneWithAllPages = false;
  //   let pageData = {skip: false, previous: null};
  //   while (!doneWithAllPages) {

  //     // wait for something? Or is that happening somewhere else?
  //     console.log('new page'.bgYellow);

  //     // TODO: Needed? Elsewhere? In skipPagesIfNeeded?
  //     // See the page we were last one when the program stopped
  //     let previousPageNumber = pageData.previous;
  //     console.log('Previous page: '.yellow, previousPageNumber);

  //     // Wait till results load, if any
  //     let resultsElementFound = await checkForResults(vars, page);
  //     // If no results found for this name, we're done with it
  //     doneWithAllPages = !resultsElementFound;

  //     // // To clarify following code:
  //     // // Basically, move on if there are no results.
  //     // if (doneWithAllPages) {
  //     //   pageData = {previous: null, skip: false};
  //     //   break;
  //     // }

  //     // Keep doing stuff if there were results for this name
  //     if (!doneWithAllPages) {

  //       // // apparently this seems to go too fast otherwise somehow and give itself an error...
  //       // // it doesn't even seem to actually wait for a full timeout
  //       // await page.waitFor(throttle/2);
  //       // We need to check on it for each page
  //       await page.waitForSelector(
  //         searchSelector,
  //         // For large results
  //         {timeout: 15 * 60 * 1000}
  //       );

  //       // TODO: Refactor to figure out pagination out here

  //       // See if there are multiple pages
  //       // ....we're on the last page of multiple pages?
  //       let paginated = await checkForPagination(vars, page);

  //       if (paginated) {

  //         // Skip pages till we get to the page we need
  //         // Yeah, we could make `skip` true by default, but
  //         // I think it's more confusing. Anyway, works better
  //         // for iteration return value.
  //         pageData = await skipSomePagesIfNeeded(vars, funcs, page, pageData, paginated);
  //         while (pageData.skip) {
  //           pageData = await skipSomePagesIfNeeded(vars, funcs, page, pageData, paginated)
  //         }
  //       }

  //       console.log(5);
  //       // Once we're at the right page, get the PDFs
  //       await doWithDocketsRows(vars, funcs, page, nameIndex, currentPage, doDownload);

  //       console.log(9);
  //       doneWithAllPages = true;  // might undo this in just a bit

  //       // May not be done if paginated
  //       if (paginated) {

  //         doneWithAllPages = await arePagesDone(vars, funcs, page);

  //         if (doneWithAllPages) {
  //           console.log(13);
  //           // If there are still more pages to go, add another page number
  //           // and store it (we're going on to the next page)
  //           runData.position.page += 1;
  //           // Don't store other custom command line arguments, though
  //           assignmentData.position.page += 1;
  //           // fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));
  //           updateAssignment(assignmentData);  // writes to a file

  //         } else {
  //           console.log(14);
  //           // Nothing fancy, just click the 'next' button
  //           let nextButton = paginationSelector + ' a:nth-last-child(2)';
  //           await page.click(nextButton);
  //         }

  //       }  // ends if paginated

  //     }  // ends if not done with all pages

  //   }  // ends while this page not done

  //   console.log(18)
  //   nextIndex(vars, funcs);
  // }  // ends while name index not done

  // // Record that this data was finished
  // assignmentData.completed = true;
  // // fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));
  // updateAssignment(assignmentData);  // writes to a file

  // console.log(19);
  // console.log('previous name:', name);
  return;
};  // Ends iterNames()





// For now it mutates both runData and assignmentData
let nextIndex = function (vars, funcs) {

  // nameIndex is global now

  // Run data
  const runData = vars.runData;
  const assignmentData = vars.assignmentData;

  // Callback funcs
  const updateAssignment = funcs.updateAssignment;

  console.log('onto the next index');
  // Permanently save that the current name was completed,
  // but all other data stays the same. Should changing data
  // and non-changing data be in the same file?
  assignmentData.done[nameIndex] = true;
  // Update our temporary data too
  runData.done[nameIndex] = true;

  // If we don't want to do redos, increase the index number
  // till we get to an index that we haven't done
  const weDoNotWantRedos = !runData.redo;
  let alreadyBeenDone = true;  // To be clear, this is legit - this one _has_ already been done

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
  console.log('resetting page to 1');
  runData.position.page = 1;
  assignmentData.position.page = 1;
  // fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));
  updateAssignment(assignmentData);  // writes to a file

  return;
}  // Ends nextIndex()





// See if we're on mutliple pages
async function checkForPagination (vars, page) {

  const nextSelector = vars.nextSelector;

  let paginated = false;
  // TODO: Instead of a timeout, can it be managed in a
  // similar way as the results? I think I checked, but...
  await page.waitForSelector(
      nextSelector,
      {timeout: 5 * 1000}
  ).then(function(arg){
    if (arg) { paginated = true; }
  }).catch(function(){
    console.log('One-pager');
  });

  return paginated;
}; // Ends async checkForPagination()




module.exports.iterNames = iterNames;
module.exports.nextIndex = nextIndex;
