
// DEPENDENCIES

// fs is a part of the node api (ie not downloaded)
const fs = require('fs');
const request = require('request');

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

function describeAllBears(bears, callback) {
  let resultObj = {};

  describeBearRecursive();

  function describeBearRecursive() {
    if(!bears.length) {
      callback(resultObj);
    } else {
      const bear = bears.shift();
      getWikiInfo(bear, function(err, bearInfo) {
        resultObj[bear] = bearInfo;

        describeBearRecursive();
      });
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

function getWikiInfo(searchTerm, callback) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${searchTerm}`;

  request(searchUrl, function(error, response, body) {
    if (error || response.statusCode != 200) {
      callback([response.statusCode, error]);
    }

    const searchResults = JSON.parse(body);
    const summary = getSummary(searchResults);

    callback(null, summary);
  });
}

function getSummary(searchResults) {
  const pages = searchResults.query.pages;
  const firstPageKey = Object.keys(pages)[0];
  const summary = pages[firstPageKey].extract;
  const text = getCleanedUpText(summary);
  const trimmedText = getFirstTwoSentences(text);

  return trimmedText;
}

function getCleanedUpText(str) {
  str = removeParentheticals(str);
  str = removeHtml(str);

  return str;
}

function removeParentheticals(str) {
  return str
    // remove empty spaces before open perentheticals (so no holes are left)
    .replace(/\s([\(\[])/g, '$1')
    // remove text (like this) and [like this]
    .replace(/[\(\[].+?[\)\]]/g, '');
}

function removeHtml(str) {
  return str
    // remove html tags
    .replace(/<.+?>/g, '')
    // remove newline characters
    .replace(/\n/g, ' ');
}

function getFirstTwoSentences(str) {
  const firstPeriodIndex = str.indexOf('.');
  const secondPeriodIndex = str.indexOf('.', firstPeriodIndex + 1);

  return str.slice(0, secondPeriodIndex + 1);
};

// MAIN

getBears('bears-input.txt', function(err, bears) {
  bears = bears.sort();

  console.log('VALID BEAR LIST:', bears, '\n');

  describeAllBears(bears, function(result) {
    console.log('\nTHE FINAL RESULT IS: \n\n', result);
  });
});
