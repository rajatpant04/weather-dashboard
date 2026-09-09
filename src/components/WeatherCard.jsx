import { Heart, Trash, MapPin } from 'lucide-react';
import { Skeleton } from './Loader';

export const WeatherCard = ({ 
  city, 
  weather, 
  timezone, 
  unit = 'c', 
  isFavorite = false,
  onToggleFavorite,
  onRemove,
  onClick,
  compact = false,
  loading = false
}) => {
  if (loading) {
    return <Skeleton variant="card" />;
  }
  
  if (!weather?.current) return null;

  const current = weather.current;
  const info = weather.current ? getWeatherInfo(current.weather_code) : { icon: '❓', label: 'Unknown' };
  const temp = unit === 'f' ? celsiusToFahrenheit(current.temperature_2m) : current.temperature_2m;
  const tempUnit = unit === 'f' ? '°F' : '°C';

  function getWeatherInfo(code) {
    const codes = {
      0: { label: 'Clear sky', icon: '☀️' },
      1: { label: 'Mainly clear', icon: '🌤️' },
      2: { label: 'Partly cloudy', icon: '⛅' },
      3: { label: 'Overcast', icon: '☁️' },
      45: { label: 'Fog', icon: '🌫️' },
      48: { label: 'Depositing rime fog', icon: '🌫️' },
      51: { label: 'Light drizzle', icon: '🌦️' },
      53: { label: 'Moderate drizzle', icon: '🌦️' },
      55: { label: 'Dense drizzle', icon: '🌧️' },
      56: { label: 'Light freezing drizzle', icon: '🌧️' },
      57: { label: 'Dense freezing drizzle', icon: '🌧️' },
      61: { label: 'Slight rain', icon: '🌧️' },
      63: { label: 'Moderate rain', icon: '🌧️' },
      65: { label: 'Heavy rain', icon: '🌧️' },
      66: { label: 'Light freezing rain', icon: '🌧️' },
      67: { label: 'Heavy freezing rain', icon: '🌧️' },
      71: { label: 'Slight snow fall', icon: '🌨️' },
      73: { label: 'Moderate snow fall', icon: '🌨️' },
      75: { label: 'Heavy snow fall', icon: '🌨️' },
      77: { label: 'Snow grains', icon: '🌨️' },
      80: { label: 'Slight rain showers', icon: '🌦️' },
      81: { label: 'Moderate rain showers', icon: '🌦️' },
      82: { label: 'Violent rain showers', icon: '⛈️' },
      85: { label: 'Slight snow showers', icon: '🌨️' },
      86: { label: 'Heavy snow showers', icon: '🌨️' },
      95: { label: 'Thunderstorm', icon: '⛈️' },
      96: { label: 'Thunderstorm with slight hail', icon: '⛈️' },
      99: { label: 'Thunderstorm with heavy hail', icon: '⛈️' },
    };
    return codes[code] || { label: 'Unknown', icon: '❓' };
  }

  function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9) / 5 + 32);
  }

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 text-left transition-all hover:shadow-lg hover:border-blue-500/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{city.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{info.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(temp)}<span className="text-lg">{tempUnit}</span></p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 transition-all hover:shadow-xl relative group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{city.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{info.label}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(city); }}
            className={`p-2 rounded-xl transition-colors ${isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          {onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(city.latitude, city.longitude); }}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              aria-label="Remove"
            >
              <Trash className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <span className="text-5xl" role="img" aria-label={info.label}>{info.icon}</span>
          <p className="text-3xl font-light text-gray-900 dark:text-white mt-1">{Math.round(temp)}<span className="text-xl">{tempUnit}</span></p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white/30 dark:bg-white/10 rounded-xl p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Humidity</p>
            <p className="font-medium text-gray-900 dark:text-white">{current.relative_humidity_2m}%</p>
          </div>
          <div className="bg-white/30 dark:bg-white/10 rounded-xl p-3">
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Wind</p>
            <p className="font-medium text-gray-900 dark:text-white">{current.wind_speed_10m} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};