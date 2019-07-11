// checkIDs.js

// // From `vars`
// url;
// doPlaySound;
// assignmentPath;
// toDoWithDocketRows
// paginationSelector
// resultsSelector;
// noResultsSelector;
// noResultsText;
// type;
// linksSelector;
// docketIDSelector;
// requiredPrefix;  // regex for id in docket id
// pageNumSelector
// tableSelector;
// pageNumSelector;
// pageNumSelector;
// paginationSelector;
// nameIndex;  // global
// names;
// throttle;
// url;  // Remove after testing
// searchTypeSelector;
// searchTypeVal;
// lastNameSelector;
// firstNameSelector;  // Remove after testing
// docketTypeSelector;  // Remove after testing
// docketTypeVal;  // Remove after testing
// startDateSelector;  // Remove after testing
// endDateSelector;  // Remove after testing
// searchSelector;
// nextSelector;
// lastNameSelector;
// firstNameSelector;
// docketTypeSelector;
// docketTypeVal;
// startDateSelector;
// endDateSelector;
// searchSelector;

// // runData
// runData.assignmentID
// runData.type;
// runData.startDate;
// runData.endDate;
// runData.throttle;
// runData.usedDocketsPath;
// runData.dataDirectory;
// runData;
// runData.dates;
// assignmentData;  // For now this gets mutated :/

// // funcs
// funcs.updateTimesRepeated;
// funcs.updateAssignment;
// funcs.toDoWithDocketRows;
// funcs.updateAssignment;

// to add to world view
// cpRowSelector  // (rowsSelector)
// filingDateSelector

// Added later, bad abstraction
// nameIndex;
// currentPage;
// datesText;


const fs = require('fs');
const puppeteer = require('puppeteer');
const colors = require('colors');

// In-house
const getRunData = require('./collect/getRunData.js').getRunData;
const getSiteVars = require('./collect/siteVars.js').getSiteVars;
const collect = require('./collect/collect.js').collect;


// From version 0.46.2. Please catch up
let versionNumber = '\nv0.1.0\n';


// get the assignment stuff
const assignmentID = process.argv[2];
const assignmentPath = './assignments/pattern/' + assignmentID + '.json'
const assignmentData = require(assignmentPath);

// Assignment settings overrides
const customSettings = process.argv[3];

// Make data for this run, combining assignment args and command line args
let runData = getRunData(assignmentID, assignmentPath, assignmentData, customSettings);

// // Assigning new stuff that makes sense to be in runData later on
// // Not needed in checking IDs
// const dataDirectory = runData.dataDirectory + assignmentID + '/';
// runData.usedDocketsPath = dataDirectory + runData.type + runData.usedDocketsFileName;

// I honestly have no brainpower right now for figuring out where paths should come from

// Assigning new stuff that makes sense to be in runData later on

console.log('runData:\n', runData);

// Too long to log
runData.names = require(runData.namesPath);


// Get cp vs mdj vars... yeah let's make those...
let siteVars = getSiteVars(runData.type);

let vars = {
  ...siteVars,
  runData: runData,
  assignmentID: assignmentID,
  assignmentPath: assignmentPath,
  assignmentData: assignmentData,
};

// Get the previously found docket ids list
// Nope, deal with that comparison later

// Go get 'em!
async function run () {
  await collect(vars, null, null);
}

run();
