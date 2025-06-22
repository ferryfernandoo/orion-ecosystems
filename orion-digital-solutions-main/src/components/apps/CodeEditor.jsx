import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CodeEditor = () => {
  // Initialize Google Generative AI with enhanced configuration
  const genAI = new GoogleGenerativeAI("AIzaSyDSTgkkROL7mjaGKoD2vnc8l2UptNCbvHk");
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE",
      },
    ],
  });

  const [files, setFiles] = useState(() => {
    const savedFiles = localStorage.getItem('orion-code-files');
    return savedFiles
      ? JSON.parse(savedFiles)
      : [
          {
            id: 1,
            filename: 'index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to Orion Editor</h1>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>`,
            lastModified: Date.now(),
          },
          {
            id: 2,
            filename: 'style.css',
            language: 'css',
            content: `/* Add your styles here */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #1e1e1e;
  color: #e0e0e0;
}

h1 {
  color: #569cd6;
}`,
            lastModified: Date.now(),
          },
          {
            id: 3,
            filename: 'app.js',
            language: 'javascript',
            content: `// JavaScript goes here
function greet(name) {
  return \`Hello, \${name}!\`;
}

// DOM manipulation
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = '<p>' + greet('Orion User') + '</p>';
  console.log('App initialized');
});

// Example ES6 features
class Example {
  constructor(value) {
    this.value = value;
  }

  display() {
    console.log(\`Value: \${this.value}\`);
  }
}

const example = new Example(42);
example.display();`,
            lastModified: Date.now(),
          }
        ];
  });

  const [activeFileId, setActiveFileId] = useState(files[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [problems, setProblems] = useState([]);
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer', 'search', 'git', 'debug'
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const terminalRef = useRef(null);

  // Enhanced file templates with more complete examples
  const fileTemplates = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>`,
    css: `/* CSS file */
:root {
  --primary-color: #569cd6;
  --background-color: #1e1e1e;
  --text-color: #e0e0e0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}`,
    javascript: `// JavaScript file using modern ES6+ features
import { fetchData } from './api.js';

class App {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const data = await fetchData();
      this.render(data);
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  render(data) {
    const app = document.getElementById('app');
    app.innerHTML = \`
      <h1>\${data.title}</h1>
      <p>\${data.description}</p>
    \`;
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new App();
});`,
    json: `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "Project description",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "dependencies": {},
  "devDependencies": {}
}`
  };

  // File extensions mapping
  const fileExtensions = {
    html: 'html',
    css: 'css',
    javascript: 'js',
    json: 'json'
  };

  // Save files to localStorage with debounce
  const debouncedSave = useCallback((newFiles) => {
    localStorage.setItem('orion-code-files', JSON.stringify(newFiles));
    setIsSaved(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSave(files);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [files, debouncedSave]);

  // Create new file with enhanced logic
  const createNewFile = (language = 'javascript', initialContent = '') => {
    const extension = fileExtensions[language] || 'js';
    const defaultFilename = `new-file-${Date.now()}.${extension}`;
    
    const newFile = {
      id: Date.now(),
      filename: defaultFilename,
      language,
      content: initialContent || fileTemplates[language] || '',
      lastModified: Date.now(),
    };
    
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
    setIsSaved(false);
    
    // Add to terminal output
    setTerminalOutput(prev => [...prev, `$ Created new ${language} file: ${defaultFilename}`]);
    setShowTerminal(true);
    
    return newFile;
  };

  // Update file content with validation
  const updateFileContent = (content) => {
    setFiles(
      files.map((file) =>
        file.id === activeFileId
          ? { ...file, content, lastModified: Date.now() }
          : file
      )
    );
    setIsSaved(false);
    
    // Simple validation for demonstration
    validateCode(content);
  };

  // Simple code validation
  const validateCode = (code) => {
    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) return;
    
    const newProblems = [];
    
    // Check for common issues in JavaScript
    if (activeFile.language === 'javascript') {
      if (code.includes('console.log(')) {
        newProblems.push({
          severity: 'info',
          message: 'Console.log found - remove for production code',
          line: code.split('\n').findIndex(line => line.includes('console.log(')) + 1
        });
      }
      
      if (code.includes('var ')) {
        newProblems.push({
          severity: 'warning',
          message: 'Using var - consider using let or const instead',
          line: code.split('\n').findIndex(line => line.includes('var ')) + 1
        });
      }
    }
    
    // Check for common issues in HTML
    if (activeFile.language === 'html') {
      if (!code.includes('<html')) {
        newProblems.push({
          severity: 'warning',
          message: 'Missing <html> tag',
          line: 1
        });
      }
    }
    
    setProblems(newProblems);
  };

  // Enhanced filename update with validation
  const updateFilename = (filename) => {
    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) return;
    
    const extension = fileExtensions[activeFile.language] || 'js';
    let newFilename = filename;
    
    if (!filename.endsWith(`.${extension}`)) {
      newFilename = `${filename.split('.')[0]}.${extension}`;
    }
    
    // Check for duplicate filenames
    if (files.some(file => file.filename === newFilename && file.id !== activeFileId)) {
      setTerminalOutput(prev => [...prev, `! Error: A file with name "${newFilename}" already exists`]);
      setShowTerminal(true);
      return;
    }
    
    setFiles(
      files.map((file) =>
        file.id === activeFileId
          ? { ...file, filename: newFilename, lastModified: Date.now() }
          : file
      )
    );
    setIsSaved(false);
    
    setTerminalOutput(prev => [...prev, `$ Renamed file to ${newFilename}`]);
    setShowTerminal(true);
  };

  // Delete file with confirmation
  const deleteFile = (id) => {
    const fileToDelete = files.find(file => file.id === id);
    if (!fileToDelete) return;
    
    if (window.confirm(`Are you sure you want to delete ${fileToDelete.filename}?`)) {
      const updatedFiles = files.filter((file) => file.id !== id);
      setFiles(updatedFiles);
      
      if (activeFileId === id) {
        setActiveFileId(updatedFiles[0]?.id);
      }
      
      setIsSaved(false);
      
      setTerminalOutput(prev => [...prev, `$ Deleted file: ${fileToDelete.filename}`]);
      setShowTerminal(true);
    }
  };

  // Run code with enhanced execution
  const runCode = () => {
    setShowPreview(true);
    setPreviewKey(prev => prev + 1);
    
    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) return;
    
    const newOutput = [...terminalOutput, `$ Running ${activeFile.filename}`];
    
    try {
      // Simulate different outputs based on file type
      if (activeFile.language === 'javascript') {
        // Extract all console.log statements
        const logStatements = activeFile.content.match(/console\.log\(([^)]+)\)/g) || [];
        logStatements.forEach(statement => {
          const expression = statement.replace(/console\.log\(([^)]+)\)/, '$1');
          try {
            // This is a simulation - in a real app you'd use a proper sandbox
            const result = eval(expression);
            newOutput.push(`> ${expression} → ${JSON.stringify(result)}`);
          } catch (error) {
            newOutput.push(`! Error in ${expression}: ${error.message}`);
          }
        });
        
        if (logStatements.length === 0) {
          newOutput.push('> No console output');
        }
      } else if (activeFile.language === 'html') {
        newOutput.push('> HTML file rendered in preview');
      } else if (activeFile.language === 'css') {
        newOutput.push('> CSS styles applied to preview');
      }
    } catch (error) {
      newOutput.push(`! Runtime Error: ${error.message}`);
    }
    
    setTerminalOutput(newOutput);
    setShowTerminal(true);
  };

  // Editor mount handler with enhanced shortcuts
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyCode.F5, runCode);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => setShowAiPanel(true));
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      debouncedSave(files);
      setTerminalOutput(prev => [...prev, `$ Saved all files`]);
      setShowTerminal(true);
    });
    
    // Configure Monaco languages
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
    });
  };

  // Get HTML preview content with all dependencies
  const getHtmlPreviewContent = () => {
    const htmlFile = files.find(file => file.language === 'html');
    const cssFile = files.find(file => file.language === 'css');
    const jsFile = files.find(file => file.language === 'javascript');
    
    let content = htmlFile?.content || '<!DOCTYPE html><html><body><h1>No HTML file found</h1></body></html>';
    
    // Inject CSS if available
    if (cssFile) {
      const styleTag = `<style>${cssFile.content}</style>`;
      if (content.includes('</head>')) {
        content = content.replace('</head>', `${styleTag}</head>`);
      } else if (content.includes('<head>')) {
        content = content.replace('<head>', `<head>${styleTag}`);
      } else {
        content = content.replace('<html>', `<html><head>${styleTag}</head>`);
      }
    }
    
    // Inject JS if available
    if (jsFile) {
      const scriptTag = `<script>${jsFile.content}</script>`;
      if (content.includes('</body>')) {
        content = content.replace('</body>', `${scriptTag}</body>`);
      } else if (content.includes('<body>')) {
        content = content.replace('<body>', `<body>${scriptTag}`);
      } else {
        content = `${content}${scriptTag}`;
      }
    }
    
    return content;
  };

  // Enhanced AI assistant with autonomous capabilities
  const askAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('Thinking...');
    const userPrompt = aiPrompt;
    setAiPrompt('');
    
    try {
      const activeFile = files.find(file => file.id === activeFileId);
      const context = activeFile ? `File: ${activeFile.filename}\nLanguage: ${activeFile.language}\nCurrent code:\n\`\`\`${activeFile.language}\n${activeFile.content}\n\`\`\`` : 'No active file';
      
      const fullPrompt = `You are an advanced AI coding assistant integrated into a VS Code-like editor. The user is working on:\n${context}\n\nUser request: ${userPrompt}\n\nYour response should be:
1. First, analyze the request and determine if it requires:
   - Code modification
   - New file creation
   - Explanation
   - Debugging help
   - Other assistance
2. Provide a clear, concise response with code examples in markdown code blocks when applicable.
3. If the task requires creating new files or significant changes, provide complete code solutions.
4. For complex tasks, break down the solution into steps.
5. Always specify which file you're modifying or creating.

Current files in project: ${files.map(f => f.filename).join(', ')}`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      setAiResponse(text);
      
      // Parse AI response for actionable items
      parseAIResponse(text, userPrompt);
      
      // Add to terminal
      setTerminalOutput(prev => [...prev, `AI: Processing request: ${userPrompt}`, `AI: ${text.split('\n')[0]}`]);
      setShowTerminal(true);
    } catch (error) {
      setAiResponse(`Error: ${error.message}`);
      setTerminalOutput(prev => [...prev, `! AI Error: ${error.message}`]);
      setShowTerminal(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Parse AI response and automatically apply changes when appropriate
  const parseAIResponse = (response, userPrompt) => {
    // Check for file creation/modification patterns
    const filePatterns = [
      /```(?:html|css|javascript|json)\s+file:\s*([^\n]+)\n([\s\S]+?)```/g,
      /```(?:html|css|javascript|json)\n([\s\S]+?)```/g
    ];
    
    let hasChanges = false;
    
    filePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(response)) !== null) {
        const filename = match[1]?.trim() || '';
        const content = match[2] || match[1];
        
        // Determine if this is a new file or existing file
        const existingFile = files.find(f => f.filename === filename);
        
        if (existingFile) {
          // Update existing file
          setFiles(files.map(f => 
            f.filename === filename 
              ? { ...f, content, lastModified: Date.now() }
              : f
          ));
          setTerminalOutput(prev => [...prev, `AI: Updated file ${filename}`]);
          hasChanges = true;
        } else if (filename) {
          // Create new file
          const language = filename.endsWith('.html') ? 'html' :
                          filename.endsWith('.css') ? 'css' :
                          filename.endsWith('.json') ? 'json' : 'javascript';
          createNewFile(language, content);
          setTerminalOutput(prev => [...prev, `AI: Created new file ${filename}`]);
          hasChanges = true;
        } else {
          // Code block without filename - apply to current file if appropriate
          const activeFile = files.find(file => file.id === activeFileId);
          if (activeFile && userPrompt.toLowerCase().includes('modify') || userPrompt.toLowerCase().includes('change')) {
            updateFileContent(content);
            setTerminalOutput(prev => [...prev, `AI: Modified current file ${activeFile.filename}`]);
            hasChanges = true;
          }
        }
      }
    });
    
    if (hasChanges) {
      setIsSaved(false);
    }
  };

  // Apply AI suggestion directly
  const applyAiSuggestion = () => {
    if (!activeFileId || !aiResponse) return;
    
    // Look for code blocks in the response
    const codeBlocks = aiResponse.match(/```(?:html|css|javascript|json)?\n([\s\S]+?)```/g);
    if (codeBlocks && codeBlocks.length > 0) {
      const newCode = codeBlocks[0].replace(/```[^\n]*\n/, '').replace(/\n```$/, '');
      updateFileContent(newCode);
      setTerminalOutput(prev => [...prev, `$ Applied AI suggestion to ${files.find(f => f.id === activeFileId)?.filename}`]);
      setShowTerminal(true);
    }
  };

  // Filter files based on search query
  const filteredFiles = files.filter((file) =>
    file.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFile = files.find((file) => file.id === activeFileId);
  const formatDate = (timestamp) => new Date(timestamp).toLocaleString();

  // VS Code-like color scheme
  const vscodeColors = {
    background: '#1e1e1e',
    sidebar: '#252526',
    sidebarHover: '#2a2d2e',
    active: '#37373d',
    text: '#cccccc',
    textSecondary: '#858585',
    border: '#474747',
    highlight: '#0e639c',
    button: '#0a639c',
    buttonHover: '#1177bb',
    terminal: '#1e1e1e',
    terminalText: '#f0f0f0',
    error: '#f14c4c',
    warning: '#cca700',
    info: '#3794ff',
  };

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden">
      {/* Title Bar */}
      <div className="h-8 bg-[#3c3c3c] flex items-center px-4 text-sm border-b border-[#252526]">
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Orion Editor</span>
          <span className="text-xs text-[#858585]">{activeFile?.filename || 'No file selected'}</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <button 
            className="px-2 py-1 text-xs bg-[#0a639c] hover:bg-[#1177bb] rounded"
            onClick={runCode}
            title="Run Code (F5)"
          >
            Run
          </button>
          <span className={`text-xs ${isSaved ? 'text-[#858585]' : 'text-[#569cd6]'}`}>
            {isSaved ? 'Saved' : 'Unsaved'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#252526] flex flex-col items-center py-2 space-y-4 border-r border-[#474747]">
          <button 
            className={`p-2 rounded ${activeTab === 'explorer' ? 'bg-[#37373d]' : 'hover:bg-[#37373d]'}`} 
            title="Explorer"
            onClick={() => setActiveTab('explorer')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${activeTab === 'search' ? 'bg-[#37373d]' : 'hover:bg-[#37373d]'}`} 
            title="Search"
            onClick={() => setActiveTab('search')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${activeTab === 'git' ? 'bg-[#37373d]' : 'hover:bg-[#37373d]'}`} 
            title="Git"
            onClick={() => setActiveTab('git')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${activeTab === 'debug' ? 'bg-[#37373d]' : 'hover:bg-[#37373d]'}`} 
            title="Debug"
            onClick={() => setActiveTab('debug')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          <button 
            className={`p-2 rounded ${showAiPanel ? 'bg-[#37373d]' : 'hover:bg-[#37373d]'}`} 
            title="AI Assistant (Ctrl+K)"
            onClick={() => setShowAiPanel(!showAiPanel)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        </div>

        {/* Sidebar */}
        <div className={`${showAiPanel ? 'w-1/4' : 'w-64'} bg-[#252526] flex flex-col border-r border-[#474747] transition-all duration-200`}>
          {showAiPanel ? (
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">AI Coding Assistant</h3>
                <button
                  className="p-1 hover:bg-[#37373d] rounded"
                  onClick={() => setShowAiPanel(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 flex flex-col">
                <textarea
                  className="flex-1 bg-[#2d2d2d] text-[#cccccc] p-2 mb-2 rounded border border-[#474747] outline-none resize-none"
                  placeholder="Ask the AI to help with your code (e.g., 'Create a React component', 'Fix this bug', 'Add authentication')"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      askAI();
                    }
                  }}
                />
                <button
                  className="px-4 py-2 bg-[#0a639c] hover:bg-[#1177bb] rounded-md mb-4 flex items-center justify-center"
                  onClick={askAI}
                  disabled={isAiLoading}
                >
                  {isAiLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Thinking...
                    </>
                  ) : 'Ask AI (Ctrl+Enter)'}
                </button>
                
                <div className="flex-1 bg-[#1e1e1e] p-3 rounded overflow-auto">
                  {aiResponse ? (
                    <div className="prose prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">{aiResponse}</pre>
                      {aiResponse.includes('```') && (
                        <button
                          className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                          onClick={applyAiSuggestion}
                        >
                          Apply Code Changes
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-[#858585] text-sm">
                      <p>Ask the AI to:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Explain code concepts</li>
                        <li>Debug errors</li>
                        <li>Generate new code</li>
                        <li>Refactor existing code</li>
                        <li>Create entire components</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'explorer' && (
                <>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider">EXPLORER</h3>
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 hover:bg-[#37373d] rounded"
                          onClick={() => createNewFile('html')}
                          title="New HTML File"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                        <button 
                          className="p-1 hover:bg-[#37373d] rounded"
                          onClick={() => createNewFile('javascript')}
                          title="New JavaScript File"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Search files..."
                      className="w-full px-3 py-1 bg-[#2d2d2d] rounded-md outline-none text-sm mb-2"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {filteredFiles.length > 0 ? (
                      filteredFiles.map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center px-4 py-1 cursor-pointer hover:bg-[#37373d] ${
                            file.id === activeFileId ? 'bg-[#37373d]' : ''
                          }`}
                          onClick={() => setActiveFileId(file.id)}
                        >
                          <div className="flex-1 flex items-center">
                            <span className="text-sm truncate">{file.filename}</span>
                          </div>
                          <button
                            className="p-1 hover:bg-[#4a4a4a] rounded text-[#858585] hover:text-[#cccccc]"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-[#858585] text-sm">
                        {searchQuery ? 'No files match your search' : 'No files in project'}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {activeTab === 'search' && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">SEARCH</h3>
                  <input
                    type="text"
                    placeholder="Search across all files..."
                    className="w-full px-3 py-1 bg-[#2d2d2d] rounded-md outline-none text-sm mb-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="text-[#858585] text-sm">
                    {searchQuery ? (
                      <div>
                        <p>Search results for "{searchQuery}":</p>
                        <div className="mt-2 space-y-2">
                          {filteredFiles.map(file => (
                            <div key={file.id} className="p-2 bg-[#2d2d2d] rounded">
                              <div className="font-medium">{file.filename}</div>
                              {file.content.includes(searchQuery) && (
                                <div className="text-xs mt-1">
                                  {file.content.split('\n').map((line, i) => (
                                    line.includes(searchQuery) && (
                                      <div key={i} className="py-1">
                                        <span className="text-[#569cd6]">{i + 1}</span>: {line}
                                      </div>
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p>Enter a search term to find matches across all files</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'git' && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">GIT</h3>
                  <div className="text-[#858585] text-sm">
                    <p>Git integration would appear here in a real implementation.</p>
                    <div className="mt-4 p-2 bg-[#2d2d2d] rounded">
                      <div className="font-medium">Changes</div>
                      {files.filter(f => !isSaved).map(file => (
                        <div key={file.id} className="flex items-center mt-1 text-xs">
                          <span className="text-green-400">M</span>
                          <span className="ml-2">{file.filename}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'debug' && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">DEBUG</h3>
                  <div className="text-[#858585] text-sm">
                    <p>Debug tools would appear here in a real implementation.</p>
                    {problems.length > 0 && (
                      <div className="mt-4">
                        <div className="font-medium">Problems</div>
                        <div className="mt-2 space-y-1">
                          {problems.map((problem, i) => (
                            <div key={i} className={`flex items-start text-xs p-1 rounded ${
                              problem.severity === 'error' ? 'text-[#f14c4c]' : 
                              problem.severity === 'warning' ? 'text-[#cca700]' : 'text-[#3794ff]'
                            }`}>
                              <span className="mr-2">
                                {problem.severity === 'error' ? '✖' : 
                                 problem.severity === 'warning' ? '⚠' : 'ℹ'}
                              </span>
                              <span>
                                {problem.message} (Line {problem.line})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <div className="h-8 bg-[#252526] flex items-center border-b border-[#474747] overflow-x-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className={`h-full flex items-center px-3 border-r border-[#474747] cursor-pointer text-sm ${
                  file.id === activeFileId ? 'bg-[#1e1e1e]' : 'hover:bg-[#2d2d2d]'
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <span className="truncate max-w-xs">{file.filename}</span>
                {file.id === activeFileId && !isSaved && (
                  <span className="ml-2 text-[#858585]">●</span>
                )}
                <button
                  className="ml-2 p-1 hover:bg-[#4a4a4a] rounded text-[#858585] hover:text-[#cccccc]"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Editor/Preview Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor */}
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} h-full`}>
              {activeFile ? (
                <Editor
                  height="100%"
                  theme="vs-dark"
                  language={activeFile.language}
                  value={activeFile.content}
                  onChange={updateFileContent}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: true },
                    automaticLayout: true,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    renderWhitespace: 'selection',
                    tabSize: 2,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    bracketPairColorization: {
                      enabled: true,
                      independentColorPoolPerBracketType: true
                    },
                    guides: {
                      bracketPairs: true,
                      bracketPairsHorizontal: true,
                      highlightActiveBracketPair: true,
                      indentation: true
                    },
                    occurrencesHighlight: true,
                    selectionHighlight: true,
                    codeLens: true,
                    lightbulb: { enabled: true },
                    parameterHints: { enabled: true },
                    suggest: { 
                      snippetsPreventQuickSuggestions: false,
                      localityBonus: true
                    },
                    hover: { 
                      enabled: true,
                      delay: 300,
                      sticky: true
                    },
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-[#858585]">
                  No file selected
                </div>
              )}
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="w-1/2 h-full bg-white flex flex-col">
                <div className="h-8 bg-[#252526] flex items-center px-3 text-sm border-b border-[#474747]">
                  <span>Preview</span>
                  <button
                    className="ml-auto p-1 hover:bg-[#37373d] rounded"
                    onClick={() => setShowPreview(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    className="ml-2 p-1 hover:bg-[#37373d] rounded"
                    onClick={() => {
                      setPreviewKey(prev => prev + 1);
                      setTerminalOutput(prev => [...prev, `$ Refreshed preview`]);
                      setShowTerminal(true);
                    }}
                    title="Refresh Preview"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <iframe
                  key={previewKey}
                  ref={previewRef}
                  srcDoc={getHtmlPreviewContent()}
                  title="Preview"
                  className="flex-1 w-full border-none"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="h-6 bg-[#007acc] flex items-center px-3 text-xs justify-between">
            <div className="flex items-center space-x-4">
              <span>{activeFile?.language ? activeFile.language.toUpperCase() : ''}</span>
              <span>{isSaved ? 'Saved' : 'Unsaved'}</span>
              <span>{formatDate(activeFile?.lastModified || Date.now())}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="hover:bg-[#006bb3] px-1 rounded"
                onClick={() => setShowTerminal(!showTerminal)}
              >
                {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
              </button>
              <span>Ln {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}</span>
              <span>UTF-8</span>
            </div>
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-48 bg-[#1e1e1e] border-t border-[#474747] flex flex-col">
              <div className="h-6 bg-[#252526] flex items-center px-3 text-xs border-b border-[#474747]">
                <span>TERMINAL</span>
                <button
                  className="ml-auto p-1 hover:bg-[#37373d] rounded"
                  onClick={() => setShowTerminal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div 
                ref={terminalRef}
                className="flex-1 p-2 overflow-auto font-mono text-sm"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {terminalOutput.length > 0 ? (
                  terminalOutput.map((line, index) => (
                    <div key={index} className="mb-1">
                      {line.startsWith('$') ? (
                        <span className="text-green-400">{line}</span>
                      ) : line.startsWith('>') ? (
                        <span className="text-blue-400">{line}</span>
                      ) : line.startsWith('!') ? (
                        <span className="text-red-400">{line}</span>
                      ) : line.startsWith('AI:') ? (
                        <span className="text-purple-400">{line}</span>
                      ) : (
                        <span>{line}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-[#858585]">Terminal output will appear here. Run your code to see output.</span>
                )}
              </div>
              <div className="h-8 bg-[#252526] border-t border-[#474747] px-2 flex items-center">
                <span className="text-xs text-[#858585]">Terminal</span>
                <input
                  type="text"
                  className="flex-1 ml-2 bg-[#1e1e1e] border border-[#474747] rounded px-2 py-1 text-xs outline-none"
                  placeholder="Enter terminal command..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const command = e.target.value;
                      setTerminalOutput(prev => [...prev, `$ ${command}`]);
                      
                      // Simple command processing
                      if (command === 'clear') {
                        setTerminalOutput([]);
                      } else if (command.startsWith('create ')) {
                        const fileType = command.split(' ')[1];
                        if (['html', 'css', 'js', 'json'].includes(fileType)) {
                          createNewFile(fileType === 'js' ? 'javascript' : fileType);
                        } else {
                          setTerminalOutput(prev => [...prev, `! Error: Unknown file type. Use html, css, js, or json`]);
                        }
                      } else {
                        setTerminalOutput(prev => [...prev, `> Command executed: ${command}`]);
                      }
                      
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;