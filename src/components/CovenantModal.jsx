import React from 'react';
import { Check } from 'lucide-react';

// Data defined locally to ensure self-contained compilation
const COMMUNITY_COVENANT = [
  "We gather in humility, love, and truth.",
  "We center our conversation on Jesus Christ.",
  "We avoid political debate and doctrinal arguments.",
  "We seek to encourage, not to correct."
];

export default function CovenantModal({ setShowCovenant }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4 text-center">Community Covenant</h2>
        <p className="text-stone-600 mb-6 text-center text-sm">Before you join the conversation, please agree to our core values.</p>
        <div className="bg-stone-50 p-4 rounded-md space-y-3 mb-6">
          {COMMUNITY_COVENANT.map((rule, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <Check size={18} className="text-green-600 mt-0.5 shrink-0" />
              <span className="text-stone-700 text-sm">{rule}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowCovenant(false)}
          className="w-full bg-stone-800 text-white py-3 rounded-lg font-medium hover:bg-stone-700 transition"
        >
          I Agree & Commit
        </button>
      </div>
    </div>
  );
}
