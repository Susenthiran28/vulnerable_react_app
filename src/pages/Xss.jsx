import React, { useState } from 'react';

function XssComplex() {
  const [inputText, setInputText] = useState('');
  const [comment, setComment] = useState('');
  const [output, setOutput] = useState('');
  const [comments, setComments] = useState([]);

  // Safe rendering as plain text (React escapes content by default)
  const handleSafeRender = () => {
    setOutput(String(inputText));
  };

  // Safe comment submission using React state rendering
  const submitComment = () => {
    const trimmedComment = String(comment).trim();
    if (!trimmedComment) {
      return;
    }

    setComments((prev) => [...prev, trimmedComment]);
    setComment(''); // Reset comment field
  };

  return (
    <div>
      <h2>Complex XSS Test Page</h2>

      {/* Example 1: Escaped text rendering */}
      <div>
        <h3>Escaped Text Output</h3>
        <input
          type="text"
          placeholder="Enter text"
          onChange={(e) => setInputText(String(e.target.value))}
        />
        <button onClick={handleSafeRender}>Render Text</button>
        <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
          {/* Render as text node only; do not switch to innerHTML/dangerouslySetInnerHTML */}
          {output}
        </div>
      </div>

      <hr />

      {/* Example 2: Safe comment rendering */}
      <div>
        <h3>Submit Comment (Escaped Rendering)</h3>
        <textarea
          placeholder="Enter your comment"
          rows="3"
          cols="40"
          value={comment}
          onChange={(e) => setComment(String(e.target.value))}
        />
        <button onClick={submitComment}>Submit Comment</button>
        <div id="comments" style={{ marginTop: '10px' }}>
          {comments.map((item, index) => (
            <div key={`${item}-${index}`}>
              {/* React escapes user content here */}
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <hr />

      {/* Example 3: Payload shown as escaped text (not executed) */}
      <div>
        <h3>Inline Event Payload (Escaped Text Preview)</h3>
        <p>Enter a payload like:</p>
        <code>
          &lt;img src="invalid" onerror="alert('XSS Triggered!')" /&gt;
        </code>
        <br />
        <input
          type="text"
          placeholder="Enter HTML payload"
          onChange={(e) => setOutput(String(e.target.value))}
        />
        <button onClick={() => setOutput(String(output))}>
          Show Payload as Text
        </button>
        <div id="dynamic" style={{ marginTop: '10px' }}>{output}</div>
      </div>
    </div>
  );
}

export default XssComplex;
