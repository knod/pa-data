server-limits.txt

This is what we know about what the PA site doesn't want:

**PDF downloads:** No more than ~ 830/hr. See any logs with PDF downloads and 429 errors.
**Page requests(?):** 970 in 11min. Not sure what these were. We weren't clicking on any active link, just one for the same page over and over whihc shouldn't have done anything (CSS index 4), but it didn't like it anyway. At all. See '07-04-05-12pm-mdj-hung--.txt' in owner local folder. Summary:

**Finished page 1, then cylcled because of bug:**

getting pdfs

Goal page:  2

start looking for result: Thu Jul 04 2019 01:55:08 GMT+0000 (UTC)

race value: span#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_lblPreviewInstructions.previewInstructions

results found? true

no results found? false

Time elapsed to find results: 7 (seconds: 0.007)

3

4

paginated: true

current actual page indicated in nav: 1

nav: First Previous 1 2 3 4 5  Next Last

Index of button to goal: 4

navData: 4

selector: #ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer a:nth-child(4)

**repeating**

getting pdfs

Goal page:  2

start looking for result: Thu Jul 04 2019 01:55:09 GMT+0000 (UTC)

race value: span#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_lblPreviewInstructions.previewInstructions

results found? true

no results found? false

Time elapsed to find results: 5 (seconds: 0.005)

3

4

paginated: true

current actual page indicated in nav: 1

nav: First Previous 1 2 3 4 5  Next Last

Index of button to goal: 4

navData: 4

selector: #ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer a:nth-child(4)

**etc.**

**Nothing active is being clicked on. What is Puppeteer doing?**

**When condensed to just this one log line repeated:**

line 1: start looking for result: Thu Jul 04 2019 01:52:50 GMT+0000 (UTC)

line 971: start looking for result: Thu Jul 04 2019 02:04:24 GMT+0000 (UTC)

**Calcs:**

01:52:50 to 2 = 0:07:10

02:04:24 = 0:04:24

total = 11:34
