// collect.js

const fs = require('fs');
const puppeteer = require('puppeteer');

// In-house
const iterNames = require('./iter-names.js').iterNames;
const alert = require('../alert.js');
const getNowHHMM = require('./getNowHHMM.js').getNowHHMM;


// Globals
let timesRepeated = 0;


// Start a new browser and trigger the process
// for collecting the data
async function collect (vars, previousBrowser, previousPage) {

  // Figure out how to sometimes not close the browser?
  // Maybe just never close the browser?
  if (previousBrowser) {
    await previousBrowser.close();
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Vars
  const url = vars.url;
  const doPlaySound = vars.doPlaySound;


  const updateAssignment = function (assignmentData) {
    let path = vars.assignmentPath;
    fs.writeFileSync(path, JSON.stringify(assignmentData, null, 2));
  };
  
  const funcs = {
    toDoWithDocketIDs: vars.toDoWithDocketIDs,
    updateAssignment: updateAssignment,
    updateTimesRepeated: updateTimesRepeated,
  };


  // // To try:

  // let browser = previousBrowser;
  // let page = previousPage;

  // // To try:
  // if (!previousBrowser) {
  //   console.log('Creating browser');
  //   browser = await puppeteer.launch({ headless: true });
  //   console.log('Opening page');
  //   page = await browser.newPage();

  //   // // to try?
  //   // let goto = await page.goto(url);
  //   // console.log('Status:', goto.status());
  //   // let status = goto.status();
  //   // if (status === 429 || status === 500) {
  //   //   throw Error('Error code ' + status);
  //   // }
  // }


  try {

    // After a 429, do we need to `.goTo()` again?
    // probably at least that if not a new page...
    // If we reload, will we get the same results
    // on the same page, like with a normal browser?
    let goto = await page.goto(url);
    console.log('Status:', goto.status());
    let status = goto.status();
    if (status === 429 || status === 500) {
      throw Error({
        message: 'Error code ' + status,
        statusCode: status
      });
    }

    await iterNames(vars, funcs, page)
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

    console.log('iterNames catch clause @'.yellow, getNowHHMM().yellow);
    console.log(anError);
    if (doPlaySound !== 'no') {
      // Temporary error
      alert.error();
    }

    await waitThenRepeat(vars, browser, page, anError.statusCode);

  }  // ends catch iterNames errors

};  // Ends async collect()



async function waitThenRepeat (vars, browser, page, errStatusCode) {
  timesRepeated++;
  timesRepeated % 7;  // Will turn into 0
  console.log('timesRepeated:', timesRepeated);

  // // How to keep using the previous browser?
  // let keepGoing = function () {}

  let repeat = function () {
    collect(vars, browser, page);
  }

  console.log(errStatusCode, typeof errStatusCode);
  if (errStatusCode === 429) {
    // Website really means business with 429
    // Don't know how long it needs. The 429 page didn't seem to show.
    // This is a guess.
    // Note: Still got 429 while on 500ms throttle (5 secs for pdfs)
    // console.log('waiting 15 minutes @', getNowHHMM());
    //   setTimeout(startNewBrowser, 900000);
    timesRepeated = 3;

  } else {
    if (timesRepeated <= 2) {
      console.log('waiting 1 min @', getNowHHMM());
      setTimeout(startNewBrowser, 1 * 60 * 1000);

    } else if (timesRepeated <= 5) {
      console.log('waiting an hour @', getNowHHMM());
      setTimeout(startNewBrowser, 60 * 60 * 1000);

    } else if (timesRepeated <= 6){
      // wait 15 min
      console.log('3 hours should have passed. Waiting 5 min @', getNowHHMM());
      setTimeout(startNewBrowser, 5 * 60 * 1000);

    } else {
      // Final error
      console.log("giving up");
      alert.gaveUp();
      await browser.close();
      process.exit(1);
    }
  }
};  // Ends async waitThenRepeat()


const updateTimesRepeated = function (val) {
  timesRepeated = val;
};


module.exports.collect = collect;
module.exports.waitThenRepeat = waitThenRepeat;
