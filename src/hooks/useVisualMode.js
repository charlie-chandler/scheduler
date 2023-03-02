import { useState } from "react";

function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  /// Transition to new mode
  function transition(newMode, replace = false) {
    if (replace) {
      setMode(newMode);
      setHistory(prev => [...prev.slice(0, prev.length - 1), newMode]);
    } else {
      setMode(newMode);
      history.push(newMode);
    }
  };

  /// Go back one mode
  function back() {
    if (history.length <= 1) {
      return;
    } else {
      history.pop();
      let lastIndex = history.length - 1;
      setMode(history[lastIndex]);
    }
  };

  return { mode, transition, back };
};


export default useVisualMode;