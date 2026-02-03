import React from 'react';
import { User, Heart } from 'lucide-react';

export default function FeedView({ posts, setPosts, handleReaction, handlePostSubmit, inputText, setInputText, inputCategory, setInputCategory }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 text-white p-8 rounded-xl text-center">
        <h2 className="font-serif text-2xl font-bold mb-2">The Faith Feed</h2>
        <p className="text-stone-300 text-sm max-w-md mx-auto">A quiet space for gratitude, encouragement, and scripture.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Share a verse or something you are grateful for..."
          className="w-full p-3 bg-stone-50 rounded-lg border-none focus:ring-1 focus:ring-stone-300 resize-none h-24 text-stone-700"
        />
        <div className="flex justify-between items-center mt-3">
          <select 
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
            className="text-xs bg-white border border-stone-200 rounded-md py-1 px-2 text-stone-600"
          >
            <option>Gratitude</option>
            <option>Encouragement</option>
            <option>Scripture</option>
          </select>
          <button 
            onClick={() => handlePostSubmit('feed')}
            className="bg-stone-800 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-stone-700"
          >
            Post
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center py-12 text-stone-400 italic">
            Be the first to share something encouraging today.
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center text-stone-500">
                <User size={14} />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-800 block">Believer</span>
                <span className="text-xs text-stone-400">{new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {post.category}</span>
              </div>
            </div>
            <p className="text-stone-700 mb-4">{post.text}</p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => handleReaction(post.id, posts, setPosts, 'amens')}
                className="text-stone-500 hover:text-stone-800 text-sm flex items-center space-x-1"
              >
                <Heart size={16} className={post.amens > 0 ? "fill-stone-800 text-stone-800" : ""} />
                <span>{post.amens > 0 ? `${post.amens} Amens` : "Amen"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
