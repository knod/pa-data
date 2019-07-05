// doWithDocketsFuncs.js

// fs?
const puppeteer = require('puppeteer');
const request = require("request-promise-native");


// Global
// Keep track of PDFs per hour. Limit is about 830.
let numPDFs = 0;
let timeStartedRunning = Date.now();



// Do something with those docket table items
async function doWithDockets (vars, funcs, page, nameIndex, currentPage) {

  const start = runData.startDate;
  const end = runData.endDate;
  const = usedDocketsPath = vars.runData.usedDocketsPath;
  const = throttle = vars.runData.throttle;

  // Selectors
  const linksSelector = vars.linksSelector;
  const docketIDSelector = vars.docketIDSelector;

  // Functions
  const toDoWithDocketIDs = funcs.toDoWithDocketIDs;



  // For later
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

  await page.waitForSelector(docketIDSelector);

  const docketIDTexts = await page.evaluate(
    (docketIDSelector) => {
      let ids = Array.from(
        document.querySelectorAll(docketIDSelector),
        element => element.innerText
      )
      return ids;
    },
    docketIDSelector
  );

  console.log(7);

  await toDoWithDocketIDs(vars, page, docketIDTexts, datesText);

};  // Ends async doWithDockets()



async function doDownload (vars, page, docketIDTexts, datesText) {

  const linksSelector = vars.linksSelector;

  // go down rows getting links and ids
  await page.waitForSelector(linksSelector);

  const linksText = await page.evaluate(
    (linksSelector) => {
      let links = Array.from(
        document.querySelectorAll(linksSelector),
        element => element.href
      )
      return links;
    },
    linksSelector  // argument
  );

  
  // (Because the linksText list is twice as long)
  let adder = 0;

  console.log(8);
  // download both pdfs
  for (let index = 0; index < docketIDTexts.length; index++) {

    // See if docket was already gotten?

    let id = docketIDTexts[index]
    // We just want some kinds of data, or so they tell us
    if (requiredPrefix.test(id)) {
      let text = Date.now() + '_' + id + '_namei_' + nameIndex + '_page_' + currentPage;
      let datedText = text + datesText;

      // save docket id for later reference
      fs.appendFileSync(usedDocketsPath, datedText + '\n', function (anError) {
        if (anError) console.log(anError);
      });
      console.log('docket id written:', text);

      // Download pdfs
      await page.waitFor(throttle * 10);
      await downloadPDF(vars, linksText[index + adder], text + '-docket.pdf');
      // Because the linksText list is twice as long
      console.log('docket #' + index, 'saved');
      numPDFs++;

      adder++

      await page.waitFor(throttle * 10);
      await downloadPDF(vars, linksText[index + adder], text + '-summary.pdf');
      console.log('summary #' + index, 'saved');
      numPDFs++;

      console.log('# pdfs downloaded:', numPDFs, ', time elapsed:', (Date.now() - timeStartedRunning)/1000, 'seconds');
    }
  }  // ends for all dockets

};  // Ends async doDownload()



async function doIDCollection (vars, page, docketIDTexts, datesText) {
  // TODO

};  // Ends async doIDCollection()



async function downloadPDF (vars, pdfURL, outputFilename) {

  const dataDirectory = vars.runData.dataDirectory;

  // console.log(pdfURL);
  let pdfBuffer = await request.get({
    uri: pdfURL, encoding: null,
    headers: {'User-Agent': 'cfb-data-analysis'}
  });
  let path = dataDirectory + outputFilename;
  fs.writeFileSync(path, pdfBuffer, function (anError) { if (anError) {console.log(anError)} });
};  // Ends async downloadPDF()



module.exports.doWithDockets = doWithDockets;
module.exports.doDownload = doDownload;
module.exports.doIDCollection = doIDCollection;
