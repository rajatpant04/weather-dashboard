import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { SearchBar } from '../components/SearchBar';
import { CurrentWeather } from '../components/CurrentWeather';
import { Forecast } from '../components/Forecast';
import { HourlyForecast } from '../components/HourlyForecast';
import { TemperatureChart } from '../components/TemperatureChart';
import { Favorites } from '../components/Favorites';
import { Loader, PageLoader } from '../components/Loader';
import { Error, InlineError } from '../components/Error';
import { WeatherAlerts, AlertBanner } from '../components/WeatherAlerts';
import { ShareButton } from '../components/ShareButton';
import { useWeather } from '../hooks/useWeather';
import { useKeyboardShortcuts, KeyboardShortcutsHelp } from '../hooks/useKeyboardShortcuts';
import { WeatherBackground } from '../components/WeatherBackground';
import { CityInfo } from '../components/CityInfo';

export const Home = () => {
  const {
    weather,
    airQuality,
    loading,
    error,
    favorites,
    history,
    fetchByCity,
    fetchCurrentLocation,
    searchCities,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearHistory,
    setError,
    selectedCity,
    searchResults,
    isSearching,
    showCitySelector,
    handleSearch,
    handleSelectCity,
    handleCitySelectorSelect,
    clearCitySelector,
  } = useWeather();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [unit, setUnit] = useState(() => localStorage.getItem('unit') || 'c');
  const [inlineError, setInlineError] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const searchInputRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('unit', unit);
  }, [unit]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleRefresh = () => {
    if (weather && selectedCity) {
      fetchWeatherByCoords(selectedCity.latitude, selectedCity.longitude);
    }
  };

  const handleLocate = () => {
    fetchCurrentLocation();
  };

  const handleUnitToggle = () => setUnit((prev) => prev === 'c' ? 'f' : 'c');

  const handleDismissAlert = useCallback((index) => {
    setDismissedAlerts((prev) => new Set([...prev, index]));
  }, []);

  const activeAlerts = weather?.alerts?.filter((_, i) => !dismissedAlerts.has(i)) || [];

  useKeyboardShortcuts({
    onSearch: focusSearch,
    onToggleDarkMode: toggleDarkMode,
    onToggleUnit: handleUnitToggle,
    onRefresh: handleRefresh,
    onLocate: handleLocate,
  });

  if (loading && !weather) {
    return <PageLoader />;
  }

  const formatLastUpdated = () => {
    if (!weather?.current) return '';
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const hour = date.getHours() % 12 || 12;
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${day} ${month} ${year} • ${hour}:${minute} ${ampm}`;
  };
  
  const cityDisplay = selectedCity ? `${selectedCity.name}, ${selectedCity.admin1 || ''}, ${selectedCity.country || ''}`.replace(/, $/, '').replace(/,, /, '') : '';

  return (
    <div className="min-h-screen">
      <WeatherBackground weather={weather} selectedCity={selectedCity} />
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onRefresh={handleRefresh}
        onLocate={handleLocate}
        loading={loading}
        favoritesCount={favorites.length}
        onShortcuts={() => setShowShortcuts(true)}
      />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
<CityInfo 
  city={selectedCity} 
  lastUpdated={formatLastUpdated()} 
  unit={unit} 
  onSearch={handleSearch} 
  onSelectCity={handleSelectCity} 
  searchResults={searchResults} 
  isSearching={isSearching} 
  showCitySelector={showCitySelector} 
  clearCitySelector={clearCitySelector} 
/>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUnitToggle}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  unit === 'c'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                }`}
              >
                °C
              </button>
              <button
                onClick={handleUnitToggle}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  unit === 'f'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                }`}
              >
                °F
              </button>
            </div>
          </div>

{inlineError && (
              <InlineError message={inlineError} onDismiss={() => setInlineError(null)} />
            )}

          {activeAlerts.length > 0 && (
            <WeatherAlerts alerts={activeAlerts} onDismiss={handleDismissAlert} />
          )}

          {error && !weather && (
            <Error message={error} onRetry={handleLocate} onHome={() => setError(null)} />
          )}

          {weather && selectedCity && (
            <>
              <div className="flex items-center justify-between">
                <CurrentWeather 
                  weather={weather} 
                  timezone={weather.timezone} 
                  unit={unit} 
                  airQuality={airQuality} 
                />
                <div className="flex items-center gap-2">
                  <ShareButton weather={weather} cityName={selectedCity?.name || weather.timezone} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <TemperatureChart weather={weather} timezone={weather.timezone} unit={unit} />
                  <Forecast weather={weather} timezone={weather.timezone} unit={unit} />
                  <HourlyForecast weather={weather} timezone={weather.timezone} unit={unit} />
                </div>

                <div className="space-y-6">
                  <Favorites
                    favorites={favorites}
                    loading={loading}
                    unit={unit}
                    onToggleFavorite={addToFavorites}
                    onRemoveFavorite={removeFromFavorites}
                    onSelectCity={handleSelectCity}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="py-8 px-4 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-white/20 dark:border-gray-700/20">
        <p>Weather data provided by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Open-Meteo</a></p>
        <p className="mt-1">Built with React, Vite, Tailwind CSS & Chart.js</p>
      </footer>

      {showShortcuts && (
        <KeyboardShortcutsHelp 
          onClose={() => setShowShortcuts(false)} 
        />
      )}
    </div>
  );
};