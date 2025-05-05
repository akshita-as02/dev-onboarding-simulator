import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import '../styles/CodeEditor.css';

const CodeEditor = ({ value, onChange, language = 'javascript', readOnly = false }) => {
  const [theme, setTheme] = useState('vs-dark');
  
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };
  
  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: readOnly,
    cursorStyle: 'line',
    automaticLayout: true,
    minimap: {
      enabled: true,
    },
    scrollBeyondLastLine: false,
    fontSize: 14,
  };
  
  return (
    <div className="code-editor-container">
      <div className="editor-toolbar">
        <select
          className="theme-selector"
          value={theme}
          onChange={handleThemeChange}
        >
          <option value="vs-dark">Dark Theme</option>
          <option value="vs-light">Light Theme</option>
          <option value="hc-black">High Contrast</option>
        </select>
      </div>
      
      <Editor
        height="500px"
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        options={editorOptions}
      />
    </div>
  );
};

export default CodeEditor;