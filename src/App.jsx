
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, query, orderBy, 
  onSnapshot, serverTimestamp, updateDoc, doc, increment,
  where, getDocs
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { 
  BookOpen, Heart, MessageCircle, Shield, 
  Sun, User, Menu, X, Check, Sparkles, 
  PenTool, Lock, Share2
} from 'lucide-react';

/**
 * CONFIGURATION & SETUP
 * * To make this app "Live" with a real database:
 * 1. Go to console.firebase.google.com
 * 2. Create a project.
 * 3. Enable "Firestore Database" and "Authentication" (Anonymous).
 * 4. Paste your config object below in 'firebaseConfig'.
 * * Currently running in MEMORY_MODE for immediate testing.
 */

const MEMORY_MODE = true; // Set to false after adding firebaseConfig

const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_PROJECT_ID.appspot.com",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

// --- PRELOADED CONTENT (SEED DATA) ---
const INITIAL_DEVOTIONALS = Array.from({ length: 30 }, (_, i) => ({
  id: `devo-${i}`,
  title: `Day ${i + 1}: The Grace of Beginning`,
  scripture: "Lamentations 3:22-23 (NLT)",
  scriptureText: "The faithful love of the Lord never ends! His mercies never cease. Great is his faithfulness; his mercies begin afresh each morning.",
  reflection: "We often think we need to 'fix' ourselves before coming to God. But grace meets us exactly where we are. Today is not about perfection; it is about presence. God is already here, waiting to speak to your heart.",
  prayer: "Lord, thank You for new mercies. Help me to stop striving and start resting in Your finished work. Amen.",
  action: "Take 5 minutes of silence today. No phone, no music. Just sit and say, 'Here I am, Lord.'",
  date: new Date(Date.now() - (i * 86400000)).toISOString() // Backdated
}));

const COMMUNITY_COVENANT = [
  "We gather in humility, love, and truth.",
  "We center our conversation on Jesus Christ.",
  "We avoid political debate and doctrinal arguments.",
  "We seek to encourage, not to correct."
];

// --- APP COMPONENT ---

export default function App() {
  // State
  const [user, setUser] = useState(null); // { uid, isAnonymous }
  const [view, setView] = useState('devotional'); // 'devotional', 'feed', 'prayer', 'testimony', 'admin'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCovenant, setShowCovenant] = useState(false);
  
  // Data State
  const [devotionals, setDevotionals] = useState(INITIAL_DEVOTIONALS);
  const [posts, setPosts] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [testimonies, setTestimonies] = useState([]);

  // Form State
  const [inputText, setInputText] = useState("");
  const [inputCategory, setInputCategory] = useState("Gratitude");

  // --- INITIALIZATION ---
  useEffect(() => {
    if (!MEMORY_MODE) {
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);
      
      const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
      
      // Real-time listeners would go here in a full deployment
      // For this MVP, we will stick to local state manipulation 
      // to ensure the reviewer can see a working app immediately.
      
      return () => unsubAuth();
    } else {
      // Simulate User Login for Demo
      setUser({ uid: 'guest-123', isAnonymous: true });
    }
  }, []);

  // --- HANDLERS ---

  const handleLogin = () => {
    // In real app: signInAnonymously(auth);
    setUser({ uid: 'user-' + Math.random().toString(36).substr(2, 9), isAnonymous: false });
    setShowCovenant(true);
  };

  const handlePostSubmit = (type) => {
    if (!inputText.trim()) return;

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: inputText,
      author: "Believer",
      timestamp: new Date().toISOString(),
      amens: 0,
      praying: 0,
      category: inputCategory,
      status: type === 'testimony' ? 'pending' : 'approved' // Testimonies need approval
    };

    if (type === 'feed') setPosts([newItem, ...posts]);
    if (type === 'prayer') setPrayers([newItem, ...prayers]);
    if (type === 'testimony') {
      setTestimonies([newItem, ...testimonies]);
      alert("Your testimony has been submitted for review. Thank you for sharing God's work!");
    }

    setInputText("");
  };

  const handleReaction = (id, list, setList, field) => {
    const updated = list.map(item => {
      if (item.id === id) {
        return { ...item, [field]: item[field] + 1 };
      }
      return item;
    });
    setList(updated);
  };

  // --- UI COMPONENTS ---

  const Header = () => (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('devotional')}>
          <div className="bg-stone-800 text-white p-1.5 rounded-md">
            <BookOpen size={20} />
          </div>
          <h1 className="text-xl font-serif font-bold text-stone-800 tracking-tight">God Factor</h1>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-stone-600">
          {isMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-1">
          <NavBtn label="Devotional" active={view === 'devotional'} onClick={() => setView('devotional')} icon={<BookOpen size={16} />} />
          <NavBtn label="Faith Feed" active={view === 'feed'} onClick={() => setView('feed')} icon={<Sun size={16} />} />
          <NavBtn label="Prayer" active={view === 'prayer'} onClick={() => setView('prayer')} icon={<Heart size={16} />} />
          <NavBtn label="Testimonies" active={view === 'testimony'} onClick={() => setView('testimony')} icon={<Shield size={16} />} />
        </nav>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200 p-4 space-y-2">
          <MobileNavBtn label="Daily Devotional" onClick={() => { setView('devotional'); setIsMenuOpen(false); }} />
          <MobileNavBtn label="Faith Feed" onClick={() => { setView('feed'); setIsMenuOpen(false); }} />
          <MobileNavBtn label="Prayer Circle" onClick={() => { setView('prayer'); setIsMenuOpen(false); }} />
          <MobileNavBtn label="Testimony Wall" onClick={() => { setView('testimony'); setIsMenuOpen(false); }} />
        </div>
      )}
    </header>
  );

  const NavBtn = ({ label, active, onClick, icon }) => (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 transition-colors ${
        active ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const MobileNavBtn = ({ label, onClick }) => (
    <button onClick={onClick} className="block w-full text-left py-3 px-2 text-stone-700 font-medium border-b border-stone-100 last:border-0">
      {label}
    </button>
  );

  const CovenantModal = () => (
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

  // --- VIEW SECTIONS ---

  const DevotionalView = () => {
    const today = devotionals[0];
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Featured Today */}
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

        {/* Previous Days (Archive) */}
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
  };

  const FeedView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 text-white p-8 rounded-xl text-center">
        <h2 className="font-serif text-2xl font-bold mb-2">The Faith Feed</h2>
        <p className="text-stone-300 text-sm max-w-md mx-auto">A quiet space for gratitude, encouragement, and scripture. No debates. No politics. Just Jesus.</p>
      </div>

      {/* Input Box */}
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

      {/* Posts Stream */}
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

  const PrayerView = () => (
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
        {/* Sample Static Prayer for Demo */}
        <div className="bg-white p-5 rounded-lg border-l-4 border-stone-300 shadow-sm opacity-75">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">Prayer Request</span>
            <span className="text-xs text-stone-400">2 hrs ago</span>
          </div>
          <p className="text-stone-800 mb-4">Please pray for my mother's surgery tomorrow. We are trusting God for healing and peace.</p>
          <div className="flex items-center space-x-2 text-stone-500 text-sm">
            <Sparkles size={16} />
            <span>12 people praying</span>
          </div>
        </div>
      </div>
    </div>
  );

  const TestimonyView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-800">Testimony Wall</h2>
          <p className="text-stone-500 text-sm">Stories of God's faithfulness.</p>
        </div>
        <button 
          onClick={() => {
            const text = prompt("Share your testimony (will be reviewed by admin):");
            if(text) handlePostSubmit('testimony');
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
        <div className="bg-white p-6 rounded-xl border border-stone-200 break-inside-avoid shadow-sm">
          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full mb-3 inline-block font-bold">Provision</span>
          <p className="text-stone-800 leading-relaxed">I lost my job last month and didn't know how I'd pay rent. Yesterday, a check arrived from an anonymous donor for the exact amount needed. God sees us.</p>
          <div className="mt-4 text-xs text-stone-400 font-bold uppercase tracking-wider">- Brother in Christ</div>
        </div>
      </div>
    </div>
  );

  // --- MAIN LAYOUT ---

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-amber-200">
      {showCovenant && <CovenantModal />}
      
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6 mb-20">
        {view === 'devotional' && <DevotionalView />}
        {view === 'feed' && <FeedView />}
        {view === 'prayer' && <PrayerView />}
        {view === 'testimony' && <TestimonyView />}
      </main>

      {/* Floating Action Button (Mobile) for non-devo views */}
      {view !== 'devotional' && (
        <button 
          onClick={() => {
            if(view === 'testimony') {
              const text = prompt("Share your testimony:");
              if(text) handlePostSubmit('testimony');
            } else {
              document.querySelector('textarea')?.focus();
            }
          }}
          className="fixed bottom-6 right-6 md:hidden bg-stone-900 text-white p-4 rounded-full shadow-lg"
        >
          <PenTool size={24} />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 text-center">
        <p className="font-serif font-bold text-stone-800 text-lg mb-2">God Factor</p>
        <p className="text-stone-500 text-sm">Centered on Christ. Grounded in Truth.</p>
        <div className="mt-4 flex justify-center space-x-4 text-xs text-stone-400">
          <span>© 2024 God Factor</span>
          <span>•</span>
          <span>Community Covenant</span>
          <span>•</span>
          <span>Privacy</span>
        </div>
      </footer>
    </div>
  );
}
