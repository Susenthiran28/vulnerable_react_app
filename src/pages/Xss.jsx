import React, { useState } from 'react';

function XssComplex() {
  const [inputText, setInputText] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [output, setOutput] = useState('');
  const [dynamicOutput, setDynamicOutput] = useState('');

  // Safe rendering as plain text
  const handleUnsafeRender = () => {
    if (!inputText.trim()) {
      setOutput('');
      return;
    }
    setOutput(inputText);
  };

  // Submit comment using React state and escaped text rendering
  const submitComment = () => {
    if (!comment.trim()) {
      setComment('');
      return;
    }

    setComments((prev) => [...prev, comment]);
    setComment(''); // Reset comment field
  };

  return (
    <div>
      <h2>Complex XSS Test Page</h2>

      {/* Example 1: Escaped text rendering */}
      <div>
        <h3>Text Output (Escaped)</h3>
        <input
          type="text"
          placeholder="Enter text"
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handleUnsafeRender}>Render Text</button>
        <div
          style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}
        >
          {output}
        </div>
      </div>

      <hr />

      {/* Example 2: Comment section rendered via React state */}
      <div>
        <h3>Submit Comment (Escaped Text)</h3>
        <textarea
          placeholder="Enter your comment"
          rows="3"
          cols="40"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={submitComment}>Submit Comment</button>
        <div id="comments" style={{ marginTop: '10px' }}>
          {comments.map((item, index) => (
            <div key={`${index}-${item}`}>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      <hr />

      {/* Example 3: Escaped payload display test */}
      <div>
        <h3>Escaped Payload Display Test</h3>
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
          onClick={() => setDynamicOutput(output)}
        >
          Inject Payload
        </button>
        <div id="dynamic" style={{ marginTop: '10px' }}>{dynamicOutput}</div>
      </div>
    </div>
  );
}

export default XssComplex;
