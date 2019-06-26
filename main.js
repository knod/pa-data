// main.js
// const rp = require('request-promise');
// const $ = require('cheerio');
// const url = 'https://ujsportal.pacourts.us/DocketSheets/CP.aspx';

// rp(url)
//   .then(function(html){
//     //success!
//     console.log($('div', html).length);
//     // console.log($('big > a', html));
//   })
//   .catch(function(err){
//     //handle error
// });

const puppeteer = require('puppeteer');

// async function getPic() {
//   // const browser = await puppeteer.launch({ headless: true });
//   // const page = await browser.newPage();
//   // await page.setViewport({ width: 1920, height: 926 });
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.setViewport({width: 1920, height: 926});
//   await page.goto('https://google.com');
//   await page.screenshot({path: 'google.png'});

//   await browser.close();
// }

// getPic();

let scrape = async () => {

  // Docket number test: CP-51-CR-0503941-1997

  // Actual Scraping goes Here...
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 926});

  await page.goto('https://ujsportal.pacourts.us/DocketSheets/CP.aspx');
  await page.waitForSelector("#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mddlCourt");
  // page.click("#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mddlCourt")
  

  page.select(
    "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mddlCourt",
    "CP"
  );
  await page.$eval(
    '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mtxtCounty',
    el => el.value = "51"
  );
  // page.type(
  //   "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mtxtCounty",
  //   "51",
  //   {delay: 20}
  // )
  page.select(
    "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mddlDocketType",
    "CR"
  );
  // page.type(
  //   "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mtxtSequenceNumber",
  //   "0503941"
  // );
  await page.$eval(
    '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mtxtSequenceNumber',
    el => el.value = "0503941"
  );
  // page.type(
  //   "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mtxtYear",
  //   "1997"
  // )
  await page.$eval(
    '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_docketNumberControl_mtxtYear',
    el => el.value = "1997"
  );
  page.click("#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_searchCommandControl")

  await page.waitForSelector("#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_searchResultsGridControl_resultsPanel");

  // const result = await page.evaluate(() => {
  //   let thing = document
  //     .querySelectorAll('#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_searchResultsGridControl_caseList_ctl00_ctl00_printControl_printMenun0Items a')
  //     .innerText;

  //   return thing;
  // });

  const links = await page.evaluate(
    () => {
      return Array.from(
        document.querySelectorAll('#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_docketNumberCriteriaControl_searchResultsGridControl_caseList_ctl00_ctl00_printControl_printMenun0Items a'),
          element => element.href
      )
    }
  );



  await page.screenshot({path: 'docket.png'});


  browser.close();
  return links;
  // Return a value
};


scrape().then((value) => {
    console.log(value); // Success!
}).catch((err) => {
  console.log(err);
});
