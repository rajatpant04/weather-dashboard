import { AlertTriangle, X, Bell } from 'lucide-react';

const ALERT_COLORS = {
  red: 'bg-red-500/20 border-red-500/30 text-red-400 dark:text-red-300',
  orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400 dark:text-orange-300',
  yellow: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400 dark:text-yellow-300',
  blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400 dark:text-blue-300',
};

const ALERT_ICONS = {
  red: <AlertTriangle className="w-5 h-5" />,
  orange: <AlertTriangle className="w-5 h-5" />,
  yellow: <Bell className="w-5 h-5" />,
  blue: <Bell className="w-5 h-5" />,
};

export const WeatherAlerts = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="animate-slide-up mb-6" role="region" aria-label="Weather alerts">
      {alerts.map((alert, index) => (
        <div
          key={`${alert.event}-${index}`}
          className={`flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm ${ALERT_COLORS[alert.level] || ALERT_COLORS.yellow} relative`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {ALERT_ICONS[alert.level] || ALERT_ICONS.yellow}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-lg">{alert.event}</h4>
              <button
                onClick={() => onDismiss?.(index)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1 text-sm opacity-90">{alert.description}</p>
            {alert.instruction && (
              <p className="mt-2 text-sm font-medium opacity-80">💡 {alert.instruction}</p>
            )}
            <div className="mt-2 flex items-center gap-3 text-xs opacity-70 flex-wrap">
              <span>Severity: <strong>{alert.severity}</strong></span>
              <span>Urgency: <strong>{alert.urgency}</strong></span>
              <span>Certainty: <strong>{alert.certainty}</strong></span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AlertBanner = ({ alertCount, onClick }) => {
  if (!alertCount) return null;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all animate-pulse-slow"
      aria-label={`${alertCount} weather alert${alertCount > 1 ? 's' : ''} - tap to view`}
    >
      <AlertTriangle className="w-5 h-5 animate-bounce" />
      <span>{alertCount} Weather Alert{alertCount > 1 ? 's' : ''} Active</span>
      <Bell className="w-5 h-5" />
    </button>
  );
};