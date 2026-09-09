import { Droplet, Wind, Sun, Moon, Eye, Compass } from 'lucide-react';
import {
  celsiusToFahrenheit,
  kmhToMph,
  metersToMiles,
  hPaToInHg,
  getWeatherInfo,
  getWindDirection,
  getAQILabel,
  getUS_AQILabel,
  formatTime,
} from "../utils/helpers";

export const CurrentWeather = ({ weather, timezone, unit = 'c', airQuality }) => {
  if (!weather?.current) return null;

  const current = weather.current;
  const currentUnits = weather.current_units || {};
  const daily = weather.daily;
  const info = getWeatherInfo(current.weather_code);
  const todayMax = daily?.temperature_2m_max?.[0];
  const todayMin = daily?.temperature_2m_min?.[0];

  const temp = unit === 'f' ? celsiusToFahrenheit(current.temperature_2m) : current.temperature_2m;
  const feelsLike = unit === 'f' ? celsiusToFahrenheit(current.apparent_temperature) : current.apparent_temperature;
  const windSpeed = unit === 'f' ? kmhToMph(current.wind_speed_10m) : current.wind_speed_10m;
  const visibility = unit === 'f' ? metersToMiles(current.visibility) : (current.visibility / 1000).toFixed(1);
  const pressure = unit === 'f' ? hPaToInHg(current.pressure_msl) : current.pressure_msl;
  const tempUnit = unit === 'f' ? '°F' : '°C';
  const speedUnit = unit === 'f' ? 'mph' : 'km/h';
  const visUnit = unit === 'f' ? 'mi' : 'km';
  const presUnit = unit === 'f' ? 'inHg' : 'hPa';

  const sunrise = daily?.sunrise?.[0];
  const sunset = daily?.sunset?.[0];

  const todayMaxDisplay = todayMax !== undefined ? todayMax : '—';
  const todayMinDisplay = todayMin !== undefined ? todayMin : '—';

  return (
    <div className="animate-slide-up">
      <div className="relative rounded-3xl overflow-hidden">
        <div 
          className={`absolute inset-0 ${getWeatherBackground(current.weather_code)}`}
        />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 px-6 py-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{info.label}</h2>
              <p className="text-white/70">{info.description}</p>
              <p className="text-white/50 text-sm mt-2">
                📍 {current.location ? current.location.name : 'Loading city...'} 
                {weather.timezone && (
                  <span className="text-white/60 ms-2">• {formatTime(new Date(), timezone)}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl md:text-7xl font-light text-white leading-none">{Math.round(temp)}<span className="text-3xl md:text-4xl font-medium">{tempUnit}</span></div>
              <div className="text-white/70 mt-1">Feels like {Math.round(feelsLike)}{tempUnit} • H:{todayMaxDisplay}{tempUnit} L:{todayMinDisplay}{tempUnit}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-6">
            <WeatherDetail
              icon={<Droplet className="w-6 h-6 text-blue-400" />}
              label="Humidity"
              value={`${current.relative_humidity_2m}%`}
            />
            <WeatherDetail
              icon={<Wind className="w-6 h-6 text-green-400" />}
              label="Wind"
              value={`${windSpeed} ${speedUnit}`}
              subValue={`${getWindDirection(current.wind_direction_10m)} • Gusts: ${unit === 'f' ? kmhToMph(current.wind_gusts_10m) : current.wind_gusts_10m} ${speedUnit}`}
            />
            <WeatherDetail
              icon={<Eye className="w-6 h-6 text-purple-400" />}
              label="Visibility"
              value={`${visibility} ${visUnit}`}
            />
            <WeatherDetail
              icon={<Sun className="w-6 h-6 text-yellow-400" />}
              label="Pressure"
              value={`${pressure} ${presUnit}`}
            />
          </div>

          {(sunrise || sunset) && (
            <div className="mt-6 px-6 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {sunrise && (
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">Sunrise</p>
                    <p className="text-lg font-medium text-white">{formatTime(sunrise, timezone)}</p>
                  </div>
                </div>
              )}
              {sunset && (
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-orange-400 rotate-90" />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wide">Sunset</p>
                    <p className="text-lg font-medium text-white">{formatTime(sunset, timezone)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {airQuality?.current && (
            <div className="mt-6 px-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-white/60 mb-3">
                <Compass className="w-4 h-4" />
                <span className="text-sm font-medium">Air Quality Index</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <AQIBadge 
                  label="EUR AQI" 
                  value={airQuality.current.european_aqi} 
                  getLabel={getAQILabel}
                />
                <AQIBadge 
                  label="US AQI" 
                  value={airQuality.current.us_aqi} 
                  getLabel={getUS_AQILabel}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WeatherDetail = ({ icon, label, value, subValue }) => (
  <div className="bg-white/5 dark:bg-white/2 backdrop-blur-sm rounded-2xl p-4 border border-white/10 dark:border-white/5">
    <div className="flex items-center gap-2 text-white/60 mb-1">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p className="text-xl font-semibold text-white">{value}</p>
    {subValue && <p className="text-xs text-white/50 mt-1">{subValue}</p>}
  </div>
);

const getWeatherBackground = (code) => {
  const codes = {
    0: 'bg-gradient-to-br from-yellow-400 to-orange-300',
    1: 'bg-gradient-to-br from-yellow-400 to-orange-300',
    2: 'bg-gradient-to-br from-blue-300 to-indigo-200',
    3: 'bg-gradient-to-br from-slate-400 to-slate-500',
    45: 'bg-gradient-to-br from-slate-300 to-slate-400',
    48: 'bg-gradient-to-br from-slate-300 to-slate-400',
    51: 'bg-gradient-to-br from-blue-300 to-light-blue-300',
    53: 'bg-gradient-to-br from-blue-300 to-light-blue-300',
    55: 'bg-gradient-to-br from-blue-300 to-light-blue-300',
    56: 'bg-gradient-to-br from-blue-300 to-light-blue-300',
    57: 'bg-gradient-to-br from-blue-300 to-light-blue-300',
    61: 'bg-gradient-to-br from-blue-500 to-teal-600',
    63: 'bg-gradient-to-br from-blue-500 to-teal-600',
    65: 'bg-gradient-to-br from-blue-500 to-teal-600',
    66: 'bg-gradient-to-br from-blue-500 to-teal-600',
    67: 'bg-gradient-to-br from-blue-500 to-teal-600',
    71: 'bg-gradient-to-br from-blue-200 to-cyan-300',
    73: 'bg-gradient-to-br from-blue-200 to-cyan-300',
    75: 'bg-gradient-to-br from-blue-200 to-cyan-300',
    77: 'bg-gradient-to-br from-blue-200 to-cyan-300',
    80: 'bg-gradient-to-br from-blue-300 to-light-blue-300',
    81: 'bg-gradient-to-br from-blue-300 to-light-blue-300',
    82: 'bg-gradient-to-br from-blue-300 to-cyan-300',
    85: 'bg-gradient-to-br from-blue-200 to-cyan-300',
    86: 'bg-gradient-to-br from-blue-200 to-cyan-300',
    95: 'bg-gradient-to-br from-purple-600 to-purple-700',
    96: 'bg-gradient-to-br from-purple-600 to-purple-700',
    99: 'bg-gradient-to-br from-purple-600 to-purple-700',
  };
  return codes[code] || 'bg-gradient-to-br from-indigo-600 to-purple-700';
};

const AQIBadge = ({ label, value, getLabel }) => {
  const { label: aqiLabel, color } = getLabel(value);
  return (
    <div className={`bg-${color === undefined ? 'white' : color.replace('bg-', '')} text-white px-3 py-1 rounded text-xs font-medium`}>
      {aqiLabel || 'N/A'}
    </div>
  );
};