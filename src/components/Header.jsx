import React from 'react';
import { BookOpen, Sun, Heart, Shield, Menu, X } from 'lucide-react';

export default function Header({ view, setView, isMenuOpen, setIsMenuOpen }) {
  
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

  return (
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
}
