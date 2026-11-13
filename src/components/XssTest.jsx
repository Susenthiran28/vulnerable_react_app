import React, { useState } from 'react';

function XssTest() {
  const [userInput, setUserInput] = useState('');

  return (
    <div>
      <h2>XSS Vulnerability Example</h2>
      <p>
        Enter any text, including malicious JavaScript code, such as:
        <pre>
          {"<script>alert('XSS');</script>"}
        </pre>
      </p>

      <input
        type="text"
        placeholder="Enter some text"
        onChange={(e) => setUserInput(e.target.value)}
      />

      {/* Safe rendering of user input */}
      <div>
        <h3>Output (Safe):</h3>
        <p>{userInput}</p>
      </div>
    </div>
  );
}

export default XssTest;
