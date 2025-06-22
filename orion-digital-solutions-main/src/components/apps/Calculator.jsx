import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyDSTgkkROL7mjaGKoD2vnc8l2UptNCbvHk");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('cyber');
  const [scientificMode, setScientificMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.1 } },
    tap: { scale: 0.95 },
    active: { scale: 0.9, backgroundColor: '#ff2d75' }
  };

  // Handle number input
  const handleNumber = (number) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(number);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + number);
    }
  };

  // Handle operator input
  const handleOperator = (operator) => {
    if (display !== 'Error') {
      setShouldResetDisplay(true);
      setEquation(display + ' ' + operator + ' ');
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (display !== 'Error' && display !== '0') {
      if (display.length === 1) {
        setDisplay('0');
      } else {
        setDisplay(display.slice(0, -1));
      }
    }
  };

  // Handle clear
  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldResetDisplay(false);
    setAiResponse('');
  };

  // Calculate result
  const calculateResult = (expr) => {
    // Replace special operators with JavaScript equivalents
    expr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/\^/g, '**')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E');
    
    try {
      // Use Function instead of eval for better security
      const result = new Function('return ' + expr)();
      
      // Handle special cases
      if (!isFinite(result)) {
        return 'Error';
      }
      
      // Format the result
      const formatted = Number(parseFloat(result).toPrecision(12));
      return String(formatted);
    } catch (error) {
      return 'Error';
    }
  };

  // Handle equal
  const handleEqual = () => {
    try {
      const fullEquation = equation + display;
      const result = calculateResult(fullEquation);
      setDisplay(result);
      setEquation('');
      setHistory([...history.slice(-9), { equation: fullEquation, result }]);
    } catch (error) {
      setDisplay('Error');
    }
    setShouldResetDisplay(true);
  };

  // Handle AI calculation
  const handleAiCalculate = async () => {
    if (!aiInput.trim()) return;
    
    try {
      setIsLoading(true);
      setAiResponse('');
      
      // Generate AI response
      const prompt = `Act as an advanced mathematics expert. Solve this problem: ${aiInput}. 
      Provide the following:
      1. Step-by-step solution
      2. Final answer clearly marked
      3. Any relevant explanations
      4. Alternative methods if applicable
      
      Format the response with clear headings and mathematical notation.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setAiResponse(text);
      setHistory([...history.slice(-9), { equation: aiInput, result: text.split('\n')[0] }]);
      setAiInput('');
    } catch (error) {
      setAiResponse('Error: Could not process your request. Please try again.');
      console.error('AI Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scientific functions
  const handleScientificFunction = (func) => {
    setActiveButton(func);
    setTimeout(() => setActiveButton(null), 200);
    
    if (shouldResetDisplay) {
      setDisplay(func + '(');
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + func + '(');
    }
  };

  // Theme colors
  const themes = {
    dark: {
      bg: 'bg-[#1a1b1e]',
      button: 'bg-[#2a2b2e] hover:bg-[#3a3b3e]',
      display: 'bg-[#2a2b2e]',
      text: 'text-white',
      accent: 'bg-purple-600 hover:bg-purple-700',
      accentText: 'text-white',
      panel: 'bg-[#2a2b2e]',
    },
    light: {
      bg: 'bg-gray-100',
      button: 'bg-white hover:bg-gray-200',
      display: 'bg-white',
      text: 'text-gray-800',
      accent: 'bg-blue-500 hover:bg-blue-600',
      accentText: 'text-white',
      panel: 'bg-white',
    },
    cyber: {
      bg: 'bg-[#0f0f1a]',
      button: 'bg-[#1e1e2e] hover:bg-[#2e2e3e]',
      display: 'bg-[#1e1e2e]',
      text: 'text-[#00ff9d]',
      accent: 'bg-[#ff2d75] hover:bg-[#ff3d85]',
      accentText: 'text-white',
      panel: 'bg-[#1e1e2e]',
    },
    matrix: {
      bg: 'bg-black',
      button: 'bg-[#002200] hover:bg-[#003300]',
      display: 'bg-[#001100]',
      text: 'text-[#00ff00]',
      accent: 'bg-[#005500] hover:bg-[#007700]',
      accentText: 'text-[#00ff00]',
      panel: 'bg-[#001100]',
    },
  };

  const currentTheme = themes[theme];

  const buttons = [
    { label: '7', onClick: () => handleNumber('7') },
    { label: '8', onClick: () => handleNumber('8') },
    { label: '9', onClick: () => handleNumber('9') },
    { label: '÷', onClick: () => handleOperator('÷') },
    { label: '4', onClick: () => handleNumber('4') },
    { label: '5', onClick: () => handleNumber('5') },
    { label: '6', onClick: () => handleNumber('6') },
    { label: '×', onClick: () => handleOperator('×') },
    { label: '1', onClick: () => handleNumber('1') },
    { label: '2', onClick: () => handleNumber('2') },
    { label: '3', onClick: () => handleNumber('3') },
    { label: '-', onClick: () => handleOperator('-') },
    { label: '0', onClick: () => handleNumber('0') },
    { label: '.', onClick: () => handleNumber('.') },
    { label: '=', onClick: handleEqual, className: currentTheme.accent },
    { label: '+', onClick: () => handleOperator('+') },
  ];

  const scientificButtons = [
    { label: 'sin', onClick: () => handleScientificFunction('sin') },
    { label: 'cos', onClick: () => handleScientificFunction('cos') },
    { label: 'tan', onClick: () => handleScientificFunction('tan') },
    { label: 'log', onClick: () => handleScientificFunction('log') },
    { label: 'ln', onClick: () => handleScientificFunction('ln') },
    { label: '√', onClick: () => handleScientificFunction('sqrt') },
    { label: '^', onClick: () => handleOperator('^') },
    { label: 'π', onClick: () => handleNumber('π') },
    { label: 'e', onClick: () => handleNumber('e') },
    { label: '(', onClick: () => handleNumber('(') },
    { label: ')', onClick: () => handleNumber(')') },
    { label: '!', onClick: () => handleOperator('!') },
  ];

  // Animation for display change
  const displayVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.bg} ${currentTheme.text} p-4 transition-colors duration-500`}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <motion.h1 
          whileHover={{ scale: 1.02 }}
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          AI Super Calculator
        </motion.h1>
        <div className="flex space-x-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScientificMode(!scientificMode)}
            className={`px-4 py-2 rounded-lg ${currentTheme.accent} ${currentTheme.accentText} shadow-lg`}
          >
            {scientificMode ? 'Basic Mode' : 'Scientific Mode'}
          </motion.button>
          <motion.select 
            whileHover={{ scale: 1.02 }}
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className={`px-3 py-2 rounded-lg ${currentTheme.button} ${currentTheme.text} shadow-md`}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="cyber">Cyber</option>
            <option value="matrix">Matrix</option>
          </motion.select>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
        {/* Calculator main area */}
        <motion.div 
          layout
          className="flex-1 flex flex-col"
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            layout
            className={`${currentTheme.display} rounded-xl p-6 mb-6 shadow-2xl transition-all duration-300`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={equation}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={displayVariants}
                transition={{ duration: 0.2 }}
                className="text-right text-sm text-gray-400 h-6 font-mono"
              >
                {equation}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={display}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={displayVariants}
                transition={{ duration: 0.2 }}
                className="text-right text-5xl font-bold break-all font-mono"
              >
                {display}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              className={`col-span-2 p-4 rounded-xl font-bold text-lg ${currentTheme.accent} ${currentTheme.accentText} shadow-lg`}
              onClick={handleClear}
            >
              Clear
            </motion.button>
            <motion.button
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              className={`col-span-2 p-4 rounded-xl font-bold text-lg ${currentTheme.accent} ${currentTheme.accentText} shadow-lg`}
              onClick={handleDelete}
            >
              Delete
            </motion.button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {buttons.map((button, index) => (
              <motion.button
                key={index}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                animate={activeButton === button.label ? "active" : ""}
                className={`p-4 rounded-xl font-bold text-lg ${button.className || currentTheme.button} shadow-md`}
                onClick={button.onClick}
              >
                {button.label}
              </motion.button>
            ))}
          </div>

          {scientificMode && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 grid grid-cols-5 gap-3"
            >
              {scientificButtons.map((button, index) => (
                <motion.button
                  key={index}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  animate={activeButton === button.label ? "active" : ""}
                  className={`p-3 rounded-xl font-semibold ${currentTheme.button} shadow-md`}
                  onClick={button.onClick}
                >
                  {button.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* AI Panel */}
        <motion.div 
          layout
          className={`flex-1 ${currentTheme.panel} rounded-xl p-6 flex flex-col shadow-2xl transition-all duration-300`}
        >
          <div className="flex items-center mb-6">
            <motion.h2 
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400"
            >
              AI Math Assistant
            </motion.h2>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${aiMode ? 'bg-green-500' : 'bg-red-500'} text-white`}
            >
              {aiMode ? 'ACTIVE' : 'OFFLINE'}
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAiMode(!aiMode)}
              className={`ml-auto px-4 py-2 rounded-lg ${currentTheme.accent} ${currentTheme.accentText} shadow-lg`}
            >
              {aiMode ? 'Disable AI' : 'Enable AI'}
            </motion.button>
          </div>

          {aiMode ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col space-y-4"
              >
                <motion.textarea
                  whileFocus={{ scale: 1.01 }}
                  className={`w-full p-4 rounded-xl ${currentTheme.bg} border ${currentTheme.text} border-gray-600 resize-none shadow-inner`}
                  placeholder="Enter math problem (e.g., 'Solve 2x^2 + 3x - 5 = 0' or 'What is 15% of 200?')"
                  rows={4}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAiCalculate}
                  disabled={isLoading}
                  className={`p-4 rounded-xl font-bold text-lg ${currentTheme.accent} ${currentTheme.accentText} shadow-lg flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Ask AI'
                  )}
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {(aiResponse || isLoading) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 rounded-xl bg-opacity-50 bg-gray-800 overflow-hidden"
                  >
                    <h3 className="font-bold text-lg mb-3">AI Response:</h3>
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap font-mono text-sm">
                        {aiResponse.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 text-center"
            >
              <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">AI Assistant Disabled</h3>
              <p className="text-gray-400">
                Enable AI to solve complex equations, word problems, and get detailed step-by-step explanations.
              </p>
            </motion.div>
          )}

          {/* History Section */}
          <motion.div 
            layout
            className="mt-6 flex-grow overflow-hidden"
          >
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Calculation History
            </h3>
            {history.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-400 italic"
              >
                No calculations yet
              </motion.p>
            ) : (
              <motion.ul 
                layout
                className="space-y-2 max-h-40 overflow-y-auto pr-2"
              >
                <AnimatePresence>
                  {history.slice().reverse().map((item, index) => (
                    <motion.li
                      key={index}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm border-b border-gray-700 pb-2"
                    >
                      <div className="font-mono">
                        <span className="text-gray-400">{item.equation} = </span>
                        <span className="font-bold">{item.result.toString().split('\n')[0]}</span>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </motion.div>
        </motion.div>
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-xs text-gray-500"
      >
        <p>AI Super Calculator © {new Date().getFullYear()} | Powered by Google Gemini AI</p>
        <p className="mt-1">Supports arithmetic, algebra, calculus, statistics, and word problems</p>
      </motion.footer>
    </div>
  );
};

export default Calculator;