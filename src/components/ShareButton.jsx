import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

export const ShareButton = ({ weather, cityName }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const generateShareText = () => {
    if (!weather?.current) return 'Check out the weather!';
    
    const current = weather.current;
    const temp = Math.round(current.temperature_2m);
    const info = getWeatherInfo(current.weather_code);
    
    return `${info.label}, ${temp}°C in ${cityName || 'your location'} - ${info.description}. Via WeatherDash`;
  };

  const getWeatherInfo = (code) => {
    const codes = {
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
    return codes[code] || { label: 'Unknown', icon: '❓', description: 'Unknown weather' };
  };

  const handleShare = async () => {
    const shareData = {
      title: 'WeatherDash',
      text: generateShareText(),
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        await copyToClipboard();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await copyToClipboard();
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors text-gray-600 dark:text-gray-300"
      aria-label="Share weather"
    >
      {copied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : shared ? (
        <Check className="w-5 h-5 text-blue-500" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
    </button>
  );
};