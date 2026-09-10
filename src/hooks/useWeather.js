import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByCoords, fetchAirQuality, searchCities, getCurrentLocation } from '../services/weatherApi';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';

const FAVORITES_KEY = 'weather_favorites';
const HISTORY_KEY = 'weather_history';
const LAST_CITY_KEY = 'weather_last_city';

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => loadFromLocalStorage(FAVORITES_KEY, []));
  const [history, setHistory] = useState(() => loadFromLocalStorage(HISTORY_KEY, []));

  const [selectedCity, setSelectedCity] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);

  const addToFavorites = useCallback((city) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.latitude === city.latitude && fav.longitude === city.longitude);
      if (exists) return prev;
      const updated = [...prev, city];
      saveToLocalStorage(FAVORITES_KEY, updated);
      return updated;
    });
  }, []);

  const removeFromFavorites = useCallback((latitude, longitude) => {
    setFavorites((prev) => {
      const updated = prev.filter((fav) => fav.latitude !== latitude || fav.longitude !== longitude);
      saveToLocalStorage(FAVORITES_KEY, updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((latitude, longitude) => {
    return favorites.some((fav) => fav.latitude === latitude && fav.longitude === longitude);
  }, [favorites]);

  const addToHistory = useCallback((city) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.latitude !== city.latitude || h.longitude !== city.longitude);
      const updated = [city, ...filtered].slice(0, 10);
      saveToLocalStorage(HISTORY_KEY, updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const fetchWeather = useCallback(async (latitude, longitude, cityName = '') => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, airQualityData] = await Promise.all([
        fetchWeatherByCoords(latitude, longitude),
        fetchAirQuality(latitude, longitude),
      ]);

      const formattedCityName = cityName;

      setWeather(weatherData);
      setAirQuality(airQualityData);

      if (cityName) {
        const cityData = {
  latitude,
  longitude,
  name: formattedCityName
};
        addToHistory(cityData);
        saveToLocalStorage(LAST_CITY_KEY, cityData);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
      setAirQuality(null);
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  const fetchByCity = useCallback(async (city) => {
    setSelectedCity(city);
    setShowCitySelector(false);
    await fetchWeather(city.latitude, city.longitude, city.name);
  }, [fetchWeather]);

  const searchCitiesDebounced = useCallback(
    debounce(async (query, setResults) => {
      if (query.length < 2) {
        setResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      const results = await searchCities(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 300),
    []
  );

  const handleSearch = useCallback((query, callback) => {
    searchCitiesDebounced(query, callback);
  }, [searchCitiesDebounced]);

  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setShowCitySelector(false);
    await fetchByCity(city);
  };

  const handleCitySelectorSelect = useCallback((city) => {
    setSelectedCity(city);
    setShowCitySelector(false);
    fetchByCity(city);
  }, [fetchByCity]);

  const clearCitySelector = useCallback(() => {
    setSelectedCity(null);
    setSearchResults([]);
  }, []);

  const fetchCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const coords = await getCurrentLocation();
      if (coords.latitude >= 6.5 && coords.latitude <= 37.5 && 
          coords.longitude >= 68 && coords.longitude <= 97.5) {
        const cityData = { latitude: coords.latitude, longitude: coords.longitude, name: 'Current Location', admin1: '', country: '' };
        await fetchWeather(coords.latitude, coords.longitude, 'Current Location');
        setSelectedCity(cityData);
      } else {
        throw new Error('Location outside India');
      }
    } catch (err) {
      const fallbackCoords = { latitude: 28.6139, longitude: 77.2090 };
      setError('Using default location (New Delhi, India). Enable location access for your local weather.');
      await fetchWeather(fallbackCoords.latitude, fallbackCoords.longitude, 'New Delhi');
      setSelectedCity({ latitude: fallbackCoords.latitude, longitude: fallbackCoords.longitude, name: 'New Delhi', admin1: 'Delhi', country: 'India' });
    } finally {
      setLoading(false);
    }
  }, [fetchWeather]);

  useEffect(() => {
  const lastCity = loadFromLocalStorage(LAST_CITY_KEY);

  if (lastCity) {
    setSelectedCity(lastCity);
    fetchWeather(lastCity.latitude, lastCity.longitude, lastCity.name);
  } else {
    fetchCurrentLocation();
  }
}, [fetchWeather, fetchCurrentLocation]);

  return {
    weather,
    airQuality,
    loading,
    error,
    favorites,
    history,
    selectedCity,
    setSelectedCity,
    searchResults,
    isSearching,
    showCitySelector,
    setShowCitySelector,
    fetchWeather,
    fetchByCity,
    fetchCurrentLocation,
    searchCities: searchCitiesDebounced,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToHistory,
    clearHistory,
    searchCitiesDebounced,
    handleSearch,
    handleSelectCity,
    handleCitySelectorSelect,
    clearCitySelector,
    setError,
  };
};

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}