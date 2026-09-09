import { getWeatherInfo, formatTime, celsiusToFahrenheit, kmhToMph } from '../utils/helpers';
import { Droplet, Wind } from 'lucide-react';

export const HourlyForecast = ({ weather, timezone, unit = 'c' }) => {
  if (!weather?.hourly) return null;

  const hourly = weather.hourly;
  const now = new Date();
  const currentHour = now.getHours();

  const hours = hourly.time
    .map((time, index) => ({
      time,
      temp: hourly.temperature_2m[index],
      feelsLike: hourly.apparent_temperature[index],
      precipitationProb: hourly.precipitation_probability[index],
      weatherCode: hourly.weather_code[index],
      windSpeed: hourly.wind_speed_10m[index],
      humidity: hourly.relative_humidity_2m[index],
      uvIndex: hourly.uv_index?.[index],
    }))
    .filter((h) => {
      const hour = new Date(h.time).getHours();
      return hour >= currentHour;
    })
    .slice(0, 24);

  return (
    <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hourly Forecast</h3>
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-3 min-w-max">
          {hours.map((hour) => (
            <HourlyCard
              key={hour.time}
              hour={hour}
              timezone={timezone}
              unit={unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HourlyCard = ({ hour, timezone, unit }) => {
  const info = getWeatherInfo(hour.weatherCode);
  const temp = unit === 'f' ? celsiusToFahrenheit(hour.temp) : hour.temp;
  const feelsLike = unit === 'f' ? celsiusToFahrenheit(hour.feelsLike) : hour.feelsLike;
  const windSpeed = unit === 'f' ? kmhToMph(hour.windSpeed) : hour.windSpeed;
  const tempUnit = unit === 'f' ? '°F' : '°C';
  const speedUnit = unit === 'f' ? 'mph' : 'km/h';

  return (
    <div className="flex-shrink-0 w-36 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-3 transition-all hover:shadow-lg">
      <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {formatTime(hour.time, timezone)}
      </p>
      
      <div className="text-center mb-2">
        <span className="text-3xl" role="img" aria-label={info.label}>{info.icon}</span>
      </div>

      <div className="text-center text-sm">
        <p className="font-bold text-gray-900 dark:text-white">{Math.round(temp)}<span className="text-xs font-normal">{tempUnit}</span></p>
        <p className="text-gray-500 dark:text-gray-400 text-xs">Feels: {Math.round(feelsLike)}{tempUnit}</p>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-center gap-1">
          <Droplet className="w-3 h-3" />
          <span>{hour.precipitationProb}%</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <Wind className="w-3 h-3" />
          <span>{windSpeed}{speedUnit}</span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="w-3 h-3 text-gray-400">💧</span>
          <span>{hour.humidity}%</span>
        </div>
        {hour.uvIndex !== undefined && (
          <div className="flex items-center justify-center gap-1">
            <span className="w-3 h-3">☀️</span>
            <span>UV {Math.round(hour.uvIndex)}</span>
          </div>
        )}
      </div>
    </div>
  );
};