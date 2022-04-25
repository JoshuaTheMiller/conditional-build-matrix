const core = require('@actions/core');
const jmes = require('jmespath')
const fs = require('fs')

try {
    const inputFilePath = core.getInput('inputFile');
    const filterString = core.getInput('filter');
    const addInclude = (core.getInput('addInclude') || 'true').toUpperCase() === 'TRUE';

    const inputFile = fs.readFileSync(inputFilePath);

    const inputJson = JSON.parse(inputFile);

    const filteredJson = jmes.search(inputJson, filterString);
    const filteredJsonAsString = JSON.stringify(filteredJson);

    const outputString = addInclude ? `{"include":${filteredJsonAsString}}` : filteredJsonAsString;
    core.setOutput("matrix", outputString);
} catch (error) {
    core.setFailed(error.message);
}