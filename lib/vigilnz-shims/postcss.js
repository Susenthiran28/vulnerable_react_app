"use strict";

const postcssNew = require("postcss");

function normalizePlugins(plugins) {
	if (!plugins) {
		return [];
	}
	if (Array.isArray(plugins)) {
		return plugins;
	}
	return [plugins];
}

function legacyPostcss(plugins) {
	const normalized = normalizePlugins(plugins);
	const processor = postcssNew(normalized);

	const legacyProcessor = {
		plugins: processor.plugins,
		version: postcssNew().version,
		process(css, opts) {
			return processor.process(css, opts);
		},
		use(plugin) {
			processor.use(plugin);
			return legacyProcessor;
		}
	};

	return legacyProcessor;
}

Object.keys(postcssNew).forEach((key) => {
	legacyPostcss[key] = postcssNew[key];
});

legacyPostcss.plugin = function plugin(name, initializer) {
	if (typeof initializer !== "function") {
		throw new Error("postcss.plugin initializer must be a function");
	}

	const creator = function legacyPluginCreator() {
		const transformer = initializer.apply(null, arguments);
		if (typeof transformer !== "function") {
			return transformer;
		}

		const wrapped = function wrappedTransformer(root, result) {
			return transformer(root, result);
		};
		wrapped.postcssPlugin = name || transformer.postcssPlugin || "legacy-plugin";
		wrapped.postcss = true;
		return wrapped;
	};

	creator.postcss = true;
	creator.postcssPlugin = name || "legacy-plugin";
	return creator;
};

legacyPostcss.parse = postcssNew.parse.bind(postcssNew);
legacyPostcss.stringify = postcssNew.stringify.bind(postcssNew);
legacyPostcss.vendor = postcssNew.vendor;
legacyPostcss.list = postcssNew.list;
legacyPostcss.comment = postcssNew.comment;
legacyPostcss.atRule = postcssNew.atRule;
legacyPostcss.decl = postcssNew.decl;
legacyPostcss.rule = postcssNew.rule;
legacyPostcss.root = postcssNew.root;
legacyPostcss.document = postcssNew.document;
legacyPostcss.fromJSON = postcssNew.fromJSON;
legacyPostcss.CssSyntaxError = postcssNew.CssSyntaxError;
legacyPostcss.Declaration = postcssNew.Declaration;
legacyPostcss.Container = postcssNew.Container;
legacyPostcss.Processor = postcssNew.Processor;
legacyPostcss.Document = postcssNew.Document;
legacyPostcss.Comment = postcssNew.Comment;
legacyPostcss.Warning = postcssNew.Warning;
legacyPostcss.AtRule = postcssNew.AtRule;
legacyPostcss.Result = postcssNew.Result;
legacyPostcss.Input = postcssNew.Input;
legacyPostcss.Rule = postcssNew.Rule;
legacyPostcss.Root = postcssNew.Root;
legacyPostcss.Node = postcssNew.Node;
legacyPostcss.stringify = postcssNew.stringify;
legacyPostcss.parse = postcssNew.parse;
legacyPostcss.version = postcssNew().version;
legacyPostcss.default = legacyPostcss;

module.exports = legacyPostcss;
