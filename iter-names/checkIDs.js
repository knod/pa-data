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
const getRunData = require('./getRunData').getRunData;


// From version 0.46.2. Please catch up
let versionNumber = '\nv0.1.0\n';


let vars = {};

// get the assignment stuff
const assignmentID = argvs[2];
const assignmentPath = './assignments/' + assignmentID + '.json'
const assignmentData = require(assignmentPath);

vars.assignmentID = assignmentID;
vars.assignmentPath = assignmentPath;
vars.assignmentData = assignmentData;

// Make vars

// date range?
// name indexes?
// page number?
// etc...?
// use it to get the site-specific data

// get the names array

// get the previously found docket ids list

// iterate through the names

  // iterate through the pages
    // go to the page
    // search for the name
    // look for results
    // record all docket ids that don't exist anymore in
      // a time-stamp-named array that's a property on an
      // object in a file? Same object every time?
      // play an alert for it?





