// mdj-names.js
const fs = require('fs');
const puppeteer = require('puppeteer');
const request = require("request-promise-native");

searchTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_ddlSearchType',// "ParticipantName"
lastNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtLastName',
firstNameSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtFirstName',
docketTypeSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_ddlDocketType', // "CR"
startDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_beginDateChildControl_DateTextBox',
endDateSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_endDateChildControl_DateTextBox',
searchSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_btnSearch',
resultsSelctor = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel',
paginationSelector = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel > table .PageNavigationContainer a'
'https://ujsportal.pacourts.us/DocketSheets/MDJ.aspx'

searchType = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_ddlSearchType',
// "ParticipantName"
lastName = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtLastName',
firstName = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtFirstName',
docketType = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_ddlDocketType',
// "CR"
startDate = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_beginDateChildControl_DateTextBox',
endDate = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_endDateChildControl_DateTextBox',
searchButton = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_btnSearch',
searchResults = '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel',
'.gridViewRow'
'.DynamicMenuItem'
'#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel > table .PageNavigationContainer a'