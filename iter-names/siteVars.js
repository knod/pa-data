// siteVars.js

// CP site stuff
const cp = {
  url: 'https://ujsportal.pacourts.us/DocketSheets/CP.aspx',
  searchTypeSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_searchTypeListControl",
  lastNameSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_lastNameControl",
  firstNameSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_firstNameControl",
  docketTypeSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_docketTypeListControl",
  docketTypeVal: "Criminal",
  startDateSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_beginDateChildControl_DateTextBox",
  endDateSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_dateFiledControl_endDateChildControl_DateTextBox",
  searchSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchCommandControl",
  searchTypeVal: "Aopc.Cp.Views.DocketSheets.IParticipantSearchView, CPCMSApplication, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null",
  resultsSelector: "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel",
  noResultsSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_noResultsPanel',
  // noResultsText: '', // Not needed for cp
  paginationSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_casePager',
  tableSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel',
  rowSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_searchResultsGridControl_resultsPanel > table > tbody > tr.gridViewRow',
  linksSelector: ' a.DynamicMenuItem',
  docketIDSelector: '.gridViewRow td:nth-child(2)',  // Still needed?
  idChildNum: 2,
  filingDateChildNum: 4,
  requiredPrefix: /CP/,
};  // ends cp

cp.pageNumSelector = cp.paginationSelector + ' a[style="text-decoration:none;"]',
cp.nextSelector = cp.paginationSelector + ' a:nth-last-child(2)',


// MDJ site stuff
const mdj = {
  url: 'https://ujsportal.pacourts.us/DocketSheets/MDJ.aspx',
  searchTypeSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_ddlSearchType',
  lastNameSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtLastName',
  firstNameSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_txtFirstName',
  docketTypeSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_ddlDocketType',
  docketTypeVal: "CR",
  startDateSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_beginDateChildControl_DateTextBox',
  endDateSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphSearchControls_udsParticipantName_DateFiledDateRangePicker_endDateChildControl_DateTextBox',
  searchSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_btnSearch',
  searchTypeVal: "ParticipantName",
  resultsSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_lblPreviewInstructions',
  noResultsSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_gvDocket',
  noResultsText: 'No Records Found',
  paginationSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
  tableSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_SearchResultsPanel .PageNavigationContainer',
  rowSelector: '#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphResults_gvDocket > table > tbody > tr.gridViewRow',
  linksSelector: ' a.DynamicMenuItem',
  docketIDSelector: '.gridViewRow' + ' td:nth-child(2)',  // Still needed?
  idChildNum: 2,
  filingDateChildNum: 5,
  requiredPrefix: /MJ/,
};  // ends mdj

mdj.nextSelector = mdj.paginationSelector + ' a:nth-last-child(2)',
mdj.pageNumSelector = mdj.paginationSelector + ' a[style="text-decoration:none;"]',


const getSiteVars = function (type) {
  if (type === 'cp') {
    return cp;
  } else if (type === 'mdj') {
    return mdj;
  } else {
    throw Error('This is not a valid collection type. It can be "cp" or "mdj".')
  }
};


module.exports.cp = cp;
module.exports.mdj = mdj;
module.exports.getSiteVars = getSiteVars;
