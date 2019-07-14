// doWithDocketsFuncs.js

// // From `vars`
// to add to world view
// cpRowSelector  // (rowsSelector)
// filingDateSelector

// already in the picture
// runData.startDate;
// runData.endDate;
// runData.throttle;
// type;
// linksSelector;
// docketIDSelector;
// nameIndex;
// currentPage;
// datesText;
// requiredPrefix;  // regex for id in docket id
// runData.usedDocketsPath;
// runData.dataDirectory;
// assignmentID;

// Old
// toDoWithDocketIDs

// fs?
const fs = require('fs');
const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const request = require("request-promise-native");


// Global
// Keep track of PDFs per hour. Limit is about 830.
let numPDFs = 0;
let timeStartedRunning = Date.now();

let cpRowSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel > table > tbody > tr.gridViewRow';
'#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_gvDocket > table > tbody > tr.gridViewRow'


// Do something with those docket table items
async function doWithDocketRows (vars, funcs, page, nameIndex, currentPage, doWithRow) {
  // maybe just put some of those into vars

  const start = vars.runData.startDate;
  const end = vars.runData.endDate;
  const throttle = vars.runData.throttle;

  // Other stuff
  const type = vars.type;

  // Selectors
  const linksSelector = vars.linksSelector;
  const docketIDSelector = vars.docketIDSelector;
  const rowSelector = vars.rowSelector;

  // // Functions
  // const toDoWithDocketIDs = funcs.toDoWithDocketIDs;
  // const getFromRow = funcs.getFromRow;

  /// *** CHANGE THIS INTO META DATA (PDFs. Psh.)
  const dateTextParts = [
    start.substring(0, 2),  // startMonth
    start.substring(start.length-2, start.length),  // startYear
    end.substring(0, 2),  // endMonth
    end.substring(end.length-2, end.length),  // endYear
  ];
  const datesText = '_' + dateTextParts.join('_');

  // Do stuff

  console.log(6);

  // await page.waitForSelector(docketIDSelector);

  // const docketIDTexts = await page.evaluate(
  //   (docketIDSelector) => {
  //     let ids = Array.from(
  //       document.querySelectorAll(docketIDSelector),
  //       element => element.innerText
  //     )
  //     return ids;
  //   },
  //   docketIDSelector
  // );

  // smells funny...
  let moreVars = Object.assign({}, vars, {
    nameIndex: nameIndex,
    currentPage: currentPage,
    datesText: datesText,
  })

  // // Maybe just pass in all the rows?
  // await toDoWithDocketIDs(vars, page, docketIDTexts, datesText);
  await page.waitForSelector(rowSelector);

  console.log(7);

  await page.evaluate(
    async function (rowSelector, vars, doWithRow) {

      let rowElems = document.querySelectorAll(rowSelector);
      let elemsList = rowElems.values();  // Is this a node list? or is this a speciall puppeteer thing?
      console.log('rowElems.values().length:', elemsList.length);

      for (let elem of elemsList) { 
        console.log(elem.id);
        await doWithRow(elem, vars);
      }

      // let allRowsData = Array.from(
      //   document.querySelectorAll(rowSelector),
      //   doWithRow,
      //   vars
      // );
    },
    rowSelector, moreVars, doWithRow
  );

  console.log(7);

  // // Get what you want from rows?
  // await getFromRows(vars, page, rowSelector);
  // // Pass in all the rows?
  // await toDoWithDocketIDs(vars, page, rowData, nameIndex, currentPage, datesText);

};  // Ends async doWithDocketRows()


// Could just download in here?
async function doDownload (rowElem, vars) {

  const linksSelector = vars.linksSelector;
  const idChildNum = vars.idChildNum;
  const nameIndex = vars.nameIndex;
  const currentPage = vars.currentPage;
  const datesText = vars.datesText;
  const usedDocketsPath = vars.runData.usedDocketsPath;
  const requiredPrefix = vars.requiredPrefix;

  const docketIDSelector = 'td:nth-child(' + idChildNum + ')';

  // console.log('In doDownload vars prop:', vars.linksSelector);

  let id = rowElem.querySelector(docketIDSelector).innerText;
  let links = Array.from(
    rowElem.querySelectorAll(linksSelector),
    element => element.href
  );

  let rowData = {
    id: id,
    docketLink: links[0],
    summaryLink: links[1],
  };

  console.log('rowData:', rowData);

  // See if docket was already gotten?

  // We just want some kinds of data, or so they tell us
  if (requiredPrefix.test(id)) {
    let text = Date.now() + '_' + id + '_namei_' + nameIndex + '_page_' + currentPage;
    let datedText = text + datesText;

    // save docket id for later reference
    // Does the path need to be relative?
    // path.join(__dirname, '../templates') (https://stackoverflow.com/a/13052018)
    // var appRootDir = process.cwd() - windows? (https://stackoverflow.com/a/13060087)
    // or put this in the root
    fs.appendFileSync(usedDocketsPath, datedText + '\n', function (anError) {
      if (anError) console.log(anError);
    });
    console.log('docket id written:', text);

    // Download pdfs
    await page.waitFor(throttle * 10);  // Limit site wants to avoid 429
    await downloadPDF(vars, rowData.docketLink, text + '-docket.pdf');
    // Because the linksText list is twice as long
    console.log('docket #' + rowIndex, 'saved this run');
    numPDFs++;

    await page.waitFor(throttle * 10);  // Limit site wants to avoid 429
    await downloadPDF(vars, rowData.summaryLink, text + '-summary.pdf');
    console.log('summary #' + rowIndex, 'saved this run');
    numPDFs++;

    console.log('# pdfs downloaded:', numPDFs, ', time elapsed this run:', (Date.now() - timeStartedRunning)/1000, 'seconds');
  }

  return rowData;

};  // Ends async doDownload()


// async function doDownload (vars, page, rowData, nameIndex, currentPage, datesText) {

//   // const linksSelector = vars.linksSelector;
//   // const docketIDSelector = vars.docketIDSelector;
//   const requiredPrefix = vars.requiredPrefix;
//   const usedDocketsPath = vars.runData.usedDocketsPath;
//   const throttle = vars.runData.throttle;

//   // // go down rows getting links and ids
//   // await page.waitForSelector(linksSelector);

//   // // Get needed data for each row
//   // let rowsData = [];
//   // for (let rowElem of rowElems) {
//   //   let oneRow = await page.evaluate(
//   //     (linksSelector, docketIDSelector, rowElem) => {

//   //       let id = rowElem.querySelector(docketIDSelector);

//   //       let links = Array.from(
//   //         rowElem.querySelectorAll(linksSelector),
//   //         element => element.href
//   //       )

//   //       let rowData = {
//   //         id: id,
//   //         docketLink: links[0],
//   //         summaryLink: links[1],
//   //       };

//   //       return rowData;
//   //     },
//   //     linksSelector, docketIDSelector, rowElem  // argument
//   //   );

//   //   rowsData.push(oneRow);
//   // }

//   for (let rowIndex = 0; rowIndex < rowData.length; rowIndex++) {

//     let docket = rowData[rowIndex];
//     let id = docket.id;

//     // See if docket was already gotten?

//     // We just want some kinds of data, or so they tell us
//     if (requiredPrefix.test(id)) {
//       let text = Date.now() + '_' + id + '_namei_' + nameIndex + '_page_' + currentPage;
//       let datedText = text + datesText;

//       // save docket id for later reference
//       // Does the path need to be relative?
//       // path.join(__dirname, '../templates') (https://stackoverflow.com/a/13052018)
//       // var appRootDir = process.cwd() - windows? (https://stackoverflow.com/a/13060087)
//       // or put this in the root
//       fs.appendFileSync(usedDocketsPath, datedText + '\n', function (anError) {
//         if (anError) console.log(anError);
//       });
//       console.log('docket id written:', text);

//       // Download pdfs
//       await page.waitFor(throttle * 10);  // Limit site wants to avoid 429
//       await downloadPDF(vars, docket.docketLink, text + '-docket.pdf');
//       // Because the linksText list is twice as long
//       console.log('docket #' + rowIndex, 'saved this run');
//       numPDFs++;

//       await page.waitFor(throttle * 10);  // Limit site wants to avoid 429
//       await downloadPDF(vars, docket.summaryLink, text + '-summary.pdf');
//       console.log('summary #' + rowIndex, 'saved this run');
//       numPDFs++;

//       console.log('# pdfs downloaded:', numPDFs, ', time elapsed this run:', (Date.now() - timeStartedRunning)/1000, 'seconds');
//     }

//   }  // ends for all dockets

// };  // Ends async doDownload()



async function downloadPDF (vars, pdfURL, outputFilename) {

  const dataDirectory = vars.runData.dataDirectory;

  // save docket id for later reference
  // Does the path need to be relative?
  // path.join(__dirname, '../templates') (https://stackoverflow.com/a/13052018)
  // var appRootDir = process.cwd() - windows? (https://stackoverflow.com/a/13060087)
  // or put this in the root

  // console.log(pdfURL);
  let pdfBuffer = await request.get({
    uri: pdfURL, encoding: null,
    headers: {'User-Agent': 'cfb-data-analysis'}
  });
  let path = dataDirectory + outputFilename;
  fs.writeFileSync(path, pdfBuffer, function (anError) { if (anError) {console.log(anError)} });
};  // Ends async downloadPDF()




let checkIDsPath = './IDsFound/';
// IDsFound/cp/assignmentName.json
// Create timestamp for assignment?

// For now just create all the docket ids in each file
// for each assignment. Later check them against each other
async function makeIDCollection (rowElem, vars) {
  console.log('makeIDCollection');

  // vars
  const type = vars.runData.type;
  const assignmentID = vars.assignmentID;
  const requiredPrefix = vars.requiredPrefix;
  const idChildNum = vars.idChildNum;
  const filingDateChildNum = vars.filingDateChildNum;


  // All these paths should probably be worked out... elsewhere?

  let thisDir = checkIDsPath + type + '/';
  mkdirp.sync(dataDirectory, function (err) {
      if (err) { console.error(err); }
  });
  let thisPath = thisDir + assignmentID + '.json';

  // where do we get the filename for all the dockets?
  let pastDockets = require(thisPath);  // JSON - array? Object?
  pastDockets = pastDockets || {};

  // let cpFilingDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_caseList_ctl00_ctl00_filingDateLabel';
  const docketIDSelector = 'td:nth-child(' + idChildNum + ')';
  const filingDateSelector = 'td:nth-child(' + filingDateChildNum + ')';

  let id = rowElem.querySelector(docketIDSelector).innerText;
  let filingDate = rowElem.querySelector(filingDateSelector).innerText;

  let rowData = {
    id: id,
    filingDate: filingDate,
    timestamp: Date.now(),
  };

  console.log('makeIDCollection rowData:', rowData);

  // See if docket was already gotten?

  // We just want some kinds of data, or so they tell us
  if (requiredPrefix.test(id)) {
    // Add data to a file
    pastDockets[id] = rowData;
    let json = JSON.stringify(pastDockets, null, 2);
    fs.writeFileSync(thisPath, json);
    // Should we collect all of this data and then write it all to
    // a file outside of the loop?
  }

  // return rowData;
};  // Ends async makeIDCollection()



module.exports.doWithDocketRows = doWithDocketRows;
module.exports.doDownload = doDownload;
module.exports.makeIDCollection = makeIDCollection;
// module.exports.checkAgainstInitialIDCollection = checkAgainstInitialIDCollection;
