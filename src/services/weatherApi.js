const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const fetchWithTimeout = async (url, options = {}, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    throw err;
  }
};

export const fetchWeatherByCoords = async (latitude, longitude) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'visibility',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'visibility',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
      'moon_phase',
    ].join(','),
    timezone: 'auto',
    forecast_days: 7,
  });

  const response = await fetchWithTimeout(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error('Failed to fetch weather data');
  return response.json();
};

export const fetchAirQuality = async (latitude, longitude) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
      'dust',
      'uv_index',
      'uv_index_clear_sky',
    ].join(','),
    hourly: [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
      'dust',
      'uv_index',
      'uv_index_clear_sky',
    ].join(','),
    timezone: 'auto',
    forecast_days: 2,
  });

  try {
    const response = await fetchWithTimeout(`${AIR_QUALITY_URL}?${params}`, {}, 10000);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
};

export const searchCities = async (query) => {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: 10,
    language: 'en',
    format: 'json',
  });

  try {
    const response = await fetchWithTimeout(`${GEOCODING_URL}?${params}`, {}, 10000);
    if (!response.ok) throw new Error('Failed to search cities');
    const data = await response.json();
    const results = data.results || [];
    return results.map(city => ({
      latitude: city.latitude,
      longitude: city.longitude,
      name: city.name,
      admin1: city.admin1,
      country: city.country,
      country_code: city.country_code,
    }));
  } catch {
    return [];
  }
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};