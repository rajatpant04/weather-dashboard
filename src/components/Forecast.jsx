import { getWeatherInfo, formatDate, formatDay, celsiusToFahrenheit, getWindDirection, kmhToMph, getMoonPhase } from '../utils/helpers';
import { FiWind, FiDroplet, FiSun } from 'react-icons/fi';

export const Forecast = ({ weather, timezone, unit = 'c' }) => {
  if (!weather?.daily) return null;

  const daily = weather.daily;
  const days = daily.time.map((date, index) => ({
    date,
    weatherCode: daily.weather_code[index],
    tempMax: daily.temperature_2m_max[index],
    tempMin: daily.temperature_2m_min[index],
    feelsMax: daily.apparent_temperature_max[index],
    feelsMin: daily.apparent_temperature_min[index],
    sunrise: daily.sunrise[index],
    sunset: daily.sunset[index],
    uvIndex: daily.uv_index_max[index],
    precipitation: daily.precipitation_sum[index],
    precipitationProb: daily.precipitation_probability_max[index],
    windSpeed: daily.wind_speed_10m_max[index],
    windGust: daily.wind_gusts_10m_max[index],
    windDir: daily.wind_direction_10m_dominant[index],
    moonPhase: daily.moon_phase?.[index],
  }));

  return (
    <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7-Day Forecast</h3>
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-3 min-w-max">
          {days.map((day, index) => (
            <DailyCard
              key={day.date}
              day={day}
              index={index}
              timezone={timezone}
              unit={unit}
              isToday={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DailyCard = ({ day, index, timezone, unit, isToday }) => {
  const info = getWeatherInfo(day.weatherCode);
  const tempMax = unit === 'f' ? celsiusToFahrenheit(day.tempMax) : day.tempMax;
  const tempMin = unit === 'f' ? celsiusToFahrenheit(day.tempMin) : day.tempMin;
  const windSpeed = unit === 'f' ? kmhToMph(day.windSpeed) : day.windSpeed;
  const tempUnit = unit === 'f' ? '°F' : '°C';
  const speedUnit = unit === 'f' ? 'mph' : 'km/h';

  return (
    <div className={`flex-shrink-0 w-40 md:w-44 xl:w-48 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-4 transition-all hover:shadow-xl ${isToday ? 'ring-2 ring-blue-500/50' : ''}`}>
      <div className="text-center">
        <p className={`text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {isToday ? 'Today' : formatDay(day.date, timezone)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">{formatDate(day.date, timezone)}</p>
      </div>
      
      <div className="text-center my-3">
        <span className="text-4xl animate-bounce-slow" role="img" aria-label={info.label}>{info.icon}</span>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{info.label}</p>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="text-right">
          <p className="font-bold text-gray-900 dark:text-white">{Math.round(tempMax)}<span className="text-xs font-normal">{tempUnit}</span></p>
          <p className="text-gray-500 dark:text-gray-400">{Math.round(tempMin)}<span className="text-xs">{tempUnit}</span></p>
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        <div className="text-left">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs">
            <FiDroplet className="w-3 h-3" />
            <span>{day.precipitationProb}%</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-xs mt-1">
            <FiWind className="w-3 h-3" />
            <span>{windSpeed}{speedUnit}</span>
          </div>
        </div>
      </div>

      {day.uvIndex !== undefined && (
        <div className="mt-3 pt-3 border-t border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FiSun className="w-3 h-3" />
            <span>UV Index: {Math.round(day.uvIndex)}</span>
          </div>
        </div>
      )}

      {day.moonPhase !== undefined && (
        <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-700/20">
          <div className="flex items-center justify-center gap-1 text-xs text-purple-400 dark:text-purple-300">
            <span className="text-lg">{getMoonPhase(day.moonPhase).icon}</span>
            <span>{getMoonPhase(day.moonPhase).label}</span>
            <span className="text-gray-500 dark:text-gray-400">({getMoonPhase(day.moonPhase).illumination}%)</span>
          </div>
        </div>
      )}
    </div>
  );
};