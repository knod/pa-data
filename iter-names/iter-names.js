// iter-names.js

const fs = require('fs');
const puppeteer = require('puppeteer');

// In-house
const alert = require('../alert.js');
const setupSearch = require('./setupSearch.js').setupSearch;
const checkForResults = require('./checkForResults.js').checkForResults;
const skipSomePagesIfNeeded = require('./skipSomePagesIfNeeded.js').skipSomePagesIfNeeded;
const doWithDocketsFuncs = require('./doWithDockets.js');
const doWithDockets = doWithDocketsFuncs.doWithDockets;
const doDownload = doWithDocketsFuncs.doDownload;
const getCurrentPageNumber = require('./getCurrentPageNumber.js').getCurrentPageNumber;
const arePagesDone = require('./arePagesDone.js').arePagesDone;

// Global
let nameIndex = null;

async function iterNames (vars, funcs, page) {

  // await page.setViewport({width: 1920, height: 2000});  // for snapshot peeking
  page.on('console', consoleObj => console.log(consoleObj.text()));

  // Global vars
  nameIndex = vars.nameIndex;  // global

  // arg vars
  const names = vars.names;
  const assignmentData = vars.assignmentData;  // For now this gets mutated :/
  const runData = vars.runData;  // Used in this and its child processes from now on
  const namesEndIndex = runData.namesEndIndex;
  const doPlaySound = runData.doPlaySound;
  const dates = runData.dates;  // Not needed. Remove after test.
  const throttle = vars.throttle;
  console.log('running data vars:' +
    '\n' + names +
    '\n' + nameIndex +
    '\n' + runData +
    '\n' + assignmentData +
    '\n' + namesEndIndex +
    '\n' + doPlaySound +
    '\n' + dates +
    '\n' + throttle
  );

  // Callback funcs
  const updateTimesRepeated = funcs.updateTimesRepeated;
  const updateAssignment = funcs.updateAssignment;
  const toDoWithDocketIDs = funcs.toDoWithDocketIDs;
  console.log('type of func vars:' +
    '\n' + typeof updateTimesRepeated +
    '\n' + typeof updateAssignment +
    '\n' + typeof toDoWithDocketIDs
  );

  // Site-specific data
  const url = vars.url;  // Remove after testing
  const searchTypeSelector = vars.searchTypeSelector;
  const searchTypeVal = vars.searchTypeVal;
  const lastNameSelector = vars.lastNameSelector;
  const firstNameSelector = vars.firstNameSelector;  // Remove after testing
  const docketTypeSelector = vars.docketTypeSelector;  // Remove after testing
  const docketTypeVal = vars.docketTypeVal;  // Remove after testing
  const startDateSelector = vars.startDateSelector;  // Remove after testing
  const endDateSelector = vars.endDateSelector;  // Remove after testing
  const searchSelector = vars.searchSelector;
  console.log('site-specific vars:' +
    '\n' + url +  // Remove after testing
    '\n' + searchTypeSelector +
    '\n' + searchTypeVal +
    '\n' + lastNameSelector +
    '\n' + firstNameSelector +
    '\n' + docketTypeSelector +
    '\n' + docketTypeVal +
    '\n' + startDateSelector +
    '\n' + endDateSelector +
    '\n' + searchSelector
  );


  await page.waitForSelector(searchTypeSelector)
  // If the page is back, we can start the repeat count again.
  updateTimesRepeated(0);  // global var in here?

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

    console.log('~\n~\n~\n~\n~\nName index: ' + nameIndex + '\n~\n~\n~\n~\n~\n');
    if (doPlaySound !== 'no') { alert.nameIndex(); }

    let name = names[nameIndex];

    await setupSearch(vars, page, name);
    await page.click(searchSelector);

    // Look through the page for relevant files
    let doneWithAllPages = false;
    let pageData = {skip: false, previous: null};
    while (!doneWithAllPages) {

      console.log('new page'.bgYellow);

      // TODO: Needed?
      // See the page we were last one when the program stopped
      let previousPageNumber = pageData.previous;
      console.log('Previous page: '.yellow, previousPageNumber);

      // Wait till results load, if any
      let resultsElementFound = await checkForResults(vars, page);
      // If no results found for this name, we're done with it
      doneWithAllPages = !resultsElementFound;

      // // To clarify following code:
      // // Basically, move on if there are no results.
      // if (doneWithAllPages) {
      //   pageData = {previous: null, skip: false};
      //   break;
      // }

      // Keep doing stuff if there were results for this name
      if (!doneWithAllPages) {

        // apparently this seems to go too fast otherwise somehow and give itself an error...
        // it doesn't even seem to actually wait for a full timeout
        await page.waitFor(throttle/2);
        // This doesn't actually seem to wait for some reason. Is that
        // because it was found before?
        await page.waitForSelector(searchSelector);

        let currentPageNumber = 1;

        // TODO: Refactor to figure out pagination out here

        // See if there are multiple pages
        // ....we're on the last page of multiple pages?
        let paginated = await checkForPagination(vars, page);

        if (paginated) {

          currentPageNumber = await getCurrentPageNumber(vars, page)

          // Skip pages till we get to the page we need
          // Yeah, we could make `skip` true by default, but
          // I think it's more confusing. Anyway, works better
          // for iteration return value.
          pageData = await skipSomePagesIfNeeded(vars, funcs, page, pageData, paginated);
          while (pageData.skip) {
            pageData = await skipSomePagesIfNeeded(vars, funcs, page, pageData, paginated)
          }
        }

        console.log(5);
        // Once we're at the right page, get the PDFs
        await doWithDockets(vars, funcs, page, nameIndex, currentPage, doDownload);

        console.log(9);
        doneWithAllPages = true;  // might undo this in just a bit

        // May not be done if paginated
        if (paginated) {

          doneWithAllPages = await arePagesDone(vars, funcs, page);

          if (doneWithAllPages) {
            console.log(13);
            // If there are still more pages to go, add another page number
            // and store it (we're going on to the next page)
            runData.position.page += 1;
            // Don't store other custom command line arguments, though
            assignmentData.position.page += 1;
            // fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));
            updateAssignment(assignmentData);  // writes to a file

          } else {
            console.log(14);
            // Nothing fancy, just click the 'next' button
            let nextButton = paginationSelector + ' a:nth-last-child(2)';
            await page.click(nextButton);
          }

        }  // ends if paginated

      }  // ends if not done with all pages

    }  // ends while this page not done

    console.log(18)
    nextIndex(vars);
  }  // ends while name index not done

  // Record that this data was finished
  assignmentData.completed = true;
  // fs.writeFileSync(assignmentPath, JSON.stringify(assignmentData, null, 2));
  updateAssignment(assignmentData);  // writes to a file

  console.log(19);
  console.log('previous name:', name);
  return;
};  // Ends iterNames()





// For now it mutates both runData and assignmentData
let nextIndex = function (vars, funcs, page) {

  // Run data
  const runData = vars.runData;
  // nameIndex is global now

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
      {timeout: 5000}
  ).then(function(arg){
    if (arg) { paginated = true; }
  }).catch(function(){
    console.log('One-pager');
  });

  return paginated;
}; // Ends async checkForPagination()




module.exports.iterNames = iterNames;
module.exports.nextIndex = nextIndex;
