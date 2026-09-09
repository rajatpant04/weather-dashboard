import { useState, useEffect } from 'react';
import { Sun, Moon, RefreshCw, MapPin, Heart, HelpCircle } from 'lucide-react';

export const Navbar = ({ 
  darkMode, 
  toggleDarkMode, 
  onRefresh, 
  onLocate, 
  loading,
  favoritesCount = 0,
  onShortcuts
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WeatherDash
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onLocate}
              disabled={loading}
              className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Current Location (L)"
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh (R)"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {onShortcuts && (
              <button
                onClick={onShortcuts}
                className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors text-gray-600 dark:text-gray-300"
                title="Keyboard Shortcuts (?)"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors text-gray-600 dark:text-gray-300"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <a 
              href="#favorites" 
              className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors text-gray-600 dark:text-gray-300"
            >
              <Heart className="w-4 h-4" />
              <span className="font-medium">{favoritesCount}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};