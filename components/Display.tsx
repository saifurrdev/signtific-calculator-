
import React, { useRef, useEffect } from 'react';

interface DisplayProps {
  expression: string;
  result: string | null;
  error: string | null;
  mode: string;
  history: string[];
}

export const Display: React.FC<DisplayProps> = ({ expression, result, error, mode, history }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  return (
    <div className="bg-black p-8 md:p-12 flex flex-col items-end justify-end flex-grow min-h-0 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full -mr-64 -mt-64 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full -ml-48 -mb-48 blur-[120px] pointer-events-none"></div>
      
      <div className="w-full flex justify-between items-center mb-6 z-10 shrink-0">
        <div className="flex gap-2">
          <button className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] transition-all border ${mode === 'DEG' ? 'bg-white border-white text-black' : 'border-zinc-800 text-zinc-600'}`}>DEG</button>
          <button className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] transition-all border ${mode === 'RAD' ? 'bg-white border-white text-black' : 'border-zinc-800 text-zinc-600'}`}>RAD</button>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`}></div>
          <span className="text-[10px] font-bold text-zinc-600 tracking-[0.2em] uppercase">{error ? 'System Fault' : 'Ready'}</span>
        </div>
      </div>
      
      {/* History Tape - Now with flex-shrink to prevent pushing down UI */}
      <div 
        ref={scrollRef}
        className="w-full flex flex-col items-end opacity-20 mb-4 overflow-y-auto flex-grow flex-shrink basis-0 scroll-smooth hide-scrollbar mask-fade-top"
      >
        {history.map((item, idx) => (
          <div key={idx} className="text-sm font-medium text-zinc-400 mono py-1 whitespace-nowrap animate-in fade-in slide-in-from-right-8 duration-700">
            {item}
          </div>
        ))}
      </div>

      <div className="w-full overflow-x-auto hide-scrollbar text-right z-10 mb-2 shrink-0">
        <div className="text-zinc-500 text-2xl font-light tracking-tight mono whitespace-nowrap min-h-[2rem]">
          {expression || ' '}
        </div>
      </div>
      
      <div className="w-full overflow-x-auto hide-scrollbar text-right z-10 shrink-0">
        <div className={`text-5xl md:text-7xl font-semibold tracking-tighter mono transition-all duration-300 ${error ? 'text-red-600' : 'text-white'}`}>
          {error ? 'ERR' : (result || '0')}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .mask-fade-top {
          mask-image: linear-gradient(to bottom, transparent, black 40%);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 40%);
        }
      `}} />
    </div>
  );
};
