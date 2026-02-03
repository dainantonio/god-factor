import React from 'react';

export default function TestimonyView({ testimonies, handlePostSubmit }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-800">Testimony Wall</h2>
          <p className="text-stone-500 text-sm">Stories of God's faithfulness.</p>
        </div>
        <button 
          onClick={() => {
            const text = prompt("Share your testimony (will be reviewed by admin):");
            if(text && text.trim()) handlePostSubmit('testimony', text);
          }}
          className="text-stone-800 text-sm font-bold underline decoration-2 decoration-amber-400 underline-offset-4"
        >
          Submit Yours
        </button>
      </div>

      <div className="columns-1 md:columns-2 gap-4 space-y-4">
        {testimonies.filter(t => t.status === 'approved').map(t => (
           <div key={t.id} className="bg-white p-6 rounded-xl border border-stone-200 break-inside-avoid">
             <span className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full mb-3 inline-block">{t.category}</span>
             <p className="text-stone-800 leading-relaxed">{t.text}</p>
             <div className="mt-4 text-xs text-stone-400 font-bold uppercase tracking-wider">- Anonymous</div>
           </div>
        ))}
        {/* Static Sample Data */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 break-inside-avoid shadow-sm">
          <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full mb-3 inline-block font-bold">Healing</span>
          <p className="text-stone-800 leading-relaxed">I was diagnosed with a chronic condition three years ago. Last week, the doctors couldn't find a trace of it. Jehovah Rapha is still healing today!</p>
          <div className="mt-4 text-xs text-stone-400 font-bold uppercase tracking-wider">- Sister in Texas</div>
        </div>
      </div>
    </div>
  );
}
