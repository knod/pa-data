// arePagesDone.js

const puppeteer = require('puppeteer');
const colors = require('colors');



// Do something with those docket table items
async function arePagesDone (vars, funcs, page) {
  // PAGINATION
  // √ don't download pdfs till we know we're on the right page.
  // √ don't increment page till we've finished downloading pdfs.
  // only increment page if we're not done.

  const paginationSelector = vars.paginationSelector

  // if paginated, we're not sure we're done
  done = false;

  console.log(10);
  // Look for what nav elements are disabled
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

  console.log('disabledText:'.bgYellow, disabledText)
  let nextIsDisabled = disabledText.indexOf('Next') > -1;
  if (nextIsDisabled) {
    // Means we're on the last page
    console.log('On the last page');
    done = true;

  } else {
    // done is still false, but let's put it here for clarity
    console.log('Still more pages to go!')
    done = false;
  }  // ends if we're at the last page

  console.log(15);
  return done;

};  // Ends async arePagesDone()


module.exports.arePagesDone = arePagesDone;
