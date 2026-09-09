import { useState, useEffect, useCallback } from 'react';
import { Heart, Trash, X, Plus, MapPin } from 'lucide-react';
import { WeatherCard } from './WeatherCard';
import { Loader, Skeleton } from './Loader';

export const Favorites = ({ 
  favorites, 
  loading, 
  unit, 
  onToggleFavorite, 
  onRemoveFavorite, 
  onSelectCity 
}) => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [weatherCache, setWeatherCache] = useState({});
  const [fetching, setFetching] = useState(new Set());

  const fetchCityWeather = useCallback(async (city) => {
    const cacheKey = `${city.latitude},${city.longitude}`;
    if (weatherCache[cacheKey] || fetching.has(cacheKey)) return;
    
    setFetching((prev) => new Set([...prev, cacheKey]));
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility&timezone=auto`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setWeatherCache((prev) => ({ ...prev, [cacheKey]: data }));
    } catch (err) {
      console.error('Failed to fetch favorite weather:', err);
    } finally {
      setFetching((prev) => {
        const next = new Set(prev);
        next.delete(cacheKey);
        return next;
      });
    }
  }, [weatherCache, fetching]);

  useEffect(() => {
    favorites.forEach(fetchCityWeather);
  }, [favorites, fetchCityWeather]);

  if (favorites.length === 0) {
    return (
      <div id="favorites" className="animate-slide-up" style={{ animationDelay: '400ms' }}>
        <button
          onClick={() => setShowFavorites(true)}
          className="w-full py-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 flex flex-col items-center gap-3 text-center transition-all hover:shadow-lg"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No Favorite Cities</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Add cities to your favorites for quick access. Search for a city and click the heart icon.
          </p>
          <Plus className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  const displayFavorites = expanded ? favorites : favorites.slice(0, 4);

  return (
    <div id="favorites" className="animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Favorite Cities ({favorites.length})</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
        >
          {expanded ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {expanded ? 'Show Less' : `Show ${favorites.length > 4 ? 'All' : ''}`}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayFavorites.map((city) => {
          const weather = weatherCache[`${city.latitude},${city.longitude}`];
          const isFetching = fetching.has(`${city.latitude},${city.longitude}`);
          return (
            <WeatherCard
              key={`${city.latitude}-${city.longitude}`}
              city={city}
              weather={weather}
              timezone={weather?.timezone}
              unit={unit}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onRemove={onRemoveFavorite}
              onClick={() => onSelectCity(city)}
              loading={isFetching}
            />
          );
        })}
      </div>
    </div>
  );
};