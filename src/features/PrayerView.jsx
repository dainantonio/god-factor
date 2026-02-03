import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PrayerView({ prayers, setPrayers, handleReaction, handlePostSubmit, inputText, setInputText }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <h2 className="font-serif text-2xl font-bold text-stone-800">Prayer Circle</h2>
        <p className="text-stone-500 text-sm">Bear one another's burdens.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="bg-amber-100 p-2 rounded-full text-amber-600">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="How can we pray for you today?"
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-stone-700 placeholder:text-stone-400 h-20 resize-none"
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => handlePostSubmit('prayer')}
                className="bg-amber-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-amber-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {prayers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-stone-400 text-sm">No requests yet. The circle is open.</p>
          </div>
        )}
        {prayers.map((prayer) => (
          <div key={prayer.id} className="bg-white p-5 rounded-lg border-l-4 border-amber-500 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Prayer Request</span>
              <span className="text-xs text-stone-400">Just now</span>
            </div>
            <p className="text-stone-800 mb-4">{prayer.text}</p>
            <button 
              onClick={() => handleReaction(prayer.id, prayers, setPrayers, 'praying')}
              className={`w-full py-2 rounded-md text-sm font-medium transition flex items-center justify-center space-x-2 ${
                prayer.praying > 0 ? "bg-amber-50 text-amber-700" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Sparkles size={16} />
              <span>{prayer.praying > 0 ? `${prayer.praying} Praying` : "I'm Praying"}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
