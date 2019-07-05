// setupSearch.js

const puppeteer = require('puppeteer');


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