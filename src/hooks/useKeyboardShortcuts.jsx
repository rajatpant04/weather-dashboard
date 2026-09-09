import { useEffect } from 'react';

export const useKeyboardShortcuts = ({ 
  onSearch, 
  onToggleDarkMode, 
  onToggleUnit, 
  onRefresh, 
  onLocate 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }

      // Ctrl/Cmd + K - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearch?.();
        return;
      }

      // D - Toggle dark mode
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onToggleDarkMode?.();
        return;
      }

      // U - Toggle units
      if (e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        onToggleUnit?.();
        return;
      }

      // R - Refresh
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRefresh?.();
        return;
      }

      // L - Locate me
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        onLocate?.();
        return;
      }

      // Escape - Close dropdowns/modals
      if (e.key === 'Escape') {
        // Handled by components
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onToggleDarkMode, onToggleUnit, onRefresh, onLocate]);
};

export const KeyboardShortcutsHelp = ({ onClose }) => (
  <div className="fixed bottom-4 right-4 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-4 shadow-xl animate-slide-up">
    <div className="flex items-center justify-between mb-3">
      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-mono text-blue-600 dark:text-blue-400">?</span>
        Keyboard Shortcuts
      </h4>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
    <dl className="grid grid-cols-[auto_1fr] gap-2 text-sm">
      <dt className="font-mono px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">⌘K</dt>
      <dd className="text-gray-600 dark:text-gray-400">Focus search</dd>
      <dt className="font-mono px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">D</dt>
      <dd className="text-gray-600 dark:text-gray-400">Toggle dark mode</dd>
      <dt className="font-mono px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">U</dt>
      <dd className="text-gray-600 dark:text-gray-400">Toggle °C/°F</dd>
      <dt className="font-mono px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">R</dt>
      <dd className="text-gray-600 dark:text-gray-400">Refresh weather</dd>
      <dt className="font-mono px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">L</dt>
      <dd className="text-gray-600 dark:text-gray-400">My location</dd>
      <dt className="font-mono px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">Esc</dt>
      <dd className="text-gray-600 dark:text-gray-400">Close dropdowns</dd>
    </dl>
  </div>
);