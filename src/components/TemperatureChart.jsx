import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { celsiusToFahrenheit } from '../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export const TemperatureChart = ({ weather, timezone, unit = 'c' }) => {
  if (!weather?.hourly) return null;

  const chartData = useMemo(() => {
    const hourly = weather.hourly;
    const now = new Date();
    const currentHour = now.getHours();

    const next24Hours = hourly.time
      .map((time, index) => ({
        time,
        temp: hourly.temperature_2m[index],
        feelsLike: hourly.apparent_temperature[index],
        precipitation: hourly.precipitation[index],
      }))
      .filter((h) => new Date(h.time).getHours() >= currentHour)
      .slice(0, 24);

    const labels = next24Hours.map((h) => {
      const date = new Date(h.time);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: timezone });
    });

    const tempData = next24Hours.map((h) => unit === 'f' ? celsiusToFahrenheit(h.temp) : h.temp);
    const feelsData = next24Hours.map((h) => unit === 'f' ? celsiusToFahrenheit(h.feelsLike) : h.feelsLike);
    const precipData = next24Hours.map((h) => h.precipitation);

    return { labels, tempData, feelsData, precipData };
  }, [weather, timezone, unit]);

  const tempUnit = unit === 'f' ? '°F' : '°C';

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: `Temperature (${tempUnit})`,
        data: chartData.tempData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: `Feels Like (${tempUnit})`,
        data: chartData.feelsData,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, padding: 20, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}${tempUnit}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxTicksLimit: 8, color: '#9ca3af', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: '#9ca3af', font: { size: 11 }, callback: (value) => `${value}${tempUnit}` },
      },
    },
  };

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">24-Hour Temperature Trend</h3>
      <div className="h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};