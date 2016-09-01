
// DEPENDENCIES

// fs is a part of the node api (ie not downloaded)
const fs = require('fs');
const request = require('request');

// CONSTANTS

const DICT_PATH = './dict/bears.dictionary';
const WIKI_INFO_LENGTH = 200;

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

function getBearDescription(bears, callback) {
  let count = bears.length;
  let resultObj = {};

  bears.forEach(function(element) {
    getWikipediaInfo(element, function(err, intro) {

      resultObj[element.toUpperCase()] = intro;
      nextBear();
    });
  })

  function nextBear() {
    count--;
    console.log("Requests remaining:", count);
    if (count < 1) {
      callback(resultObj);
    }
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

/* the tutorial loaded images instead, but I guess he was using a feature of io.js that didn't survive the merge
back into node.js? */
function getWikipediaInfo(searchTerm, callback) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${searchTerm}`;

  request(searchUrl, function(error, response, body) {
    if (error || response.statusCode != 200) {
      callback([response.statusCode, error]);
    }

    const searchResults = JSON.parse(body);
    const trimmedInfo = getTrimmedInfo(searchResults);

    callback(null, trimmedInfo);
  });
}

function getTrimmedInfo(searchResults) {
  const pages = searchResults.query.pages;
  const firstPageKey = Object.keys(pages)[0];
  const summary = pages[firstPageKey].extract;
  const trimmedInfo = summary.slice(0, WIKI_INFO_LENGTH);

  return trimmedInfo;
}

// MAIN

getBears('bears-input.txt', function(err, bears) {
  console.log('VALID BEAR LIST:', bears, '\n');

  getBearDescription(bears, function(result) {
    console.log('\nTHE FINAL RESULT IS: \n\n', result);
  });
});
