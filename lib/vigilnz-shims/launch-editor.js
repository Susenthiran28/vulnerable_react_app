'use strict';

const open = require('launch-editor');

function launchEditorCompat(fileName, lineNumber, colNumber) {
	return open(fileName, lineNumber, colNumber);
}

launchEditorCompat.default = launchEditorCompat;
launchEditorCompat.launchEditor = launchEditorCompat;

module.exports = launchEditorCompat;
