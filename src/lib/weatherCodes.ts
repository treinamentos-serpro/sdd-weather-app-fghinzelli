import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Sun,
} from 'lucide-react';

interface WeatherCondition {
  label: string;
  icon: LucideIcon;
}

export function getWeatherCondition(code: number | null): WeatherCondition {
  if (code === 0) return { label: 'Céu limpo', icon: Sun };
  if (code === 1 || code === 2) return { label: 'Parcialmente nublado', icon: CloudSun };
  if (code === 3) return { label: 'Nublado', icon: Cloud };
  if (code === 45 || code === 48) return { label: 'Nevoeiro', icon: CloudFog };
  if (code !== null && code >= 51 && code <= 57) return { label: 'Garoa', icon: CloudDrizzle };
  if (code !== null && ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))) {
    return { label: 'Chuva', icon: CloudRain };
  }
  if (code !== null && ((code >= 71 && code <= 77) || code === 85 || code === 86)) {
    return { label: 'Neve', icon: CloudSnow };
  }
  if (code !== null && code >= 95 && code <= 99) {
    return { label: 'Tempestade', icon: CloudLightning };
  }
  return { label: 'Indisponível', icon: Cloud };
}
