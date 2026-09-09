export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: '☀️', description: 'Clear sky' },
  1: { label: 'Mainly clear', icon: '🌤️', description: 'Mainly clear' },
  2: { label: 'Partly cloudy', icon: '⛅', description: 'Partly cloudy' },
  3: { label: 'Overcast', icon: '☁️', description: 'Overcast' },
  45: { label: 'Fog', icon: '🌫️', description: 'Fog' },
  48: { label: 'Depositing rime fog', icon: '🌫️', description: 'Depositing rime fog' },
  51: { label: 'Light drizzle', icon: '🌦️', description: 'Light drizzle' },
  53: { label: 'Moderate drizzle', icon: '🌦️', description: 'Moderate drizzle' },
  55: { label: 'Dense drizzle', icon: '🌧️', description: 'Dense drizzle' },
  56: { label: 'Light freezing drizzle', icon: '🌧️', description: 'Light freezing drizzle' },
  57: { label: 'Dense freezing drizzle', icon: '🌧️', description: 'Dense freezing drizzle' },
  61: { label: 'Slight rain', icon: '🌧️', description: 'Slight rain' },
  63: { label: 'Moderate rain', icon: '🌧️', description: 'Moderate rain' },
  65: { label: 'Heavy rain', icon: '🌧️', description: 'Heavy rain' },
  66: { label: 'Light freezing rain', icon: '🌧️', description: 'Light freezing rain' },
  67: { label: 'Heavy freezing rain', icon: '🌧️', description: 'Heavy freezing rain' },
  71: { label: 'Slight snow fall', icon: '🌨️', description: 'Slight snow fall' },
  73: { label: 'Moderate snow fall', icon: '🌨️', description: 'Moderate snow fall' },
  75: { label: 'Heavy snow fall', icon: '🌨️', description: 'Heavy snow fall' },
  77: { label: 'Snow grains', icon: '🌨️', description: 'Snow grains' },
  80: { label: 'Slight rain showers', icon: '🌦️', description: 'Slight rain showers' },
  81: { label: 'Moderate rain showers', icon: '🌦️', description: 'Moderate rain showers' },
  82: { label: 'Violent rain showers', icon: '⛈️', description: 'Violent rain showers' },
  85: { label: 'Slight snow showers', icon: '🌨️', description: 'Slight snow showers' },
  86: { label: 'Heavy snow showers', icon: '🌨️', description: 'Heavy snow showers' },
  95: { label: 'Thunderstorm', icon: '⛈️', description: 'Thunderstorm' },
  96: { label: 'Thunderstorm with slight hail', icon: '⛈️', description: 'Thunderstorm with slight hail' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️', description: 'Thunderstorm with heavy hail' },
};

export const getWeatherInfo = (code) => {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: '❓', description: 'Unknown weather' };
};

export const formatTime = (dateString, timezone = 'auto') => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone === 'auto' ? undefined : timezone,
  });
};

export const formatDate = (dateString, timezone = 'auto') => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone === 'auto' ? undefined : timezone,
  });
};

export const formatDay = (dateString, timezone = 'auto') => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: timezone === 'auto' ? undefined : timezone,
  });
};

export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getAQILabel = (aqi) => {
  if (aqi <= 20) return { label: 'Very Good', color: 'text-green-500' };
  if (aqi <= 40) return { label: 'Good', color: 'text-green-400' };
  if (aqi <= 60) return { label: 'Moderate', color: 'text-yellow-500' };
  if (aqi <= 80) return { label: 'Poor', color: 'text-orange-500' };
  if (aqi <= 100) return { label: 'Very Poor', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-red-700' };
};

export const getUS_AQILabel = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-500' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-500' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-500' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-500' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-500' };
  return { label: 'Hazardous', color: 'text-red-700' };
};

export const celsiusToFahrenheit = (celsius) => {
  return Math.round((celsius * 9) / 5 + 32);
};

export const kmhToMph = (kmh) => {
  return Math.round(kmh * 0.621371);
};

export const metersToMiles = (meters) => {
  return Math.round(meters * 0.000621371 * 10) / 10;
};

export const hPaToInHg = (hPa) => {
  return (hPa * 0.02953).toFixed(2);
};

export const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const getUVIndexLabel = (uvIndex) => {
  if (uvIndex <= 2) return { label: 'Low', color: 'text-green-500' };
  if (uvIndex <= 5) return { label: 'Moderate', color: 'text-yellow-500' };
  if (uvIndex <= 7) return { label: 'High', color: 'text-orange-500' };
  if (uvIndex <= 10) return { label: 'Very High', color: 'text-red-500' };
  return { label: 'Extreme', color: 'text-purple-500' };
};

export const getMoonPhase = (phase) => {
  if (phase === 0) return { label: 'New Moon', icon: '🌑', illumination: 0 };
  if (phase < 0.25) return { label: 'Waxing Crescent', icon: '🌒', illumination: Math.round(phase * 400) };
  if (phase === 0.25) return { label: 'First Quarter', icon: '🌓', illumination: 50 };
  if (phase < 0.5) return { label: 'Waxing Gibbous', icon: '🌔', illumination: Math.round(phase * 200) };
  if (phase === 0.5) return { label: 'Full Moon', icon: '🌕', illumination: 100 };
  if (phase < 0.75) return { label: 'Waning Gibbous', icon: '🌖', illumination: Math.round((1 - phase) * 200) };
  if (phase === 0.75) return { label: 'Last Quarter', icon: '🌗', illumination: 50 };
  return { label: 'Waning Crescent', icon: '🌘', illumination: Math.round((1 - phase) * 400) };
};