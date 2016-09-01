
// DEPENDENCIES

// fs is a part of the node api (ie not downloaded)
const fs = require('fs');

// CONSTANTS

const DICT_PATH = './dict/bears.dictionary';

// FUNCTIONS

function getBears(bearsPath, callback) {
  fs.readFile(bearsPath, function(err, loadedBears) {
    if (err) return callback(err);

    fs.readFile(DICT_PATH, function(err, loadedDict) {
      if(err) return callback(err);

      getValidBears(loadedBears, loadedDict);
    });
  });

  function getValidBears(bearBuffer, dictBuffer) {
    const bears = getLineArrayFromFileBuffer(bearBuffer);
    const dict = getLineArrayFromFileBuffer(dictBuffer);
    const validBears = filterArrayByArray(bears, dict);

    console.log('INITIAL BEAR LIST:', bears, '\n');

    callback(null, validBears);
  }
}

// HELPERS

function getLineArrayFromFileBuffer(fileBuffer) {
  return fileBuffer.toString().trim().split('\n');
}

function filterArrayByArray(arrayA, arrayB) {
  return arrayA.filter(function(element) {
    return arrayB.indexOf(element) !== -1;
  });
}

// MAIN

getBears('bears-input.txt', function(err, bears) {
  console.log('VALID BEAR LIST:', bears, '\n');
});
