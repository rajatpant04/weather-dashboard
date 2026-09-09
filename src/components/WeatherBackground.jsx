import { useEffect, useRef } from 'react';
import { Sun, Moon, Cloud, Zap, Star } from 'lucide-react';

const weatherBackgroundStyles = {
  Clear: {
    gradient: 'from-yellow-500 to-orange-500',
    textColor: '#f59e0b',
    icon: <Sun className="w-6 h-6 text-yellow-400" />,
  },
  MainlyClear: {
    gradient: 'from-yellow-400 to-orange-300',
    textColor: '#fbbf24',
    icon: <Sun className="w-6 h-6 text-yellow-400" />,
  },
  PartlyCloudy: {
    gradient: 'from-blue-300 to-indigo-200',
    textColor: '#63b3ed',
    icon: <Cloud className="w-6 h-6 text-blue-400" />,
  },
  Overcast: {
    gradient: 'from-slate-400 to-slate-500',
    textColor: '#98a2b3',
    icon: <Cloud className="w-6 h-6 text-slate-400" />,
  },
  Fog: {
    gradient: 'from-slate-300 to-slate-400',
    textColor: '#cbd5e1',
    icon: <Droplet className="w-6 h-6 text-slate-300" />,
  },
  Drizzle: {
    gradient: 'from-blue-300 to-light-blue-300',
    textColor: '#60a5fa',
    icon: <Cloud className="w-6 h-6 text-blue-400" />,
  },
  Rain: {
    gradient: 'from-blue-500 to-teal-600',
    textColor: '#14b8a6',
    icon: <Cloud className="w-6 h-6 text-blue-500" />,
  },
  HeavyRain: {
    gradient: 'from-blue-600 to-purple-600',
    textColor: '#a78bfa',
    icon: <Cloud className="w-6 h-6 text-blue-600" />,
  },
  Snow: {
    gradient: 'from-blue-100 to-light-blue-200',
    textColor: '#3b82f6',
    icon: <Cloud className="w-6 h-6 text-blue-300" />,
  },
  SnowShowers: {
    gradient: 'from-blue-200 to-cyan-300',
    textColor: '#06b6d4',
    icon: <Cloud className="w-6 h-6 text-blue-300" />,
  },
  Thunderstorm: {
    gradient: 'from-purple-600 to-purple-700',
    textColor: '#a78bfa',
    icon: <Zap className="w-6 h-6 text-purple-600" />,
  },
  Night: {
    gradient: 'from-indigo-600 to-purple-700',
    textColor: '#8b5cf6',
    icon: <Star className="w-6 h-6 text-yellow-300" />,
  },
};

const getWeatherCondition = (weather) => {
  if (!weather?.current?.weather_code) return 'Night';
  
  const code = weather.current.weather_code;
  const isDay = weather.current.is_day === 1;
  
  if (code === 0) return isDay ? 'Clear' : 'Night';
  if (code === 1) return isDay ? 'MainlyClear' : 'Night';
  if (code === 2) return 'PartlyCloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'RainShowers';
  if (code >= 85 && code <= 86) return 'SnowShowers';
  if (code === 95 || code === 96 || code === 99) return 'Thunderstorm';
  
  return 'Night';
};

export const WeatherBackground = ({ weather, selectedCity }) => {
  const [bgStyle, setBgStyle] = useState({ gradient: 'from-blue-50 to-purple-50', textColor: '#3b82f6' });
  const canvasRef = useRef(null);

  useEffect(() => {
    const condition = weather ? getWeatherCondition(weather) : 'Night';
    const style = weatherBackgroundStyles[condition] || weatherBackgroundStyles.Night;
    setBgStyle({
      gradient: style.gradient,
      textColor: style.textColor,
    });
  }, [weather]);

  const darkMode = document.documentElement.classList.contains('dark');

  return (
    <div 
      ref={canvasRef}
      className="fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br " 
           style={{ 
             background: bgStyle.gradient,
             ...(darkMode ? 'from-gray-900 via-gray-800 to-gray-900' : undefined)
           }}>
        <div className="absolute inset-0" />
      </div>
      
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
        <filter id="goo">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>
    </div>
  );
};