import React, { useState, useRef, useEffect } from 'react';
import '../styles/DockerConsole.css';

const DockerConsole = ({ commands = [], onCommandExecuted }) => {
  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleEndRef = useRef(null);
  
  // Scroll to bottom of console when new commands are added
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commandHistory]);
  
  // Handle command submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputCommand.trim()) return;
    
    // Add command to history
    const newHistory = [
      ...commandHistory,
      { type: 'command', content: inputCommand },
    ];
    
    setCommandHistory(newHistory);
    
    // Check if command is valid and get response
    const validCommand = commands.find(
      (cmd) => inputCommand.trim() === cmd.command
    );
    
    if (validCommand) {
      // Add response to history
      setCommandHistory([
        ...newHistory,
        { type: 'response', content: validCommand.response, success: true },
      ]);
      
      // Notify parent component
      if (onCommandExecuted) {
        onCommandExecuted(validCommand);
      }
    } else {
      // Add error response to history
      setCommandHistory([
        ...newHistory,
        {
          type: 'response',
          content: `Error: command not found: ${inputCommand}`,
          success: false,
        },
      ]);
    }
    
    // Clear input and reset history index
    setInputCommand('');
    setHistoryIndex(-1);
  };
  
  // Handle key navigation in command history
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      // Navigate up in history
      e.preventDefault();
      if (historyIndex < commandHistory.filter((cmd) => cmd.type === 'command').length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        
        // Get command from history
        const commandEntries = commandHistory.filter(
          (cmd) => cmd.type === 'command'
        );
        const historyCommand =
          commandEntries[commandEntries.length - 1 - newIndex]?.content || '';
        setInputCommand(historyCommand);
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate down in history
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        
        // Get command from history
        const commandEntries = commandHistory.filter(
          (cmd) => cmd.type === 'command'
        );
        const historyCommand =
          commandEntries[commandEntries.length - 1 - newIndex]?.content || '';
        setInputCommand(historyCommand);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputCommand('');
      }
    }
  };
  
  return (
    <div className="docker-console">
      <div className="console-header">
        <span className="console-title">Docker Console</span>
        <div className="console-controls">
          <button
            className="clear-btn"
            onClick={() => setCommandHistory([])}
            title="Clear Console"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="console-output">
        {commandHistory.map((entry, index) => (
          <div
            key={index}
            className={`console-entry ${entry.type} ${
              entry.type === 'response' ? (entry.success ? 'success' : 'error') : ''
            }`}
          >
            {entry.type === 'command' && <span className="prompt">$ </span>}
            <span className="content">{entry.content}</span>
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>
      
      <form className="console-input" onSubmit={handleSubmit}>
        <span className="prompt">$</span>
        <input
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your command here..."
          autoFocus
        />
      </form>
    </div>
  );
};

export default DockerConsole;