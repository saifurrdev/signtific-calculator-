
import React, { useState, useEffect, useCallback } from 'react';
import { Display } from './components/Display';
import { Pad } from './components/Pad';
import { AngleMode, CalculatorState } from './types';
import { MathEngine } from './services/mathEngine';

interface AppState extends CalculatorState {
  history: string[];
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    expression: '',
    result: null,
    mode: AngleMode.DEG,
    error: null,
    history: []
  });

  const handleCalculate = useCallback(() => {
    if (!state.expression) return;
    try {
      const numericResult = MathEngine.evaluate(state.expression, state.mode);
      const formatted = MathEngine.formatResult(numericResult);
      setState(prev => ({
        ...prev,
        result: formatted,
        error: null,
        history: [...prev.history, `${prev.expression} = ${formatted}`].slice(-30)
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || 'Error',
        result: null
      }));
    }
  }, [state.expression, state.mode]);

  const handleInput = useCallback((val: string, type: string) => {
    setState(prev => {
      if (val === 'AC') {
        return { ...prev, expression: '', result: null, error: null };
      }

      if (val === 'DEL') {
        if (prev.error || prev.result) return { ...prev, expression: '', result: null, error: null };
        return { ...prev, expression: prev.expression.slice(0, -1), error: null };
      }

      if (val === 'MODE') {
        return { ...prev, mode: prev.mode === AngleMode.DEG ? AngleMode.RAD : AngleMode.DEG };
      }

      if (val === '=') {
        handleCalculate();
        return prev;
      }

      let nextExpression = prev.expression;

      if (prev.result) {
        if (type === 'op') {
          nextExpression = prev.result + val;
        } else {
          nextExpression = val;
        }
        return { ...prev, expression: nextExpression, result: null, error: null };
      }

      if (prev.error) {
        return { ...prev, expression: val, error: null, result: null };
      }

      return { ...prev, expression: nextExpression + val };
    });
  }, [handleCalculate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/[0-9.]/.test(key)) handleInput(key, 'num');
      else if (key === '+') handleInput('+', 'op');
      else if (key === '-') handleInput('-', 'op');
      else if (key === '*') handleInput('×', 'op');
      else if (key === '/') handleInput('÷', 'op');
      else if (key === 'Enter') handleInput('=', 'action');
      else if (key === 'Backspace') handleInput('DEL', 'action');
      else if (key === 'Escape') handleInput('AC', 'action');
      else if (key === '^') handleInput('^', 'op');
      else if (key === '(' || key === ')') handleInput(key, 'num');
      else if (key === '!') handleInput('!', 'op');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  return (
    <div className="flex flex-col w-full h-screen bg-black select-none font-sans overflow-hidden">
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full min-h-0">
        <Display 
          expression={state.expression} 
          result={state.result} 
          error={state.error}
          mode={state.mode}
          history={state.history}
        />
        <div className="shrink-0">
          <Pad onInput={handleInput} />
        </div>
        <div className="pb-4 pt-2 shrink-0 text-center text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em]">
          Scientific Logic System v2.0
        </div>
      </div>
    </div>
  );
};

export default App;
