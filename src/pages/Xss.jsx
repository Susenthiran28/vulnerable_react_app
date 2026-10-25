import React, { useState } from 'react';

function XssComplex() {
  const [inputText, setInputText] = useState('');
  const [comment, setComment] = useState('');
  const [output, setOutput] = useState('');

  // Unsafe rendering using dangerouslySetInnerHTML
  const handleUnsafeRender = () => {
    setOutput(inputText); // Unsafe state update
  };

  // Simulate comment submission with direct DOM injection
  const submitComment = () => {
    const commentsContainer = document.getElementById('comments');
    const commentNode = document.createElement('div');

    // Vulnerability: Directly inserting HTML from user input
commentNode.textContent = comment;
    commentsContainer.appendChild(commentNode);

    setComment(''); // Reset comment field
  };

  return (
    <div>
      <h2>Complex XSS Test Page</h2>

      {/* Example 1: Unsafe input rendering */}
      <div>
        <h3>Unsafe Text Output</h3>
        <input
          type="text"
          placeholder="Enter text"
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handleUnsafeRender}>Render Text</button>
        <div
          style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}
          children={output}
        />
      </div>

      <hr />

      {/* Example 2: Comment Section Vulnerability */}
      <div>
        <h3>Submit Comment (DOM Injection)</h3>
        <textarea
          placeholder="Enter your comment"
          rows="3"
          cols="40"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={submitComment}>Submit Comment</button>
        <div id="comments" style={{ marginTop: '10px' }}></div>
      </div>

      <hr />

      {/* Example 3: Inline Event Handler XSS */}
      <div>
        <h3>Inline Event XSS Test</h3>
        <p>Enter a payload like:</p>
        <code>
          &lt;img src="invalid" onerror="alert('XSS Triggered!')" /&gt;
        </code>
        <br />
        <input
          type="text"
          placeholder="Enter HTML payload"
          onChange={(e) => setOutput(e.target.value)}
        />
        <button
          onClick={() =>

			document.getElementById('dynamic').textContent = output

          }
        >
          Inject Payload
        </button>
        <div id="dynamic" style={{ marginTop: '10px' }}></div>
      </div>
    </div>
  );
}

export default XssComplex;
