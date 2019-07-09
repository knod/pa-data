// collectInitialDocketIDs.js

const names = require('./uniqueCensusNamesSmall.json');


// In new file? No, we need these vars...
// Get assignment ID from command line
const assignmentID = process.argv[2];
if (!assignmentID) {
  throw Error('Please include your assignment ID. For example: node mdj-names3-test.js 24z \'{"alerts":"no"}\' (that last bit means you won\'t hear the sounds)'.yellow);
} else if (assignmentID === '24z') {
  throw Error('I think you used the default assignemt ID (24z). That\'s not a real one.'.yellow);
}

const assignmentPath = './assignments/' + assignmentID + '.json'
const assignmentData = require(assignmentPath);

// Assignment settings overrides
const commandLineArgvs = process.argv[3];

// An object for this run of the code - combining the two objects
let runData = null;
if (commandLineArgvs && typeof JSON.parse(commandLineArgvs) === 'object') {

  let arvObj = JSON.parse(commandLineArgvs);//console.log('argv obj:', arvObj);
  runData = Object.assign({}, assignmentData, arvObj);//console.log('combined objects:', runData);

} else {
  runData = Object.assign({}, assignmentData);
}

// Need to be clear about deep cloning
runData.position = {
  index: runData.position.index,
  page: runData.position.page,
};

if (runData.completed && !runData.redo) {
  throw Error('It looks like this assignment is already done! Get a new one! Google doc?'.red)
}

if (!runData.redo) {
  console.warn('Be aware only new name indexes will be used. Nothing will be redone. That\'s good as long as it\'s what you want. You can change that with the "redo" custom property.'.yellow);
} else {
  console.warn('Previously gotten names will be gotten again! Because of your "redo" custom property.'.red);
}

console.log('runData:\n', runData);


// Using the runData
const type = runData.type;  // cp or mdj

// Paths
const namesFilePath = runData.namesPath;
const dataDirectory = runData.dataDirectory + assignmentID + '/';
const usedDocketsPath = dataDirectory + type + runData.usedDocketsFileName;
// Make directory if needed
mkdirp.sync(dataDirectory, function (err) {
    if (err) { console.error(err); }
});
// Keeping track of what code version number we're at so
// in future we know where to backtrack to.
fs.appendFileSync(usedDocketsPath, versionNumber, function (err) {
  if (err) console.log(err);
});

// Assigned variables
const names = require(namesFilePath);
const namesEndIndex = runData.endIndexRange;

const dates = {
  start: runData.startDate,
  end: runData.endDate,
};

/// *** CHANGE THIS INTO META DATA (PDFs. Psh.)
const dateTextParts = [
  dates.start.substring(0, 2),  // startMonth
  dates.start.substring(dates.start.length-2, dates.start.length),  // startYear
  dates.end.substring(0, 2),  // endMonth
  dates.end.substring(dates.end.length-2, dates.end.length),  // endYear
];
const datesText = '_' + dateTextParts.join('_');

const throttle = runData.wait;
const doPlaySound = runData.alerts;

