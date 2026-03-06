import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ phase }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getPhaseBadge = () => {
    switch(phase) {
      case 'pre-event': return <span className="bg-gray-800 text-gray-300 border border-gray-600 px-2 py-1 rounded text-xs ml-3 font-semibold">Pre-Event</span>;
      case 'day1': return <span className="bg-green-900/50 text-green-400 border border-green-700 px-2 py-1 rounded text-xs ml-3 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>Day 1 Live</span>;
      case 'day2': return <span className="bg-blue-900/50 text-blue-400 border border-blue-700 px-2 py-1 rounded text-xs ml-3 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>Day 2 Live</span>;
      case 'day3': return <span className="bg-purple-900/50 text-purple-400 border border-purple-700 px-2 py-1 rounded text-xs ml-3 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>Day 3 Live</span>;
      case 'results': return <span className="bg-yellow-900/50 text-[var(--color-gold-light)] border border-[var(--color-gold-primary)] px-2 py-1 rounded text-xs ml-3 font-semibold">Results Mode</span>;
      default: return null;
    }
  };

  const navLinks = [
    { name: 'Problem Statements', sectionId: 'problems' },
    { name: 'Teams', sectionId: 'teams' },
    { name: 'Judges', sectionId: 'judges' },
    { name: 'Results', sectionId: 'results' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-navy-mid)]/90 backdrop-blur-md border-b border-[var(--color-gold-primary)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-gold-primary)] to-[var(--color-gold-light)]">
                IAR UDAAN HACKFEST 2026
              </span>
              {getPhaseBadge()}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/register"
                className="bg-[var(--color-gold-primary)] hover:bg-[var(--color-gold-light)] text-[var(--color-navy-primary)] px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Register
              </Link>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.sectionId)}
                  className="text-gray-300 hover:text-[var(--color-gold-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <Link
                to="/admin"
                className="text-gray-300 hover:text-[var(--color-gold-primary)] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[var(--color-navy-soft)] focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-navy-mid)] border-b border-[var(--color-gold-primary)]/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-[var(--color-gold-primary)] text-[var(--color-navy-primary)] block px-3 py-2 rounded-md text-base font-bold mb-2"
              >
                Register
              </Link>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.sectionId)}
                  className="text-gray-300 hover:text-[var(--color-gold-primary)] block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.name}
                </button>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-[var(--color-gold-primary)] block px-3 py-2 rounded-md text-base font-medium"
              >
                Admin
              </Link>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
