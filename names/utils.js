function shuffle(array) {
  array = array.slice(); // Shallow clone array
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports.shuffle = shuffle;

function removeRanges(array, ranges) {
  array = array.slice(); // Shallow clone array

  ranges.sort(
    (a, b) => {
      const startDiff = a.start - b.start;

      if (startDiff === 0) {
        return a.end - b.end;
      }

      return startDiff;
    }
  );

  // it's possible that ranges could overlap; make sure to merge them into one range
  // (e.g. { start: 1, end: 5 } + { start: 2, end: 8 } => { start: 1, end: 8 })
  const mergedRanges = [];
  let lastEnd = -Infinity;

  for (const {start, end} of ranges) {
    if (start <= lastEnd) {
      lastEnd = Math.max(end, lastEnd);
      mergedRanges[mergedRanges.length - 1][1] = lastEnd;
    }
    else {
      mergedRanges.push([start, end]);
      lastEnd = end;
    }
  }

  // Sort the ranges by end index
  mergedRanges.sort(
    ([, aEnd], [, bEnd]) => bEnd - aEnd
  );

  for (const [start, end] of mergedRanges) {
    array.splice(start, end - start + 1); // Make sure it is inclusive of the end of the range
  }

  return array;
}

module.exports.removeRanges = removeRanges;
