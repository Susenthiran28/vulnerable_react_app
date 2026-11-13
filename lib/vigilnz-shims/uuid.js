"use strict";

const uuid = require("uuid");

function v1(options, buffer, offset) {
	return uuid.v1(options, buffer, offset);
}

function v3(name, namespace, buffer, offset) {
	return uuid.v3(name, namespace, buffer, offset);
}

function v4(options, buffer, offset) {
	return uuid.v4(options, buffer, offset);
}

function v5(name, namespace, buffer, offset) {
	return uuid.v5(name, namespace, buffer, offset);
}

function parse(value) {
	return uuid.parse(value);
}

function stringify(arr, offset) {
	return uuid.stringify(arr, offset);
}

function validate(value) {
	return uuid.validate(value);
}

function version(value) {
	return uuid.version(value);
}

module.exports = {
	v1,
	v3,
	v4,
	v5,
	parse,
	stringify,
	validate,
	version,
	NIL: uuid.NIL,
	MAX: uuid.MAX,
	DNS: uuid.DNS,
	URL: uuid.URL,
	v1ToV6: uuid.v1ToV6,
	v6ToV1: uuid.v6ToV1,
	v6: uuid.v6,
	v7: uuid.v7,
};
