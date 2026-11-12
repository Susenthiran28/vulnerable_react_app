const React = require('react');
const path = require('path');

let mod;
let XssTest;
let observed;

try {
  mod = require('../../../src/components/XssTest.jsx');
  XssTest = mod && (mod.default || mod);
  if (typeof XssTest !== 'function') {
    throw new Error('Default export is not a function component');
  }
} catch (e) {
  console.error('Failed to load component:', e && e.message ? e.message : e);
  process.exit(1);
}

try {
  observed = XssTest();
} catch (e) {
  console.error('Calling component threw:', e && e.message ? e.message : e);
  process.exit(1);
}

let expected;
try {
  expected = React.createElement(
    'div',
    null,
    React.createElement('h2', null, 'XSS Vulnerability Example'),
    React.createElement(
      'p',
      null,
      'Enter any text, including malicious JavaScript code, such as:',
      React.createElement('pre', null, "<script>alert('XSS');</script>")
    ),
    React.createElement('input', {
      type: 'text',
      placeholder: 'Enter some text',
      onChange: expectAnyFunction
    }),
    React.createElement(
      'div',
      null,
      React.createElement('h3', null, 'Output (Unsafe):'),
      React.createElement('p', { dangerouslySetInnerHTML: { __html: '' } })
    )
  );
} catch (e) {
  console.error('Failed to build expected structure:', e && e.message ? e.message : e);
  process.exit(1);
}

function expectAnyFunction() {}

function stable(val) {
  return JSON.stringify(val, function (k, v) {
    if (typeof v === 'function') return '__fn__';
    return v;
  });
}

const observedStable = stable(observed);
const expectedStable = stable(expected);

if (observedStable !== expectedStable) {
  console.error('Observed render output changed.');
  console.error('Expected:', expectedStable);
  console.error('Observed:', observedStable);
  process.exit(1);
}
