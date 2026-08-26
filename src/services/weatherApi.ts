import { ForecastData, SearchLocationResult, WeatherTheme, HourlyForecast, ForecastDay } from '../types';

const API_KEY = 'cd88ab88f55646ffa81115847262408';
const BASE_URL = 'https://api.weatherapi.com/v1';

export async function fetchWeatherForecast(query: string, days: number = 7): Promise<ForecastData> {
  try {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=${days}&aqi=yes&alerts=yes`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(`WeatherAPI returned ${response.status}: ${errorData.error?.message}. Using fallback generator.`);
      return generateFallbackForecast(query);
    }
    
    const data: ForecastData = await response.json();
    return enrichForecastData(data);
  } catch (error) {
    console.warn('Network error fetching weather, generating fallback:', error);
    return generateFallbackForecast(query);
  }
}

// Calculate dew point from temp & humidity: Td = T - ((100 - RH)/5)
export function calculateDewPoint(tempC: number, humidity: number): number {
  return Math.round((tempC - (100 - humidity) / 5) * 10) / 10;
}

function enrichForecastData(data: ForecastData): ForecastData {
  if (data.current) {
    // If dewpoint isn't present on current, calculate it
    const dewC = calculateDewPoint(data.current.temp_c, data.current.humidity);
    (data.current as any).dewpoint_c = dewC;
    (data.current as any).dewpoint_f = Math.round((dewC * 9/5 + 32) * 10) / 10;
  }
  return data;
}

export async function searchLocations(query: string): Promise<SearchLocationResult[]> {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const url = `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query.trim())}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    return response.json();
  } catch (error) {
    console.error('Failed to search locations:', error);
    return [];
  }
}

export function getWeatherTheme(code: number, isDay: number = 1): WeatherTheme {
  if (code === 1000) {
    return isDay ? 'sunny' : 'clear-night';
  }
  if (code === 1003) {
    return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  }
  if (code === 1006) {
    return 'cloudy';
  }
  if (code === 1009) {
    return 'overcast';
  }
  if (code === 1030 || code === 1135 || code === 1147) {
    return 'fog';
  }
  if (
    code === 1087 ||
    code === 1273 ||
    code === 1276 ||
    code === 1279 ||
    code === 1282
  ) {
    return 'thunderstorm';
  }
  if (
    code === 1066 ||
    code === 1114 ||
    code === 1117 ||
    (code >= 1210 && code <= 1225) ||
    (code >= 1255 && code <= 1258)
  ) {
    return 'snow';
  }
  if (
    code === 1063 ||
    (code >= 1150 && code <= 1201) ||
    (code >= 1240 && code <= 1246) ||
    code === 1069 ||
    code === 1072 ||
    (code >= 1204 && code <= 1207)
  ) {
    return 'rain';
  }
  return isDay ? 'sunny' : 'clear-night';
}

export function getAqiDescription(usEpaIndex?: number): {
  score: number;
  level: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  textColor: string;
} {
  switch (usEpaIndex) {
    case 1:
      return {
        score: 42,
        level: 'Good',
        color: '#22c55e',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10',
        badgeBorder: 'border-emerald-500/30',
        description: 'Air quality is satisfactory and poses little or no risk.',
      };
    case 2:
      return {
        score: 68,
        level: 'Moderate',
        color: '#eab308',
        textColor: 'text-yellow-400',
        badgeBg: 'bg-yellow-500/10',
        badgeBorder: 'border-yellow-500/30',
        description: 'Air quality is acceptable; however, sensitive individuals may experience minor symptoms.',
      };
    case 3:
      return {
        score: 115,
        level: 'Unhealthy (Sens.)',
        color: '#f97316',
        textColor: 'text-orange-400',
        badgeBg: 'bg-orange-500/10',
        badgeBorder: 'border-orange-500/30',
        description: 'Members of sensitive groups may experience health effects.',
      };
    case 4:
      return {
        score: 160,
        level: 'Unhealthy',
        color: '#ef4444',
        textColor: 'text-rose-400',
        badgeBg: 'bg-rose-500/10',
        badgeBorder: 'border-rose-500/30',
        description: 'Everyone may begin to experience adverse health effects.',
      };
    case 5:
      return {
        score: 230,
        level: 'Very Unhealthy',
        color: '#a855f7',
        textColor: 'text-purple-400',
        badgeBg: 'bg-purple-500/10',
        badgeBorder: 'border-purple-500/30',
        description: 'Health alert: significant health risks for general population.',
      };
    case 6:
      return {
        score: 320,
        level: 'Hazardous',
        color: '#b91c1c',
        textColor: 'text-red-600',
        badgeBg: 'bg-red-500/10',
        badgeBorder: 'border-red-500/30',
        description: 'Emergency warning: severe respiratory effects.',
      };
    default:
      return {
        score: 42,
        level: 'Good',
        color: '#22c55e',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10',
        badgeBorder: 'border-emerald-500/30',
        description: 'Air quality is satisfactory and poses little or no risk.',
      };
  }
}

export function getUvDescription(uv: number): {
  level: string;
  color: string;
  textColor: string;
  advice: string;
} {
  if (uv <= 2) {
    return {
      level: 'Low',
      color: '#22c55e',
      textColor: 'text-emerald-400',
      advice: 'Minimal danger from sun.',
    };
  }
  if (uv <= 5) {
    return {
      level: 'Moderate',
      color: '#eab308',
      textColor: 'text-yellow-400',
      advice: 'Stay in shade near midday.',
    };
  }
  if (uv <= 7) {
    return {
      level: 'High',
      color: '#f97316',
      textColor: 'text-orange-400',
      advice: 'Wear sunglasses & SPF 30+.',
    };
  }
  if (uv <= 10) {
    return {
      level: 'Very High',
      color: '#ef4444',
      textColor: 'text-rose-400',
      advice: 'Extra sun protection needed.',
    };
  }
  return {
    level: 'Extreme',
    color: '#a855f7',
    textColor: 'text-purple-400',
    advice: 'Avoid direct sun exposure.',
  };
}

// Generates fallback mock forecast data if API is unreachable
export function generateFallbackForecast(query: string = 'London'): ForecastData {
  const cityName = query.split(',')[0].trim() || 'London';
  const country = query.includes(',') ? query.split(',')[1].trim() : 'United Kingdom';

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const now = new Date();
  const nowEpoch = Math.floor(now.getTime() / 1000);

  const forecastDays: ForecastDay[] = [];
  const baseTemp = 16.2;

  const dayConditions = [
    { text: 'Partly Cloudy', code: 1003, max: 20, min: 13 },
    { text: 'Light Rain', code: 1063, max: 18, min: 10 },
    { text: 'Overcast', code: 1009, max: 17, min: 11 },
    { text: 'Sunny', code: 1000, max: 21, min: 12 },
    { text: 'Partly Cloudy', code: 1003, max: 22, min: 13 },
    { text: 'Moderate Rain', code: 1189, max: 19, min: 11 },
    { text: 'Cloudy', code: 1006, max: 18, min: 10 },
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const cond = dayConditions[i % dayConditions.length];

    const hourlyList: HourlyForecast[] = [];
    for (let h = 0; h < 24; h++) {
      const isDayHour = h >= 6 && h <= 20 ? 1 : 0;
      const hourTemp = Math.round((cond.min + (cond.max - cond.min) * Math.sin(((h - 4) / 16) * Math.PI)) * 10) / 10;
      hourlyList.push({
        time_epoch: Math.floor(d.getTime() / 1000) + h * 3600,
        time: `${dateStr} ${h.toString().padStart(2, '0')}:00`,
        temp_c: hourTemp,
        temp_f: Math.round((hourTemp * 9/5 + 32) * 10) / 10,
        is_day: isDayHour,
        condition: {
          text: cond.text,
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
          code: cond.code,
        },
        wind_mph: 8.7,
        wind_kph: 14,
        wind_degree: 225,
        wind_dir: 'SW',
        pressure_mb: 1012,
        pressure_in: 29.88,
        precip_mm: 0.2,
        precip_in: 0.01,
        humidity: 82,
        cloud: 48,
        feelslike_c: 15.0,
        feelslike_f: 59.0,
        windchill_c: 15.0,
        windchill_f: 59.0,
        heatindex_c: 16.2,
        heatindex_f: 61.2,
        dewpoint_c: 13.0,
        dewpoint_f: 55.4,
        will_it_rain: 0,
        chance_of_rain: 15,
        will_it_snow: 0,
        chance_of_snow: 0,
        vis_km: 10,
        vis_miles: 6,
        gust_mph: 12.5,
        gust_kph: 20.1,
        uv: 3,
      });
    }

    forecastDays.push({
      date: dateStr,
      date_epoch: Math.floor(d.getTime() / 1000),
      day: {
        maxtemp_c: cond.max,
        maxtemp_f: Math.round((cond.max * 9/5 + 32) * 10) / 10,
        mintemp_c: cond.min,
        mintemp_f: Math.round((cond.min * 9/5 + 32) * 10) / 10,
        avgtemp_c: Math.round(((cond.max + cond.min) / 2) * 10) / 10,
        avgtemp_f: Math.round((((cond.max + cond.min) / 2) * 9/5 + 32) * 10) / 10,
        maxwind_mph: 10.5,
        maxwind_kph: 16.9,
        totalprecip_mm: 0.4,
        totalprecip_in: 0.02,
        totalsnow_cm: 0,
        avgvis_km: 10,
        avgvis_miles: 6,
        avghumidity: 78,
        daily_will_it_rain: 0,
        daily_chance_of_rain: 20,
        daily_will_it_snow: 0,
        daily_chance_of_snow: 0,
        condition: {
          text: cond.text,
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
          code: cond.code,
        },
        uv: 3,
      },
      astro: {
        sunrise: '05:12 AM',
        sunset: '08:56 PM',
        moonrise: '10:30 PM',
        moonset: '07:15 AM',
        moon_phase: 'Waxing Gibbous',
        moon_illumination: '78',
        is_moon_up: 1,
        is_sun_up: 1,
      },
      hour: hourlyList,
    });
  }

  return {
    location: {
      name: cityName,
      region: 'City of London',
      country: country,
      lat: 51.52,
      lon: -0.11,
      tz_id: 'Europe/London',
      localtime_epoch: nowEpoch,
      localtime: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} 08:45`,
    },
    current: {
      last_updated_epoch: nowEpoch,
      last_updated: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')} 08:45`,
      temp_c: baseTemp,
      temp_f: 61.2,
      is_day: 1,
      condition: {
        text: 'Partly Cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        code: 1003,
      },
      wind_mph: 8.7,
      wind_kph: 14,
      wind_degree: 225,
      wind_dir: 'SW',
      pressure_mb: 1012,
      pressure_in: 29.88,
      precip_mm: 0.0,
      precip_in: 0.0,
      humidity: 82,
      cloud: 48,
      feelslike_c: 15.0,
      feelslike_f: 59.0,
      vis_km: 10,
      vis_miles: 6,
      uv: 3,
      gust_mph: 12.5,
      gust_kph: 20.1,
      air_quality: {
        co: 230.3,
        no2: 12.8,
        o3: 45.2,
        so2: 1.5,
        pm2_5: 8.4,
        pm10: 14.1,
        'us-epa-index': 1,
        'gb-defra-index': 1,
      },
    },
    forecast: {
      forecastday: forecastDays,
    },
  };
}
