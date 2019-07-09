const assert = require('assert');

const { shuffle, removeRanges } = require('./utils');

function testShuffle() {
  const originalArray = [
    1, 2, 3, 4, 4, 1, 5, 3, 4, 1, 100,
  ];

  const shuffledArray = shuffle(originalArray);

  assert(
    originalArray.length === shuffledArray.length,
    `Shuffled array length is ${shuffledArray.length}; original array length was ${originalArray.length}`
  );

  assert(
    JSON.stringify(originalArray) !== JSON.stringify(shuffledArray),
    'Expected shuffled array to be different from the original array'
  );

  const num1s = shuffledArray.filter((val) => val === 1).length;
  assert(
    num1s === 3,
    `Expected shuffled array to have three 1s; instead it had ${num1s}`
  );
  
  const num2s = shuffledArray.filter((val) => val === 2).length;
  assert(
    num2s === 1,
    `Expected shuffled array to have one 2; instead it had ${num2s}`
  );

  const num3s = shuffledArray.filter((val) => val === 3).length;
  assert(
    num3s === 2,
    `Expected shuffled array to have two 3s; instead it had ${num3s}`
  );

  const num4s = shuffledArray.filter((val) => val === 4).length;
  assert(
    num4s === 3,
    `Expected shuffled array to have three 4s; instead it had ${num4s}`
  );

  const num5s = shuffledArray.filter((val) => val === 5).length;
  assert(
    num5s === 1,
    `Expected shuffled array to have one 5; instead it had ${num5s}`
  );

  const num100s = shuffledArray.filter((val) => val === 100).length;
  assert(
    num100s === 1,
    `Expected shuffled array to have one 100; instead it had ${num100s}`
  );

  console.log("shuffle passed tests");
}

function testRemoveRanges() {
  const originalArray = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  // Some disjoint, some overlapping ranges
  let withoutRanges = removeRanges(
    originalArray,
    [
      { start: 3, end: 6},
      { start: 13, end: 16},
      { start: 15, end: 19},
    ]
  );
  
  assert(
    JSON.stringify(withoutRanges) === JSON.stringify(
      [0, 1, 2, 7, 8, 9, 10, 11, 12, 20]
    ),
    `Did not remove the expected ranges; result was ${JSON.stringify(withoutRanges)}`
  );

  // Overlapping ranges
  withoutRanges = removeRanges(
    originalArray,
    [
      { start: 3, end: 18 },
      { start: 13, end: 16 },
      { start: 11, end: 15 },
    ]
  );

  assert(
    JSON.stringify(withoutRanges) === JSON.stringify(
      [0, 1, 2, 19, 20]
    ),
    `Did not remove the expected ranges; result was ${JSON.stringify(withoutRanges)}`
  );

  console.log("removeRanges passed tests");
}

testShuffle();

testRemoveRanges();
