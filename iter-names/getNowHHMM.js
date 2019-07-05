// getNowHHMM.js

// Just keep track of the darn time
let getNowHHMM = function () {
  let date = new Date();  // now
  let time = date.toTimeString();
  let hhmm = time.substring(0, 5); // military time
  return hhmm;
}


module.exports.getNowHHMM = getNowHHMM;
