import React from 'react';
import { BookOpen, Sparkles, Sun, Share2 } from 'lucide-react';

export default function DevotionalView({ devotionals }) {
  const today = devotionals[0];
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-stone-100 p-3 text-center border-b border-stone-200">
          <span className="text-xs font-bold tracking-widest text-stone-500 uppercase">Today's Word</span>
        </div>
        <div className="p-6 md:p-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-800 mb-2">{today.title}</h2>
          <p className="text-stone-500 text-sm mb-6">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="bg-stone-50 border-l-4 border-stone-300 p-6 mb-8 italic text-stone-700 font-serif text-lg leading-relaxed">
            "{today.scriptureText}"
            <div className="mt-2 text-sm font-bold not-italic text-stone-500">— {today.scripture}</div>
          </div>

          <div className="prose prose-stone max-w-none text-stone-700 leading-8 mb-8">
            {today.reflection}
          </div>

          <div className="bg-stone-900 text-stone-100 p-6 rounded-lg mb-6">
            <div className="flex items-center space-x-2 mb-2 text-stone-400 text-xs uppercase tracking-wider font-bold">
              <Sparkles size={14} />
              <span>Today's Prayer</span>
            </div>
            <p className="font-serif text-lg">{today.prayer}</p>
          </div>

          <div className="flex items-start space-x-3 text-stone-600 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <Sun className="shrink-0 text-amber-500" size={20} />
            <div>
              <span className="font-bold text-stone-800 text-sm block mb-1">Action Step</span>
              <span className="text-sm">{today.action}</span>
            </div>
          </div>
        </div>
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex justify-between items-center">
          <button className="text-stone-500 text-sm flex items-center space-x-2 hover:text-stone-800">
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button className="text-stone-500 text-sm flex items-center space-x-2 hover:text-stone-800">
            <BookOpen size={16} />
            <span>Read Full Chapter</span>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-serif font-bold text-stone-800 mt-12 px-2">Previous Devotionals</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {devotionals.slice(1, 7).map((devo) => (
          <div key={devo.id} className="bg-white p-6 rounded-lg border border-stone-200 hover:shadow-md transition cursor-pointer">
            <span className="text-xs text-stone-400 font-bold uppercase">{devo.id.replace('devo-', 'Day ')}</span>
            <h4 className="font-serif font-bold text-lg text-stone-800 mb-2">{devo.title}</h4>
            <p className="text-stone-600 text-sm line-clamp-2">{devo.scriptureText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
