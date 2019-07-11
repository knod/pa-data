// getRunData.js

// // runData
// runData.type;
// runData.startDate;
// runData.endDate;
// runData.throttle;
// runData.usedDocketsPath;
// runData.dataDirectory;
// runData;  // Used in this and its child processes from now on


let getRunData = function (assignmentID, assignmentPath, assignmentData, customSettings) {
  // process.argv

  // Get assignment ID from command line
  if (!assignmentID) {
    throw Error('Please include your assignment ID. For example: node mdj-names3-test.js 24z \'{"alerts":"no"}\' (that last bit means you won\'t hear the sounds)'.yellow);
  } else if (assignmentID === '24z') {
    throw Error('I think you used the default assignemt ID (24z). That\'s not a real one.'.yellow);
  }

  // An object for this run of the code - combining the two objects
  let runData = null;
  if (customSettings && typeof JSON.parse(customSettings) === 'object') {

    let arvObj = JSON.parse(customSettings);//console.log('argv obj:', arvObj);
    runData = Object.assign({}, assignmentData, arvObj);//console.log('combined objects:', runData);

  } else {
    runData = Object.assign({}, assignmentData);
  }

  // Need to be clear about deep cloning
  runData.position = {
    index: runData.position.index,
    page: runData.position.page || 1,
  };

  // More warnings for the person running the code
  if (runData.completed && !runData.redo) {
    throw Error('It looks like this assignment is already done! Get a new one! Google doc?'.red)
  }
  if (!runData.redo) {
    console.warn('Be aware only new name indexes will be used. Nothing will be redone. That\'s good as long as it\'s what you want. You can change that with the "redo" custom property.'.yellow);
  } else {
    console.warn('Previously gotten names will be gotten again! Because of your "redo" custom property.'.red);
  }

  return runData;
};  // Ends getRunData()


module.exports.getRunData = getRunData;
