"use strict";

const serializeNew = require("serialize-javascript");

function serializeCompat(obj, options) {
	if (options === undefined || options === null) {
		return serializeNew(obj);
	}
	return serializeNew(obj, options);
}

serializeCompat.serialize = serializeCompat;
serializeCompat.default = serializeCompat;

module.exports = serializeCompat;
