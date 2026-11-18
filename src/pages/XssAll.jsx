import React, { useState, useRef, useEffect } from 'react';

function XssAllExamples() {
  const [inputText, setInputText] = useState('');
  const [comment, setComment] = useState('');
  const [dynamicContent, setDynamicContent] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [storageContent, setStorageContent] = useState('');
  const refInput = useRef(null);

  const isSafeImageSrc = (value) => {
    if (!value) return false;
    const trimmed = value.trim();
    if (trimmed.startsWith('/')) return true;

    try {
      const parsed = new URL(trimmed, window.location.origin);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const applySafeStyles = (rawStyles) => {
    const safeProps = {
      color: (v) => /^[a-zA-Z\s#(),.%0-9-]{1,50}$/.test(v),
      backgroundColor: (v) => /^[a-zA-Z\s#(),.%0-9-]{1,50}$/.test(v),
      fontSize: (v) => /^\d{1,3}(px|em|rem|%)$/.test(v),
      margin: (v) => /^\d{1,3}(px|em|rem|%)$/.test(v),
      padding: (v) => /^\d{1,3}(px|em|rem|%)$/.test(v),
    };

    const styleMap = {
      color: '',
      backgroundColor: '',
      fontSize: '',
      margin: '',
      padding: '',
    };

    rawStyles
      .split(';')
      .map((r) => r.trim())
      .filter(Boolean)
      .forEach((rule) => {
        const [rawProp, rawVal] = rule.split(':');
        if (!rawProp || !rawVal) return;
        const prop = rawProp.trim();
        const val = rawVal.trim();

        const normalizedProp =
          prop === 'background-color'
            ? 'backgroundColor'
            : prop === 'font-size'
              ? 'fontSize'
              : prop;

        if (safeProps[normalizedProp] && safeProps[normalizedProp](val)) {
          styleMap[normalizedProp] = val;
        }
      });

    document.body.style.color = styleMap.color;
    document.body.style.backgroundColor = styleMap.backgroundColor;
    document.body.style.fontSize = styleMap.fontSize;
    document.body.style.margin = styleMap.margin;
    document.body.style.padding = styleMap.padding;
  };

  // Effect Hook for Storage-based XSS
  useEffect(() => {
    const storedData = localStorage.getItem('xssData');
    if (storedData) {
      setStorageContent(storedData); // Treat as untrusted text when rendering
    }
  }, []);

  const handleUnsafeRender = () => {
    setDynamicContent(inputText); // Keep as text; do not execute as HTML
  };

  const submitComment = () => {
    const commentsContainer = document.getElementById('comments');
    if (!commentsContainer) return;

    const commentNode = document.createElement('div');
    const paragraph = document.createElement('p');

    // Untrusted input must be written as text, not HTML.
    paragraph.textContent = comment;
    commentNode.appendChild(paragraph);
    commentsContainer.appendChild(commentNode);

    setComment(''); // Reset comment input
  };

  const saveToStorage = () => {
    localStorage.setItem('xssData', inputText); // Saved value is rendered as text
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
        <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
          {/* Render untrusted content as plain text to avoid HTML/script execution */}
          {dynamicContent}
        </div>
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
            // Untrusted input must be text-only.
            const injectedTarget = document.getElementById('injectedButton');
            if (!injectedTarget) return;
            injectedTarget.textContent = attributeValue;
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
            const image = document.getElementById('xssImage');
            if (!image) return;
            const safeSrc = isSafeImageSrc(attributeValue) ? attributeValue.trim() : 'invalid.jpg';
            image.setAttribute('src', safeSrc);
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
            applySafeStyles(inputText);
          }}
        >
          Apply CSS
        </button>
      </div>
    </div>
  );
}

export default XssAllExamples;
