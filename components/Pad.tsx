
import React from 'react';

interface ButtonConfig {
  label: string;
  value: string;
  type: 'num' | 'op' | 'func' | 'action' | 'const';
  span?: number;
  highlight?: boolean;
}

interface PadProps {
  onInput: (val: string, type: string) => void;
}

const buttons: ButtonConfig[] = [
  { label: 'AC', value: 'AC', type: 'action' },
  { label: 'DEL', value: 'DEL', type: 'action' },
  { label: '(', value: '(', type: 'num' },
  { label: ')', value: ')', type: 'num' },
  { label: '÷', value: '÷', type: 'op', highlight: true },

  { label: 'sin', value: 'sin(', type: 'func' },
  { label: '7', value: '7', type: 'num' },
  { label: '8', value: '8', type: 'num' },
  { label: '9', value: '9', type: 'num' },
  { label: '×', value: '×', type: 'op', highlight: true },

  { label: 'cos', value: 'cos(', type: 'func' },
  { label: '4', value: '4', type: 'num' },
  { label: '5', value: '5', type: 'num' },
  { label: '6', value: '6', type: 'num' },
  { label: '-', value: '-', type: 'op', highlight: true },

  { label: 'tan', value: 'tan(', type: 'func' },
  { label: '1', value: '1', type: 'num' },
  { label: '2', value: '2', type: 'num' },
  { label: '3', value: '3', type: 'num' },
  { label: '+', value: '+', type: 'op', highlight: true },

  { label: 'log', value: 'log(', type: 'func' },
  { label: '0', value: '0', type: 'num' },
  { label: '.', value: '.', type: 'num' },
  { label: '!', value: '!', type: 'op' },
  { label: '=', value: '=', type: 'action', highlight: true },

  { label: '√', value: 'sqrt(', type: 'func' },
  { label: 'xʸ', value: '^', type: 'op' },
  { label: 'π', value: 'π', type: 'const' },
  { label: 'e', value: 'e', type: 'const' },
  { label: 'DR', value: 'MODE', type: 'action' },
];

export const Pad: React.FC<PadProps> = ({ onInput }) => {
  return (
    <div className="grid grid-cols-5 gap-2 p-6 bg-black border-t border-zinc-900">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={() => onInput(btn.value, btn.type)}
          className={`
            calc-button h-16 rounded-xl flex items-center justify-center text-sm font-bold tracking-wide transition-all
            ${btn.type === 'num' ? 'bg-zinc-900 text-white hover:bg-zinc-800' : ''}
            ${btn.type === 'op' || btn.type === 'func' || btn.type === 'const' ? 'bg-zinc-950 text-blue-500 hover:text-blue-400' : ''}
            ${btn.type === 'action' ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : ''}
            ${btn.value === '=' ? 'bg-blue-600 !text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] border-none' : ''}
            ${btn.value === 'AC' ? '!text-orange-500' : ''}
          `}
        >
          <span className={btn.value === '=' ? 'text-4xl leading-none' : ''}>
            {btn.label}
          </span>
        </button>
      ))}
    </div>
  );
};
