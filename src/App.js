import React, { useState, useEffect } from 'react';
import './App.css';
import { Eye, Type, PlusCircle, Highlighter, Wand2, Target, Palette, Volume2, AlignCenter, RotateCcw } from 'lucide-react';

function App() {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [displayContent, setDisplayContent] = useState("Saudi forces intercepted a drone targeting Riyadh's Diplomatic Quarter housing foreign embassies.");
  
  // States for all features
  const [isBionic, setIsBionic] = useState(false);
  const [isDyslexiaFont, setIsDyslexiaFont] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [isFocusPattern, setIsFocusPattern] = useState(false);
  const [wideSpacing, setWideSpacing] = useState(false);
  const [overlayColor, setOverlayColor] = useState("transparent");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  // 1. Progress Bar Logic
  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxHeight > 0 ? (scrolled / maxHeight) * 100 : 0);
    };
    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // 2. Mouse Tracking for Focus Beam
  useEffect(() => {
    const handleMove = (e) => setMouseY(e.clientY);
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // 3. Listen (Text to Speech)
  const speak = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(displayContent);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 4. Simplify Text
  const simplifyText = () => {
    const dictionary = {
      "intercepted": "stopped", "housing": "where there are", "diplomatic quarter": "area for officials",
      "targeting": "aiming at", "forces": "military teams", "fundamental": "basic", "utilize": "use"
    };
    let newText = displayContent;
    Object.keys(dictionary).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      newText = newText.replace(regex, dictionary[key]);
    });
    setDisplayContent(newText);
  };

  const processContent = (text) => {
    if (!text) return "";
    return text.split(' ').map((word, i) => {
      const cleanWord = word.replace(/[^a-zA-Z]/g, "");
      const isMatch = isHighlighting && (cleanWord.length > 7 || ["drone", "riyadh"].includes(cleanWord.toLowerCase()));
      let content = isBionic ? (
        <span key={i}><b>{word.slice(0, Math.ceil(word.length/2))}</b>{word.slice(Math.ceil(word.length/2))} </span>
      ) : (
        <span key={i}>{word} </span>
      );
      return isMatch ? <mark key={i}>{content}</mark> : content;
    });
  };

  return (
    <div className={`app-container ${isDyslexiaFont ? 'dyslexia-font' : ''} ${wideSpacing ? 'wide-spacing' : ''} ${isFocusPattern ? 'focus-mode-active' : ''}`}>
      
      {/* Progress Bar UI */}
      <div className="progress-container"><div className="progress-bar" style={{ width: `${scrollProgress}%` }} /></div>

      {/* Color Overlay Filter */}
      <div className="contrast-overlay" style={{ backgroundColor: overlayColor }} />

      <header className="app-header">
        <h1>Adaptive Learning Assistant</h1>
        <div className="controls">
          <button className="btn-toggle primary" onClick={() => setIsCustomMode(true)}><PlusCircle size={16} /> Paste</button>
          <button className="btn-toggle listen-btn" onClick={speak}><Volume2 size={16} /> Listen</button>
          <button className={`btn-toggle ${isFocusPattern ? 'active pulse' : ''}`} onClick={() => setIsFocusPattern(!isFocusPattern)}><Target size={16} /> Focus Pattern</button>
          <button className={`btn-toggle ${isDyslexiaFont ? 'active' : ''}`} onClick={() => setIsDyslexiaFont(!isDyslexiaFont)}><Type size={16} /> Font</button>
          <button className={`btn-toggle ${wideSpacing ? 'active' : ''}`} onClick={() => setWideSpacing(!wideSpacing)}><AlignCenter size={16} /> Spacing</button>
          <button className={`btn-toggle ${isHighlighting ? 'active' : ''}`} onClick={() => setIsHighlighting(!isHighlighting)}><Highlighter size={16} /> Highlight</button>
          <button className="btn-toggle simplify-btn" onClick={simplifyText}><Wand2 size={16} /> Simplify</button>
          
          <div className="select-wrapper">
            <Palette size={16} className="select-icon" />
            <select className="btn-toggle select-box" onChange={(e) => setOverlayColor(e.target.value)}>
              <option value="transparent">Filter</option>
              <option value="rgba(255, 255, 0, 0.15)">Yellow</option>
              <option value="rgba(0, 255, 255, 0.15)">Cyan</option>
              <option value="rgba(255, 192, 203, 0.2)">Pink</option>
            </select>
          </div>
          
          <button className={`btn-toggle ${isBionic ? 'active' : ''}`} onClick={() => setIsBionic(!isBionic)}><Eye size={16} /> Bionic</button>
        </div>
      </header>

      // Inside your App() function, update the return statement:

// Replace your existing return statement for the lesson-card with this:
<main className="content-area">
  {isCustomMode ? (
    <div className="input-box">
      <textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Paste text..." />
      <button className="process-btn" onClick={() => { setDisplayContent(userInput); setIsCustomMode(false); }}>Start Reading</button>
    </div>
  ) : (
    <div className="lesson-card-wrapper"> {/* New Wrapper for alignment */}
      <div className="lesson-card">
        {isFocusPattern && (
          <div 
            className="reading-beam" 
            style={{ 
              top: `${mouseY}px`, // This will now be handled by 'fixed' but clipped
            }} 
          />
        )}
        <div className="text-display">{processContent(displayContent)}</div>
      </div>
    </div>
  )}
</main>

      {/* Overlays for Focus Stimulation */}
      {isFocusPattern && (
        <>
          <div className="focus-grid-stimulation" />
          <div className="reading-beam" style={{ top: `${mouseY}px` }} />
        </>
      )}
    </div>
  );
}

export default App;
