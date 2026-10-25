import React, { useState, useRef, useEffect } from 'react';

function XssAllExamples() {
  const [inputText, setInputText] = useState('');
  const [comment, setComment] = useState('');
  const [dynamicContent, setDynamicContent] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [storageContent, setStorageContent] = useState('');
  const refInput = useRef(null);

  // Effect Hook for Storage-based XSS
  useEffect(() => {
    const storedData = localStorage.getItem('xssData');
    if (storedData) {
      setStorageContent(storedData); // Vulnerable to Storage-based XSS
    }
  }, []);

  const handleUnsafeRender = () => {
    setDynamicContent(inputText); // Vulnerable to unsafe state injection
  };

  const submitComment = () => {
    const commentsContainer = document.getElementById('comments');
    const commentNode = document.createElement('div');

		commentNode.textContent = comment; // Prevent XSS by using textContent
    commentsContainer.appendChild(commentNode);

    setComment(''); // Reset comment input
  };

  const saveToStorage = () => {
    localStorage.setItem('xssData', inputText); // Save data insecurely
    alert('Data saved to localStorage');
  };

  return (
    <div>
      <h1>Comprehensive React XSS Demo</h1>

      <hr />

      {/* DOM Injection Example */}
      <div>
        <h2>DOM Injection</h2>
        <textarea
          placeholder="Enter HTML/JS payload"
          rows="3"
          cols="40"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handleUnsafeRender}>Render Content</button>
        <div
          style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}
        <span>{dynamicContent}</span>
        />
      </div>

      <hr />

      {/* Comment Section DOM Injection */}
      <div>
        <h2>Comment Section (DOM Manipulation)</h2>
        <textarea
          placeholder="Leave a comment"
          rows="3"
          cols="40"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={submitComment}>Post Comment</button>
        <div id="comments" style={{ marginTop: '10px' }}></div>
      </div>

      <hr />

      {/* Inline Event Injection */}
      <div>
        <h2>Inline Event Injection</h2>
        <input
          type="text"
          placeholder="Enter JS payload"
          onChange={(e) => setAttributeValue(e.target.value)}
        />
        <button
          id="eventButton"
          onClick={() => {
	document.getElementById('injectedButton').textContent = attributeValue;
          }}
        >
          Inject Payload
        </button>
        <div id="injectedButton" style={{ marginTop: '10px' }}></div>
      </div>

      <hr />

      {/* Attribute Injection */}
      <div>
        <h2>Attribute Injection</h2>
        <input
          type="text"
          placeholder="Enter malicious attribute"
          onChange={(e) => setAttributeValue(e.target.value)}
        />
        <img src="invalid.jpg" alt="XSS Test" id="xssImage" />
        <button
          onClick={() => {
            document
              .getElementById('xssImage')
              .setAttribute('src', attributeValue); // Vulnerable to Attribute Injection
          }}
        >
          Inject Attribute
        </button>
      </div>

      <hr />

      {/* Local Storage XSS */}
      <div>
        <h2>Storage-based XSS</h2>
        <input
          type="text"
          placeholder="Enter XSS payload"
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={saveToStorage}>Save to LocalStorage</button>
        <p>Stored Data:</p>
<div>{storageContent}</div>
      </div>

      <hr />

      {/* JavaScript Code Injection */}
      <div>
        <h2>JavaScript Injection (Ref Exploit)</h2>
        <input
          ref={refInput}
          type="text"
          placeholder="Enter payload"
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          onClick={() => {
            refInput.current.value = `<script>alert("Injected JS")</script>`;
          }}
        >
          Inject JS
        </button>
      </div>

      <hr />

      {/* CSS Injection */}
      <div>
        <h2>CSS Injection</h2>
        <input
          type="text"
          placeholder="Enter CSS payload"
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          onClick={() => {
            document.body.style.cssText = inputText; // Vulnerable to CSS Injection
          }}
        >
          Apply CSS
        </button>
      </div>
    </div>
  );
}

export default XssAllExamples;
