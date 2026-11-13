import React, { useState, useRef, useEffect } from 'react';

function XssAllExamples() {
  const [inputText, setInputText] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [dynamicContent, setDynamicContent] = useState('');
  const [attributeValue, setAttributeValue] = useState('');
  const [injectedText, setInjectedText] = useState('');
  const [safeImageSrc, setSafeImageSrc] = useState('invalid.jpg');
  const [safeBodyStyle, setSafeBodyStyle] = useState({});
  const [storageContent, setStorageContent] = useState('');
  const refInput = useRef(null);

  const isSafeImageUrl = (value) => {
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

  const parseSafeCss = (cssText) => {
    const allowed = {
      color: /^#[0-9a-fA-F]{3,8}$|^[a-zA-Z]{1,20}$/,
      backgroundColor: /^#[0-9a-fA-F]{3,8}$|^[a-zA-Z]{1,20}$/,
      fontSize: /^\d{1,3}(px|em|rem|%)$/,
    };

    const nextStyle = {};
    const declarations = (cssText || '').split(';');

    declarations.forEach((declaration) => {
      const [rawProp, rawValue] = declaration.split(':');
      if (!rawProp || !rawValue) return;

      const prop = rawProp.trim().toLowerCase();
      const value = rawValue.trim();

      const propMap = {
        color: 'color',
        'background-color': 'backgroundColor',
        'font-size': 'fontSize',
      };

      const mappedProp = propMap[prop];
      if (!mappedProp) return;

      const pattern = allowed[mappedProp];
      if (pattern && pattern.test(value)) {
        nextStyle[mappedProp] = value;
      }
    });

    return nextStyle;
  };

  // Effect Hook for Storage-based XSS
  useEffect(() => {
    const storedData = localStorage.getItem('xssData');
    if (storedData) {
      setStorageContent(storedData); // Keep as plain text only; do not render as HTML.
    }
  }, []);

  const handleUnsafeRender = () => {
    setDynamicContent(inputText); // Render as text only unless sanitized HTML is explicitly required
  };

  const submitComment = () => {
    if (!comment) return;
    setComments((prev) => [...prev, comment]);
    setComment(''); // Reset comment input
  };

  const saveToStorage = () => {
    localStorage.setItem('xssData', inputText); // Save data insecurely
    alert('Data saved to localStorage');
  };

  return (
    <div style={safeBodyStyle}>
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
        <div id="comments" style={{ marginTop: '10px' }}>
          {comments.map((item, index) => (
            <div key={`${item}-${index}`}>
              <p>{item}</p>
            </div>
          ))}
        </div>
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
            setInjectedText(attributeValue);
          }}
        >
          Inject Payload
        </button>
        <div id="injectedButton" style={{ marginTop: '10px' }}>{injectedText}</div>
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
        <img src={safeImageSrc} alt="XSS Test" id="xssImage" />
        <button
          onClick={() => {
            if (isSafeImageUrl(attributeValue)) {
              setSafeImageSrc(attributeValue.trim());
            }
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
            setSafeBodyStyle(parseSafeCss(inputText));
          }}
        >
          Apply CSS
        </button>
      </div>
    </div>
  );
}

export default XssAllExamples;
