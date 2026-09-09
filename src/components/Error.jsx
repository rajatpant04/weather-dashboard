import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export const Error = ({ message, onRetry, onHome }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 animate-fade-in">
    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
      <AlertTriangle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{message}</p>
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
      {onHome && (
        <button
          onClick={onHome}
          className="flex-1 px-4 py-3 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-600/50 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border border-white/20 dark:border-gray-700/20"
        >
          <Home className="w-4 h-4" />
          Home
        </button>
      )}
    </div>
  </div>
);

export const InlineError = ({ message, onDismiss }) => (
  <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-slide-up">
    <FiAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
    <p className="text-red-700 dark:text-red-300 flex-1 text-sm">{message}</p>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-red-500 hover:text-red-700 dark:hover:text-red-300 transition-colors"
      >
        ✕
      </button>
    )}
  </div>
);