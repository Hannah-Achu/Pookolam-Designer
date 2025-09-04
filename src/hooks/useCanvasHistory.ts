/*import { useState, useCallback } from 'react';
import { CanvasState, CanvasHistory } from '../types';

export const useCanvasHistory = (initialState: CanvasState) => {
  const [history, setHistory] = useState<CanvasHistory>({
    states: [initialState],
    currentIndex: 0,
  });

  const [currentState, setCurrentState] = useState<CanvasState>(initialState);

  const saveState = useCallback(() => {
    setHistory(prev => {
      const newStates = prev.states.slice(0, prev.currentIndex + 1);
      newStates.push(currentState);
      
      // Limit history to 50 states
      if (newStates.length > 50) {
        newStates.shift();
        return {
          states: newStates,
          currentIndex: newStates.length - 1,
        };
      }
      
      return {
        states: newStates,
        currentIndex: newStates.length - 1,
      };
    });
  }, [currentState]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.currentIndex > 0) {
        const newIndex = prev.currentIndex - 1;
        setCurrentState(prev.states[newIndex]);
        return {
          ...prev,
          currentIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.currentIndex < prev.states.length - 1) {
        const newIndex = prev.currentIndex + 1;
        setCurrentState(prev.states[newIndex]);
        return {
          ...prev,
          currentIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const updateState = useCallback((newState: CanvasState) => {
    setCurrentState(newState);
  }, []);

  const canUndo = history.currentIndex > 0;
  const canRedo = history.currentIndex < history.states.length - 1;

  return {
    currentState,
    updateState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};*/

import { useState, useCallback } from 'react';
import { CanvasState, CanvasHistory } from '../types';

export const useCanvasHistory = (initialState: CanvasState) => {
  const [history, setHistory] = useState<CanvasHistory>({
    states: [initialState],
    currentIndex: 0,
  });

  const [currentState, setCurrentState] = useState<CanvasState>(initialState);

  const saveState = useCallback(
    (newState?: CanvasState) => {
      setHistory((prev: CanvasHistory): CanvasHistory => {
        const stateToSave = newState ?? currentState;

        if (
          JSON.stringify(prev.states[prev.currentIndex]) ===
          JSON.stringify(stateToSave)
        ) {
          return prev;
        }

        const newStates = prev.states.slice(0, prev.currentIndex + 1);
        newStates.push(stateToSave);

        if (newStates.length > 50) {
          newStates.shift();
        }

        return {
          states: newStates,
          currentIndex: newStates.length - 1,
        };
      });

      if (newState) {
        setCurrentState(newState);
      }
    },
    [currentState]
  );

  const undo = useCallback(() => {
    setHistory((prev: CanvasHistory): CanvasHistory => {
      if (prev.currentIndex > 0) {
        const newIndex = prev.currentIndex - 1;
        setCurrentState(prev.states[newIndex]);
        return { ...prev, currentIndex: newIndex };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev: CanvasHistory): CanvasHistory => {
      if (prev.currentIndex < prev.states.length - 1) {
        const newIndex = prev.currentIndex + 1;
        setCurrentState(prev.states[newIndex]);
        return { ...prev, currentIndex: newIndex };
      }
      return prev;
    });
  }, []);

  const updateState = useCallback(
    (newState: CanvasState) => {
      setCurrentState(newState);
      saveState(newState);
    },
    [saveState]
  );

  const canUndo = history.currentIndex > 0;
  const canRedo = history.currentIndex < history.states.length - 1;

  return {
    currentState,
    updateState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
