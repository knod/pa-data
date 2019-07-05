// updateAssignmentData.js

// for the future when we don't want to mutate
// assignmentData invisibly...
let updateAssignmentData = function (oldAssignment, newData, filePath) {

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  // Break up new data into things that can be assigned
  // separately without overriding old nested objects
  let ({done, ...safeData} = newData);

  let combinedData = Object.assign({}, oldAssignment, safeData);
  if (newData.done !== undefined) {
    combinedData.done = Object.assign({}, oldAssignment.done, done);
  }

  let newAssignment = Object.assign({}, oldAssignment, combinedData);

  // Then write it to the file
  // This is the only part that'll be handled right now
  // in the main function

  return newAssignment;
};  // Ends updateAssignment()



