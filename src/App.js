import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState("");
  const [displayText, setDisplayText] = useState("Adaptive learning tools are designed to bridge the gap in neurodivergent education. By adjusting visual stimuli, such as font weight, line spacing, and color overlays, these tools reduce cognitive load. For individuals with ADHD, chunking information into steps prevents overwhelm.");
  
  const [profile, setProfile] = useState('adhd'); 
  const [showRuler, setShowRuler] = useState(true);
  const [showKeywords, setShowKeywords] = useState(false); 
  const [isBionic, setIsBionic] = useState(false);
  const [overlay, setOverlay] = useState('none'); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStimulator, setShowStimulator] = useState(false);
  
  // Nudge States
  const [showNudge, setShowNudge] = useState(false);
  const [nudgePos, setNudgePos] = useState({ x: 0, y: 0 }); 
  const [gazerPos, setGazerPos] = useState({ x: 0, y: 0 });

  const lastLineY = useRef(null);
  const dwellTimer = useRef(null);
  const readingCardRef = useRef(null);

  const targetKeywords = ["adaptive", "learning", "tools", "neurodivergent", "education", "cognitive", "adhd", "dyslexia", "processing", "stimuli", "overwhelm"];

  const handleUpdateText = () => {
    if (inputText.trim()) {
      setDisplayText(inputText);
      setInputText("");
    }
  };

  const toggleProfile = () => {
    if (profile === 'adhd') {
      setProfile('dyslexia'); setIsBionic(true); setOverlay('sepia');
    } else {
      setProfile('adhd'); setIsBionic(false); setOverlay('none');
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(displayText);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setShowNudge(false);
    }
  };

  // LINE-AWARE NUDGE LOGIC: Triggers if mouse stays on same vertical line
  useEffect(() => {
    const handleMove = (e) => {
      setGazerPos({ x: e.clientX, y: e.clientY });
      const rect = readingCardRef.current?.getBoundingClientRect();

      // Detect if cursor is inside the text box
      if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        
        // Define a line as a 50px vertical slot
        const currentLineSlot = Math.floor(e.clientY / 50);

        if (currentLineSlot === lastLineY.current) {
          // If cursor stays on the same vertical line, start timer
          if (!dwellTimer.current && !showNudge && !isSpeaking) {
            dwellTimer.current = setTimeout(() => {
              setNudgePos({ x: e.clientX, y: e.clientY });
              setShowNudge(true);
            }, 5000); // 5 seconds of dwell time
          }
        } else {
          // Reset if user moves to a different line
          clearTimeout(dwellTimer.current);
          dwellTimer.current = null;
          lastLineY.current = currentLineSlot;
          if (showNudge) setShowNudge(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(dwellTimer.current);
    };
  }, [showNudge, isSpeaking]);

  const renderTextEngine = (content) => {
    return content.split(' ').map((word, i) => {
      const cleanWord = word.replace(/[.,!?;:]/g, "").toLowerCase();
      const isKw = showKeywords && targetKeywords.includes(cleanWord);
      const mid = Math.ceil(word.length / 2);
      
      return (
        <span key={`${i}-${showKeywords}-${isBionic}`} className={isKw ? "highlighted-word" : "normal-word"}>
          {isBionic ? (<span><b>{word.slice(0, mid)}</b>{word.slice(mid)}</span>) : word}{' '}
        </span>
      );
    });
  };

  return (
    <div className={`app-root profile-mode-${profile}`}>
      {showStimulator && <div className="focus-stim-bg"></div>}
      
      <div className="filter-overlay" style={{ backgroundColor: 
        overlay === 'mint' ? 'rgba(16, 185, 129, 0.12)' : 
        overlay === 'rose' ? 'rgba(255, 0, 0, 0.12)' : 
        overlay === 'sepia' ? 'rgba(112, 66, 20, 0.18)' : 'transparent' 
      }}></div>
      
      {showRuler && <div className="RULER-FIX" style={{ top: gazerPos.y - 30, left: gazerPos.x - 450 }}></div>}

      {/* FOCUS NUDGE POPUP */}
      {showNudge && (
        <div className="focus-popup-wrapper" style={{ left: nudgePos.x + 20, top: nudgePos.y - 120 }}>
          <div className="focus-popup-content">
            <div className="focus-icon-circle">🧠</div>
            <div className="focus-text-area">
              <h3>Need help?</h3>
              <p>Stuck on this line? I can read this aloud for you.</p>
            </div>
            <div className="focus-actions">
              <button className="btn-primary-glow" onClick={toggleSpeech}>🔊 Yes, Read Aloud</button>
              <button className="btn-ghost" onClick={() => setShowNudge(false)}>I'm okay</button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="header">
          <div className="sync-pill">● NEURO-ADAPTIVE SYNC ACTIVE</div>
          <h1 className="main-title">Adaptive Learning Tool</h1>
        </div>

        <div className="input-section">
          <textarea placeholder="Paste your text here..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
          <button className="update-btn" onClick={handleUpdateText}>Update Material</button>
        </div>

        <div className="toolbar">
          <button className="nav-btn p-btn" onClick={toggleProfile}>{profile === 'adhd' ? '📖 Profile: ADHD' : '🎯 Profile: Dyslexia'}</button>
          <button className={`nav-btn ${showKeywords ? 'active-gold' : ''}`} onClick={() => setShowKeywords(!showKeywords)}>✨ Keywords</button>
          <button className={`nav-btn ${overlay !== 'none' ? 'active' : ''}`} onClick={() => {
            const cycle = ['none', 'mint', 'rose', 'sepia'];
            setOverlay(cycle[(cycle.indexOf(overlay) + 1) % cycle.length]);
          }}>🔍 Filter</button>
          <button className={`nav-btn ${showStimulator ? 'active-purple' : ''}`} onClick={() => setShowStimulator(!showStimulator)}>🌀 Stim</button>
          <button className={`nav-btn ${isBionic ? 'active' : ''}`} onClick={() => setIsBionic(!isBionic)}>👁 Bionic</button>
          <button className={`nav-btn ${showRuler ? 'active' : ''}`} onClick={() => setShowRuler(!showRuler)}>📏 Ruler</button>
          <button className={`nav-btn ${isSpeaking ? 'active-red' : ''}`} onClick={toggleSpeech}>{isSpeaking ? '🛑 Stop' : '🔊 Listen'}</button>
        </div>

        <div className="reading-card" ref={readingCardRef}>
          {renderTextEngine(displayText)}
        </div>
      </div>
    </div>
  );
}

export default App;