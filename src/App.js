import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as d3 from 'd3';

// Соответствие английских названий регионов русским (только используемые регионы)
const regionNames = {
  'Adygey': 'Адыгея',
  'Altay': 'Алтайский край',
  'Amur': 'Амурская область',
  'Arkhangel\'sk': 'Архангельская область',
  'Astrakhan\'': 'Астраханская область',
  'Bashkortostan': 'Башкортостан',
  'Belgorod': 'Белгородская область',
  'Bryansk': 'Брянская область',
  'Buryat': 'Бурятия',
  'Chechnya': 'Чечня',
  'Chelyabinsk': 'Челябинская область',
  'Chukot': 'Чукотский АО',
  'Chuvash': 'Чувашия',
  'CityofSt.Petersburg': 'Санкт-Петербург',
  'Dagestan': 'Дагестан',
  'Gorno-Altay': 'Республика Алтай',
  'Ingush': 'Ингушетия',
  'Irkutsk': 'Иркутская область',
  'Ivanovo': 'Ивановская область',
  'Kabardin-Balkar': 'Кабардино-Балкария',
  'Kaliningrad': 'Калининградская область',
  'Kalmyk': 'Калмыкия',
  'Kaluga': 'Калужская область',
  'Kamchatka': 'Камчатский край',
  'Karachay-Cherkess': 'Карачаево-Черкесия',
  'Karelia': 'Карелия',
  'Kemerovo': 'Кемеровская область',
  'Khabarovsk': 'Хабаровский край',
  'Khakass': 'Хакасия',
  'Khanty-Mansiy': 'ХМАО',
  'Kirov': 'Кировская область',
  'Komi': 'Коми',
  'Kostroma': 'Костромская область',
  'Krasnodar': 'Краснодарский край',
  'Krasnoyarsk': 'Красноярский край',
  'Kurgan': 'Курганская область',
  'Kursk': 'Курская область',
  'Leningrad': 'Ленинградская область',
  'Lipetsk': 'Липецкая область',
  'Magadan': 'Магаданская область',
  'Mariy-El': 'Марий Эл',
  'Mordovia': 'Мордовия',
  'MoscowCity': 'Москва',
  'Moskva': 'Московская область',
  'Murmansk': 'Мурманская область',
  'Nenets': 'Ненецкий АО',
  'Novgorod': 'Новгородская область',
  'Pskov': 'Псковская область',
  'Vologda': 'Вологодская область',
  'Voronezh': 'Воронежская область',
  'Yamal-Nenets': 'ЯНАО',
  'Yaroslavl\'': 'Ярославская область',
  'Yevrey': 'Еврейская АО',
  'Zabaykal\'ye': 'Забайкальский край'
};

// Статические данные по регионам
// Примерные данные по регионам
const regionsData = {
  'Arkhangel\'sk': {
    name: 'Архангельская область',
    statistics: {
      'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 13280, rate: 6816.9 },
      'Врожденные аномалии системы кровообращения': { cases: 5764, rate: 2958.8 },
      'Врожденные аномалии развития нервной системы': { cases: 333, rate: 170.9 },
      'Врожденные деформации бедра': { cases: 2902, rate: 1489.6 },
      'Неопределенность пола и псевдогермафродитизм': { cases: 0, rate: 0 },
      'Врожденный ихтиоз': { cases: 23, rate: 11.81 }
    }
  },
  'Komi': {
    name: 'Республика Коми',
    statistics: {
      'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 8345, rate: 5243.8 },
      'Врожденные аномалии системы кровообращения': { cases: 2252, rate: 1415.1 },
      'Врожденные аномалии развития нервной системы': { cases: 306, rate: 192.3 },
      'Врожденные деформации бедра': { cases: 850, rate: 534.1 },
      'Неопределенность пола и псевдогермафродитизм': { cases: 4, rate: 2.51 },
      'Врожденный ихтиоз': { cases: 26, rate: 16.34 }
    }
  },
  'Nenets': {
    name: 'Ненецкий автономный округ',
    statistics: {
      'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 848, rate: 8584.7 },
      'Врожденные аномалии системы кровообращения': { cases: 436, rate: 4413.8 },
      'Врожденные аномалии развития нервной системы': { cases: 9, rate: 91.1 },
      'Врожденные деформации бедра': { cases: 48, rate: 485.9 },
      'Неопределенность пола и псевдогермафродитизм': { cases: 0, rate: 0 }, 
      'Врожденный ихтиоз': { cases: 1, rate: 10.12 }
    }
  },
  'Pskov': {
  name: 'Псковская область',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 2439, rate: 2518.7 },
    'Врожденные аномалии системы кровообращения': { cases: 1619, rate: 1671.9 },
    'Врожденные аномалии развития нервной системы': { cases: 113, rate: 116.7 },
    'Врожденные деформации бедра': { cases: 64, rate: 66.1 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 0, rate: 0 }, // нет данных
    'Врожденный ихтиоз': { cases: 4, rate: 4.13 }
  }
},
'CityofSt.Petersburg': {
  name: 'Санкт-Петербург',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 35748, rate: 5265 },
    'Врожденные аномалии системы кровообращения': { cases: 11958, rate: 1761.2 },
    'Врожденные аномалии развития нервной системы': { cases: 717, rate: 105.6 },
    'Врожденные деформации бедра': { cases: 3604, rate: 530.8 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 4, rate: 0.59 },
    'Врожденный ихтиоз': { cases: 76, rate: 11.19 }
  }
},
'Murmansk': {
  name: 'Мурманская область',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 3290, rate: 2554.3 },
    'Врожденные аномалии системы кровообращения': { cases: 1232, rate: 956.5 },
    'Врожденные аномалии развития нервной системы': { cases: 108, rate: 83.9 },
    'Врожденные деформации бедра': { cases: 227, rate: 176.2 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 0, rate: 0 },
    'Врожденный ихтиоз': { cases: 8, rate: 6.21 }
  }
},
'Leningrad': {
  name: 'Ленинградская область',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 4893, rate: 2024.3 },
    'Врожденные аномалии системы кровообращения': { cases: 1933, rate: 799.7 },
    'Врожденные аномалии развития нервной системы': { cases: 278, rate: 115 },
    'Врожденные деформации бедра': { cases: 278, rate: 115 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 3, rate: 1.24 },
    'Врожденный ихтиоз': { cases: 32, rate: 13.24 }
  }
},
'Karelia': {
  name: 'Республика Карелия',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 7365, rate: 7018.8 },
    'Врожденные аномалии системы кровообращения': { cases: 5107, rate: 4867 },
    'Врожденные аномалии развития нервной системы': { cases: 193, rate: 183.9 },
    'Врожденные деформации бедра': { cases: 531, rate: 506 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 0, rate: 0 },
    'Врожденный ихтиоз': { cases: 9, rate: 8.58 }
  }
},
'Novgorod': {
  name: 'Новгородская область',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 4703, rate: 4837.2 },
    'Врожденные аномалии системы кровообращения': { cases: 2672, rate: 2748.3 },
    'Врожденные аномалии развития нервной системы': { cases: 133, rate: 136.8 },
    'Врожденные деформации бедра': { cases: 93, rate: 95.7 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 2, rate: 2.06 },
    'Врожденный ихтиоз': { cases: 3, rate: 3.09 }
  }
},
'Vologda': {
  name: 'Вологодская область',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 6098, rate: 2962.6 },
    'Врожденные аномалии системы кровообращения': { cases: 2837, rate: 1378.3 },
    'Врожденные аномалии развития нервной системы': { cases: 212, rate: 103 },
    'Врожденные деформации бедра': { cases: 342, rate: 166.2 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 5, rate: 2.43 },
    'Врожденный ихтиоз': { cases: 15, rate: 7.29 }
  }
},
'Kaliningrad': {
  name: 'Калининградская область',
  statistics: {
    'Врожденные аномалии (пороки развития), деформации и хромосомные нарушения': { cases: 7116, rate: 4622.1 },
    'Врожденные аномалии системы кровообращения': { cases: 2801, rate: 1819.4 },
    'Врожденные аномалии развития нервной системы': { cases: 124, rate: 80.5 },
    'Врожденные деформации бедра': { cases: 1519, rate: 986.6 },
    'Неопределенность пола и псевдогермафродитизм': { cases: 1, rate: 0.65 },
    'Врожденный ихтиоз': { cases: 31, rate: 20.14 }
  }
  },

};

// Данные о качестве воды за 2015 год по регионам
const waterQualityData2015 = {
  'Arkhangel\'sk': {
    year: 2015,
    samples: 1250,
    compliant: 980,
    nonCompliant: 270,
    complianceRate: 78.4,
    parameters: {
      'Общая жесткость': { value: 8.2, unit: 'мг-экв/л', norm: 7.0, status: 'превышение' },
      'Железо': { value: 0.15, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.08, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 12.5, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 85.3, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Komi': {
    year: 2015,
    samples: 980,
    compliant: 750,
    nonCompliant: 230,
    complianceRate: 76.5,
    parameters: {
      'Общая жесткость': { value: 6.8, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.22, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.12, unit: 'мг/л', norm: 0.1, status: 'превышение' },
      'Нитраты': { value: 18.2, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 120.5, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Nenets': {
    year: 2015,
    samples: 145,
    compliant: 120,
    nonCompliant: 25,
    complianceRate: 82.8,
    parameters: {
      'Общая жесткость': { value: 5.2, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.08, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.05, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 8.5, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 45.2, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Pskov': {
    year: 2015,
    samples: 850,
    compliant: 680,
    nonCompliant: 170,
    complianceRate: 80.0,
    parameters: {
      'Общая жесткость': { value: 7.5, unit: 'мг-экв/л', norm: 7.0, status: 'превышение' },
      'Железо': { value: 0.18, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.09, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 22.8, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 95.6, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'CityofSt.Petersburg': {
    year: 2015,
    samples: 5420,
    compliant: 4850,
    nonCompliant: 570,
    complianceRate: 89.5,
    parameters: {
      'Общая жесткость': { value: 4.8, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.12, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.06, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 15.2, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 28.5, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Murmansk': {
    year: 2015,
    samples: 1120,
    compliant: 950,
    nonCompliant: 170,
    complianceRate: 84.8,
    parameters: {
      'Общая жесткость': { value: 3.5, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.25, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.11, unit: 'мг/л', norm: 0.1, status: 'превышение' },
      'Нитраты': { value: 9.8, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 125.3, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Leningrad': {
    year: 2015,
    samples: 1680,
    compliant: 1420,
    nonCompliant: 260,
    complianceRate: 84.5,
    parameters: {
      'Общая жесткость': { value: 5.8, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.20, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.07, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 19.5, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 78.2, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Karelia': {
    year: 2015,
    samples: 920,
    compliant: 780,
    nonCompliant: 140,
    complianceRate: 84.8,
    parameters: {
      'Общая жесткость': { value: 4.2, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.28, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.09, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 11.2, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 52.8, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Novgorod': {
    year: 2015,
    samples: 720,
    compliant: 580,
    nonCompliant: 140,
    complianceRate: 80.6,
    parameters: {
      'Общая жесткость': { value: 6.5, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.19, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.08, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 16.8, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 88.5, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Vologda': {
    year: 2015,
    samples: 1350,
    compliant: 1080,
    nonCompliant: 270,
    complianceRate: 80.0,
    parameters: {
      'Общая жесткость': { value: 7.8, unit: 'мг-экв/л', norm: 7.0, status: 'превышение' },
      'Железо': { value: 0.16, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.06, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 14.2, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 102.3, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  },
  'Kaliningrad': {
    year: 2015,
    samples: 1580,
    compliant: 1320,
    nonCompliant: 260,
    complianceRate: 83.5,
    parameters: {
      'Общая жесткость': { value: 6.2, unit: 'мг-экв/л', norm: 7.0, status: 'норма' },
      'Железо': { value: 0.14, unit: 'мг/л', norm: 0.3, status: 'норма' },
      'Марганец': { value: 0.05, unit: 'мг/л', norm: 0.1, status: 'норма' },
      'Нитраты': { value: 20.5, unit: 'мг/л', norm: 45.0, status: 'норма' },
      'Хлориды': { value: 115.8, unit: 'мг/л', norm: 350.0, status: 'норма' }
    }
  }
};

// Функция для преобразования данных из формата statistics в формат для компонента
const transformRegionData = (region) => {
  if (!region || !region.statistics) {
    return region; // Если данных нет или формат уже правильный, возвращаем как есть
  }

  const statistics = region.statistics;
  const diseases = [];
  let totalCases = 0;

  // Преобразуем statistics в массив diseases
  for (const [diseaseName, data] of Object.entries(statistics)) {
    if (data && typeof data.cases === 'number') {
      diseases.push({
        name: diseaseName,
        cases: data.cases,
        rate: data.rate || 0
      });
      totalCases += data.cases;
    }
  }

  // Вычисляем population из rate (rate = cases / population * 100000)
  // Используем среднее значение из всех заболеваний с rate > 0 для более точного результата
  let population = 0;
  const populationValues = [];
  for (const disease of diseases) {
    if (disease.rate > 0 && disease.cases > 0) {
      // rate = (cases / population) * 100000
      // population = (cases / rate) * 100000
      const calculatedPopulation = (disease.cases / disease.rate) * 100000;
      populationValues.push(calculatedPopulation);
    }
  }
  
  if (populationValues.length > 0) {
    // Вычисляем среднее значение
    const sum = populationValues.reduce((acc, val) => acc + val, 0);
    population = Math.round(sum / populationValues.length);
  }

  // Вычисляем percentage для каждого заболевания и сохраняем rate
  const diseasesWithPercentage = diseases.map(disease => ({
    name: disease.name,
    cases: disease.cases,
    rate: disease.rate || 0,
    percentage: totalCases > 0 ? (disease.cases / totalCases) * 100 : 0
  })).sort((a, b) => b.cases - a.cases); // Сортируем по количеству случаев

  // Вычисляем общий rate региона (на 100 тыс. человек)
  // rate = (totalCases / population) * 100000
  let totalRate = 0;
  if (population > 0 && totalCases > 0) {
    totalRate = (totalCases / population) * 100000;
  }

  return {
    regionKey: region.regionKey,
    regionName: region.name || region.regionName,
    population: population,
    totalCases: totalCases,
    totalRate: totalRate, // Общий rate на 100 тыс. человек
    diseases: diseasesWithPercentage
  };
};

// Преобразуем все регионы в нужный формат
const transformedRegionsData = {};
for (const [key, region] of Object.entries(regionsData)) {
  transformedRegionsData[key] = transformRegionData({ ...region, regionKey: key });
}

// Функция для получения цвета региона на основе rate (на 100 тыс. человек)
const getRegionColor = (rate) => {
  if (!rate || rate === 0) return '#dee2e6';
  
  // Если rate < 5000 на 100 тыс. (эквивалент 5% от населения): зеленый цвет
  if (rate < 5000) {
    return '#40c057';
  }
  
  // Если rate >= 5000: красный градиент
  // Нормализуем rate от 5000 до максимального значения (например, 20000)
  // Для расчета используем диапазон от 5000 до 20000 как максимальный
  const normalizedRate = Math.min((rate - 5000) / 15000, 1); // 0-1 диапазон
  
  // Градиент от #ffa8a8 (светло-красный) до #c92a2a (темно-красный)
  const redStart = 255; // #ffa8a8
  const redEnd = 201;   // #c92a2a
  const greenStart = 168;
  const greenEnd = 42;
  const blueStart = 168;
  const blueEnd = 42;
  
  const red = Math.round(redStart - (redStart - redEnd) * normalizedRate);
  const green = Math.round(greenStart - (greenStart - greenEnd) * normalizedRate);
  const blue = Math.round(blueStart - (blueStart - blueEnd) * normalizedRate);
  
  return `rgb(${red}, ${green}, ${blue})`;
};

const RussiaMap = ({ onRegionClick, selectedRegions, geoData, regionsData, regionsWithData, mapTransform, setMapTransform }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  
  const transform = mapTransform || { x: 0, y: 0, scale: 1 };

  const handleWheel = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, transform.scale + delta * transform.scale), 5);
    
    const scaleRatio = newScale / transform.scale;
    const newX = mouseX - (mouseX - transform.x) * scaleRatio;
    const newY = mouseY - (mouseY - transform.y) * scaleRatio;
    
    if (setMapTransform) {
      setMapTransform({ x: newX, y: newY, scale: newScale });
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'path') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    if (setMapTransform) {
      setMapTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [transform.scale, transform.x, transform.y]);

  const paths = useMemo(() => {
    if (!geoData || !geoData.features) {
      console.log('No geoData or features');
      return null;
    }

    console.log('GeoJSON features count:', geoData.features.length);
    console.log('Regions with data:', regionsWithData);
    
    // Получаем все NAME_1 из GeoJSON для сравнения
    const geoJsonRegionKeys = geoData.features.map(f => f.properties.NAME_1);
    console.log('Sample GeoJSON region keys:', geoJsonRegionKeys.slice(0, 10));

    const width = 1200;
    const height = 800;
    
    const projection = d3.geoMercator()
      .center([100, 65])
      .scale(600)
      .translate([width / 2, height / 2]);
    
    const pathGenerator = d3.geoPath().projection(projection);

    // Фильтруем регионы: показываем только те, которые есть в БД
    const filteredFeatures = regionsWithData && regionsWithData.length > 0
      ? geoData.features.filter(feature => regionsWithData.includes(feature.properties.NAME_1))
      : [];

    console.log('Filtered features count:', filteredFeatures.length);
    if (filteredFeatures.length === 0 && regionsWithData.length > 0) {
      console.warn('No matching regions found! GeoJSON keys:', geoJsonRegionKeys.slice(0, 5), 'DB keys:', regionsWithData.slice(0, 5));
    }

    return filteredFeatures.map((feature, index) => {
      const regionKey = feature.properties.NAME_1;
      const pathData = pathGenerator(feature);
      const centroid = pathGenerator.centroid(feature);
      
      // Вычисляем bounds региона для правильного приближения
      const bounds = pathGenerator.bounds(feature);
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      
      return {
        index,
        regionKey,
        pathData,
        centroid,
        bounds,
        width: dx,
        height: dy,
        data: regionsData?.[regionKey] || null
      };
    });
  }, [geoData, regionsData, regionsWithData]);

  if (!paths) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#868e96' }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Загрузка карты...</h2>
          <p>Пожалуйста, подождите</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%', 
        cursor: isDragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        position: 'relative'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg 
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
        style={{ display: 'block' }}
      >
        <rect width="1200" height="800" fill="#e9ecef" />
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`} style={{ transition: 'transform 0.6s ease-out' }}>
          {paths.map(({ index, regionKey, pathData, centroid, bounds, data }) => {
            const isSelected = selectedRegions && selectedRegions.includes(regionKey);
            const isHovered = hoveredRegion === regionKey;
            const color = data ? getRegionColor(data.totalRate || 0) : '#dee2e6';

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={isSelected ? "2" : "1"}
                  opacity={isSelected ? 1 : isHovered ? 0.9 : 0.8}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease'
                  }}
                  onClick={(e) => onRegionClick(regionKey, centroid, bounds, e)}
                  onMouseEnter={() => setHoveredRegion(regionKey)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
                {isSelected && centroid && !isNaN(centroid[0]) && (
                  <text
                    x={centroid[0]}
                    y={centroid[1]}
                    textAnchor="middle"
                    fill="#000"
                    fontSize="12"
                    fontWeight="bold"
                    pointerEvents="none"
                    style={{ 
                      userSelect: 'none',
                      textShadow: '1px 1px 2px white, -1px -1px 2px white'
                    }}
                  >
                    {regionNames[regionKey] || regionKey}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      
      {hoveredRegion && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.85)',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          pointerEvents: 'none',
          zIndex: 1000
        }}>
          {regionNames[hoveredRegion] || hoveredRegion}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [selectedRegions, setSelectedRegions] = useState([]); // Массив выбранных регионов (максимум 2)
  const [comparisonMode, setComparisonMode] = useState('compare'); // 'compare' или 'sum'
  const [showPanel, setShowPanel] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false); // Развернуто ли меню на весь экран
  const [geoData, setGeoData] = useState(null);
  const [regionsDataState, setRegionsDataState] = useState(transformedRegionsData);
  const [regionsWithData, setRegionsWithData] = useState(Object.keys(transformedRegionsData));
  const [mapTransform, setMapTransform] = useState({ x: 0, y: 0, scale: 1 });
  const mapRef = useRef(null);

  // Автоматическая загрузка GeoJSON карты при старте
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch('/gadm41_RUS_1.json', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        
        // Проверяем, что это валидный GeoJSON
        if (!json || !json.type) {
          throw new Error('Invalid GeoJSON format');
        }
        
        setGeoData(json);
      } catch (err) {
        console.error('Error loading GeoJSON:', err);
        // Не показываем ошибку пользователю, просто логируем
      }
    };

    loadGeoJSON();
  }, []);

  // Используем статические данные регионов (уже преобразованные)
  useEffect(() => {
    console.log('Using static regions data:', Object.keys(transformedRegionsData));
    setRegionsDataState(transformedRegionsData);
    setRegionsWithData(Object.keys(transformedRegionsData));
  }, []);

  // Автоматически открываем панель при выборе регионов
  useEffect(() => {
    if (selectedRegions.length > 0) {
      setShowPanel(true);
    }
  }, [selectedRegions]);

  // Автоматический расчет начального масштаба и позиции для отображения всех регионов
  useEffect(() => {
    if (geoData && regionsWithData.length > 0 && mapRef.current) {
      const container = mapRef.current;
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      // Создаем временную проекцию для расчета bounds всех регионов
      const width = 1200;
      const height = 800;
      const projection = d3.geoMercator()
        .center([100, 65])
        .scale(600)
        .translate([width / 2, height / 2]);
      
      const pathGenerator = d3.geoPath().projection(projection);
      
      // Находим все регионы с данными
      const featuresWithData = geoData.features.filter(f => 
        regionsWithData.includes(f.properties.NAME_1)
      );
      
      if (featuresWithData.length > 0) {
        // Вычисляем общий bounding box для всех регионов
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        featuresWithData.forEach(feature => {
          const bounds = pathGenerator.bounds(feature);
          minX = Math.min(minX, bounds[0][0]);
          minY = Math.min(minY, bounds[0][1]);
          maxX = Math.max(maxX, bounds[1][0]);
          maxY = Math.max(maxY, bounds[1][1]);
        });
        
        const regionWidth = maxX - minX;
        const regionHeight = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        
        // Вычисляем оптимальный scale с отступами
        const padding = 0.1; // 10% отступы
        const scaleX = (containerWidth * (1 - padding * 2)) / regionWidth;
        const scaleY = (containerHeight * (1 - padding * 2)) / regionHeight;
        const optimalScale = Math.min(scaleX, scaleY, 2); // Ограничиваем максимальный зум
        const initialScale = Math.max(0.5, optimalScale);
        
        // Центрируем все регионы
        const initialX = (containerWidth / 2) - (centerX * initialScale);
        const initialY = (containerHeight / 2) - (centerY * initialScale);
        
        setMapTransform({ x: initialX, y: initialY, scale: initialScale });
      }
    }
  }, [geoData, regionsWithData]);

  const handleRegionClick = (regionKey, centroid, bounds, event) => {
    // Проверяем, нажат ли Shift
    const isShiftPressed = event && event.shiftKey;
    
    if (isShiftPressed) {
      // Если Shift нажат, добавляем второй регион
      if (selectedRegions.length === 0) {
        // Если нет выбранных регионов, выбираем первый
        setSelectedRegions([regionKey]);
        setShowPanel(true);
      } else if (selectedRegions.length === 1) {
        // Если уже есть один регион, добавляем второй
        if (selectedRegions[0] !== regionKey) {
          setSelectedRegions([selectedRegions[0], regionKey]);
          setShowPanel(true);
        }
      } else {
        // Если уже выбрано 2 региона, заменяем второй
        if (selectedRegions[0] !== regionKey) {
          setSelectedRegions([selectedRegions[0], regionKey]);
        }
      }
    } else {
      // Обычный клик - выбираем только один регион
      setSelectedRegions([regionKey]);
      setShowPanel(true);
    }
    
    // Адаптивный зум и центрирование с использованием bounds для полного отображения региона
    if (bounds && mapRef.current) {
      const container = mapRef.current;
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      // Вычисляем размеры региона в координатах SVG
      const regionWidth = bounds[1][0] - bounds[0][0];
      const regionHeight = bounds[1][1] - bounds[0][1];
      
      // Вычисляем оптимальный scale, чтобы регион полностью помещался с отступами
      const padding = 0.15; // 15% отступы с каждой стороны
      const scaleX = (containerWidth * (1 - padding * 2)) / regionWidth;
      const scaleY = (containerHeight * (1 - padding * 2)) / regionHeight;
      const optimalScale = Math.min(scaleX, scaleY, 5); // Ограничиваем максимальный зум
      const newScale = Math.max(1, optimalScale);
      
      // Центрируем регион в viewport
      // Центр bounds региона
      const centerX = (bounds[0][0] + bounds[1][0]) / 2;
      const centerY = (bounds[0][1] + bounds[1][1]) / 2;
      
      // Преобразуем центр в координаты контейнера с учетом scale
      const newX = (containerWidth / 2) - (centerX * newScale);
      const newY = (containerHeight / 2) - (centerY * newScale);
      
      // Плавный переход
      setMapTransform({ x: newX, y: newY, scale: newScale });
    } else if (centroid && mapRef.current) {
      // Fallback на centroid, если bounds недоступны
      const container = mapRef.current;
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      const svgWidth = 1200;
      const targetWidth = containerWidth * 0.45;
      const optimalScale = (svgWidth / targetWidth) * 1.2;
      const newScale = Math.min(Math.max(1, optimalScale), 5);
      
      const newX = (containerWidth / 2) - (centroid[0] * newScale);
      const newY = (containerHeight / 2) - (centroid[1] * newScale);
      
      setMapTransform({ x: newX, y: newY, scale: newScale });
    }
  };


  // Получаем данные для выбранных регионов
  const region1Data = selectedRegions.length > 0 ? regionsDataState[selectedRegions[0]] : null;
  const region2Data = selectedRegions.length > 1 ? regionsDataState[selectedRegions[1]] : null;
  
  const region1Name = selectedRegions.length > 0 
    ? (regionsDataState[selectedRegions[0]]?.regionName || regionNames[selectedRegions[0]] || selectedRegions[0]) 
    : '';
  const region2Name = selectedRegions.length > 1 
    ? (regionsDataState[selectedRegions[1]]?.regionName || regionNames[selectedRegions[1]] || selectedRegions[1]) 
    : '';
  
  // Функция для суммирования данных двух регионов
  const getSummedData = (data1, data2) => {
    if (!data1 || !data2) return null;
    
    // Создаем карту заболеваний по имени для быстрого поиска
    const diseaseMap = new Map();
    
    // Добавляем заболевания из первого региона
    data1.diseases.forEach(disease => {
      diseaseMap.set(disease.name, {
        name: disease.name,
        cases: disease.cases,
        rate: disease.rate || 0
      });
    });
    
    // Добавляем/суммируем заболевания из второго региона
    data2.diseases.forEach(disease => {
      const existing = diseaseMap.get(disease.name);
      if (existing) {
        existing.cases += disease.cases;
        existing.rate = (existing.rate + (disease.rate || 0)) / 2; // Среднее rate
      } else {
        diseaseMap.set(disease.name, {
          name: disease.name,
          cases: disease.cases,
          rate: disease.rate || 0
        });
      }
    });
    
    const diseases = Array.from(diseaseMap.values());
    const totalCases = diseases.reduce((sum, d) => sum + d.cases, 0);
    const totalRate = data1.totalRate && data2.totalRate 
      ? (data1.totalRate + data2.totalRate) / 2 
      : (data1.totalRate || data2.totalRate || 0);
    const population = data1.population && data2.population 
      ? data1.population + data2.population 
      : (data1.population || data2.population || 0);
    
    // Вычисляем проценты
    const diseasesWithPercentage = diseases.map(disease => ({
      ...disease,
      percentage: totalCases > 0 ? (disease.cases / totalCases) * 100 : 0
    })).sort((a, b) => b.cases - a.cases);
    
    return {
      regionName: `${region1Name} + ${region2Name}`,
      totalCases,
      totalRate,
      population,
      diseases: diseasesWithPercentage
    };
  };
  
  // Функция для сравнения данных двух регионов
  const getComparisonData = (data1, data2) => {
    if (!data1 || !data2) return null;
    
    const diseaseMap = new Map();
    
    // Добавляем все уникальные заболевания
    [...data1.diseases, ...data2.diseases].forEach(disease => {
      if (!diseaseMap.has(disease.name)) {
        diseaseMap.set(disease.name, {
          name: disease.name,
          region1Cases: 0,
          region2Cases: 0,
          region1Rate: 0,
          region2Rate: 0
        });
      }
    });
    
    // Заполняем данные из первого региона
    data1.diseases.forEach(disease => {
      const entry = diseaseMap.get(disease.name);
      if (entry) {
        entry.region1Cases = disease.cases;
        entry.region1Rate = disease.rate || 0;
      }
    });
    
    // Заполняем данные из второго региона
    data2.diseases.forEach(disease => {
      const entry = diseaseMap.get(disease.name);
      if (entry) {
        entry.region2Cases = disease.cases;
        entry.region2Rate = disease.rate || 0;
      }
    });
    
    return Array.from(diseaseMap.values()).sort((a, b) => 
      (b.region1Cases + b.region2Cases) - (a.region1Cases + a.region2Cases)
    );
  };
  
  const summedData = region1Data && region2Data ? getSummedData(region1Data, region2Data) : null;
  const comparisonData = region1Data && region2Data ? getComparisonData(region1Data, region2Data) : null;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div style={{
        width: showPanel ? (isPanelExpanded ? '100%' : '400px') : '0',
        backgroundColor: '#fff',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 10,
        position: isPanelExpanded ? 'absolute' : 'relative',
        height: isPanelExpanded ? '100vh' : 'auto'
      }}>
        {showPanel && (
          <div style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#212529', fontSize: '20px' }}>
                {selectedRegions.length === 1 ? region1Name : `${region1Name} и ${region2Name}`}
              </h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                  style={{ 
                    background: 'none', 
                    border: '1px solid #dee2e6', 
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '14px', 
                    cursor: 'pointer', 
                    color: '#495057'
                  }}
                  title={isPanelExpanded ? 'Свернуть' : 'Развернуть на весь экран'}
                >
                  {isPanelExpanded ? '⊟' : '⊞'}
                </button>
                <button 
                  onClick={() => {
                    setShowPanel(false);
                    setSelectedRegions([]);
                    setIsPanelExpanded(false);
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#868e96' }}
                >×</button>
              </div>
            </div>

            {/* Выбор режима для двух регионов */}
            {selectedRegions.length === 2 && (
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setComparisonMode('compare')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: comparisonMode === 'compare' ? '#495057' : '#e9ecef',
                    color: comparisonMode === 'compare' ? '#fff' : '#495057',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: comparisonMode === 'compare' ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  Сравнение
                </button>
                <button
                  onClick={() => setComparisonMode('sum')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: comparisonMode === 'sum' ? '#495057' : '#e9ecef',
                    color: comparisonMode === 'sum' ? '#fff' : '#495057',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: comparisonMode === 'sum' ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  Суммирование
                </button>
              </div>
            )}

            {/* Контент для одного региона */}
            {selectedRegions.length === 1 && region1Data ? (
              <>
                <div style={{ 
                  backgroundColor: getRegionColor(region1Data.totalRate || 0), 
                  color: '#fff', 
                  padding: '15px', 
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'normal' }}>Всего случаев</h3>
                  <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
                    {region1Data.totalCases.toLocaleString('ru-RU')}
                  </p>
                  {region1Data.totalRate > 0 && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                      {region1Data.totalRate.toFixed(1)} на 100 тыс. человек
                    </p>
                  )}
                </div>

                <h3 style={{ color: '#495057', marginBottom: '15px' }}>Распространенные заболевания</h3>

                <div style={{ marginBottom: '30px' }}>
                  {region1Data.diseases.map((disease, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>{disease.name}</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                          {disease.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${disease.percentage}%`,
                          height: '100%',
                          backgroundColor: getRegionColor(region1Data.totalRate || 0),
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#868e96' }}>
                        {disease.cases.toLocaleString('ru-RU')} случаев
                      </span>
                    </div>
                  ))}
                </div>

                <h3 style={{ color: '#495057', marginBottom: '15px' }}>Статистика по заболеваниям</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={region1Data.diseases}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} style={{ fontSize: '10px' }} />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString('ru-RU'), 'случаев']} />
                    <Bar dataKey="cases" fill={getRegionColor(region1Data.totalRate || 0)} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Статистика качества воды за 2015 год */}
                {waterQualityData2015[selectedRegions[0]] && (
                  <>
                    <h3 style={{ color: '#495057', marginBottom: '15px', marginTop: '30px' }}>Качество воды (2015 год)</h3>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '15px', 
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Всего проб:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                          {waterQualityData2015[selectedRegions[0]].samples.toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Соответствует норме:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#40c057' }}>
                          {waterQualityData2015[selectedRegions[0]].compliant.toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Не соответствует:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#c92a2a' }}>
                          {waterQualityData2015[selectedRegions[0]].nonCompliant.toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Процент соответствия:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                          {waterQualityData2015[selectedRegions[0]].complianceRate.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#e9ecef', 
                        borderRadius: '4px', 
                        overflow: 'hidden',
                        marginBottom: '15px'
                      }}>
                        <div style={{
                          width: `${waterQualityData2015[selectedRegions[0]].complianceRate}%`,
                          height: '100%',
                          backgroundColor: waterQualityData2015[selectedRegions[0]].complianceRate >= 80 ? '#40c057' : '#ffa8a8',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>

                    <h4 style={{ color: '#495057', marginBottom: '10px', fontSize: '14px' }}>Показатели качества воды</h4>
                    <div style={{ marginBottom: '20px' }}>
                      {Object.entries(waterQualityData2015[selectedRegions[0]].parameters).map(([paramName, paramData], index) => (
                        <div key={index} style={{ 
                          marginBottom: '12px', 
                          padding: '10px', 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: '6px',
                          borderLeft: `4px solid ${paramData.status === 'норма' ? '#40c057' : '#c92a2a'}`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontSize: '13px', color: '#495057', fontWeight: 'bold' }}>{paramName}</span>
                            <span style={{ 
                              fontSize: '12px', 
                              color: paramData.status === 'норма' ? '#40c057' : '#c92a2a',
                              fontWeight: 'bold'
                            }}>
                              {paramData.status === 'норма' ? '✓ Норма' : '⚠ Превышение'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#868e96' }}>
                            <span>Значение: {paramData.value} {paramData.unit}</span>
                            <span>Норма: {paramData.norm} {paramData.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : selectedRegions.length === 2 && comparisonMode === 'sum' && summedData ? (
              /* Контент для суммирования двух регионов */
              <>
                <div style={{ 
                  backgroundColor: getRegionColor(summedData.totalRate || 0), 
                  color: '#fff', 
                  padding: '15px', 
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'normal' }}>Всего случаев (сумма)</h3>
                  <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>
                    {summedData.totalCases.toLocaleString('ru-RU')}
                  </p>
                  {summedData.totalRate > 0 && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                      {summedData.totalRate.toFixed(1)} на 100 тыс. человек (среднее)
                    </p>
                  )}
                </div>

                <h3 style={{ color: '#495057', marginBottom: '15px' }}>Заболевания (сумма)</h3>

                <div style={{ marginBottom: '30px' }}>
                  {summedData.diseases.map((disease, index) => (
                    <div key={index} style={{ marginBottom: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>{disease.name}</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                          {disease.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${disease.percentage}%`,
                          height: '100%',
                          backgroundColor: getRegionColor(summedData.totalRate || 0),
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#868e96' }}>
                        {disease.cases.toLocaleString('ru-RU')} случаев
                      </span>
                    </div>
                  ))}
                </div>

                <h3 style={{ color: '#495057', marginBottom: '15px' }}>Статистика по заболеваниям</h3>

                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={summedData.diseases}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} style={{ fontSize: '10px' }} />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString('ru-RU'), 'случаев']} />
                    <Bar dataKey="cases" fill={getRegionColor(summedData.totalRate || 0)} />
                  </BarChart>
                </ResponsiveContainer>

                {/* Статистика качества воды для двух регионов (сумма) */}
                {selectedRegions.length === 2 && waterQualityData2015[selectedRegions[0]] && waterQualityData2015[selectedRegions[1]] && (
                  <>
                    <h3 style={{ color: '#495057', marginBottom: '15px', marginTop: '30px' }}>Качество воды (2015 год) - Сумма</h3>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '15px', 
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Всего проб (сумма):</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                          {(waterQualityData2015[selectedRegions[0]].samples + waterQualityData2015[selectedRegions[1]].samples).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Соответствует норме (сумма):</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#40c057' }}>
                          {(waterQualityData2015[selectedRegions[0]].compliant + waterQualityData2015[selectedRegions[1]].compliant).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Не соответствует (сумма):</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#c92a2a' }}>
                          {(waterQualityData2015[selectedRegions[0]].nonCompliant + waterQualityData2015[selectedRegions[1]].nonCompliant).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <span style={{ fontSize: '14px', color: '#495057' }}>Процент соответствия (среднее):</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                          {((waterQualityData2015[selectedRegions[0]].complianceRate + waterQualityData2015[selectedRegions[1]].complianceRate) / 2).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : selectedRegions.length === 2 && comparisonMode === 'compare' && comparisonData ? (
              /* Контент для сравнения двух регионов */
              <>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ 
                    flex: 1,
                    backgroundColor: getRegionColor(region1Data.totalRate || 0), 
                    color: '#fff', 
                    padding: '15px', 
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'normal' }}>{region1Name}</h3>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                      {region1Data.totalCases.toLocaleString('ru-RU')}
                    </p>
                    {region1Data.totalRate > 0 && (
                      <p style={{ margin: '5px 0 0 0', fontSize: '10px', opacity: 0.9 }}>
                        {region1Data.totalRate.toFixed(1)} на 100 тыс.
                      </p>
                    )}
                  </div>
                  <div style={{ 
                    flex: 1,
                    backgroundColor: getRegionColor(region2Data.totalRate || 0), 
                    color: '#fff', 
                    padding: '15px', 
                    borderRadius: '8px'
                  }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: 'normal' }}>{region2Name}</h3>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                      {region2Data.totalCases.toLocaleString('ru-RU')}
                    </p>
                    {region2Data.totalRate > 0 && (
                      <p style={{ margin: '5px 0 0 0', fontSize: '10px', opacity: 0.9 }}>
                        {region2Data.totalRate.toFixed(1)} на 100 тыс.
                      </p>
                    )}
                  </div>
                </div>

                <h3 style={{ color: '#495057', marginBottom: '15px' }}>Сравнение заболеваний</h3>

                <div style={{ marginBottom: '30px' }}>
                  {comparisonData.map((disease, index) => (
                    <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#495057', fontWeight: 'bold' }}>{disease.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#868e96', marginBottom: '3px' }}>{region1Name}</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                            {disease.region1Cases.toLocaleString('ru-RU')} случаев
                          </div>
                          {disease.region1Rate > 0 && (
                            <div style={{ fontSize: '10px', color: '#868e96' }}>
                              {disease.region1Rate.toFixed(1)} на 100 тыс.
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '11px', color: '#868e96', marginBottom: '3px' }}>{region2Name}</div>
                          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#212529' }}>
                            {disease.region2Cases.toLocaleString('ru-RU')} случаев
                          </div>
                          {disease.region2Rate > 0 && (
                            <div style={{ fontSize: '10px', color: '#868e96' }}>
                              {disease.region2Rate.toFixed(1)} на 100 тыс.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Статистика качества воды для двух регионов (сравнение) */}
                {waterQualityData2015[selectedRegions[0]] && waterQualityData2015[selectedRegions[1]] && (
                  <>
                    <h3 style={{ color: '#495057', marginBottom: '15px', marginTop: '30px' }}>Качество воды (2015 год) - Сравнение</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                      <div style={{ 
                        flex: 1,
                        backgroundColor: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px'
                      }}>
                        <h4 style={{ fontSize: '13px', color: '#495057', marginBottom: '10px', fontWeight: 'bold' }}>{region1Name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Всего проб:</span>
                          <span style={{ fontWeight: 'bold', color: '#212529' }}>
                            {waterQualityData2015[selectedRegions[0]].samples.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Соответствует:</span>
                          <span style={{ fontWeight: 'bold', color: '#40c057' }}>
                            {waterQualityData2015[selectedRegions[0]].compliant.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Не соответствует:</span>
                          <span style={{ fontWeight: 'bold', color: '#c92a2a' }}>
                            {waterQualityData2015[selectedRegions[0]].nonCompliant.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Процент:</span>
                          <span style={{ fontWeight: 'bold', color: '#212529' }}>
                            {waterQualityData2015[selectedRegions[0]].complianceRate.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '6px', 
                          backgroundColor: '#e9ecef', 
                          borderRadius: '3px', 
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${waterQualityData2015[selectedRegions[0]].complianceRate}%`,
                            height: '100%',
                            backgroundColor: waterQualityData2015[selectedRegions[0]].complianceRate >= 80 ? '#40c057' : '#ffa8a8'
                          }} />
                        </div>
                      </div>
                      <div style={{ 
                        flex: 1,
                        backgroundColor: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px'
                      }}>
                        <h4 style={{ fontSize: '13px', color: '#495057', marginBottom: '10px', fontWeight: 'bold' }}>{region2Name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Всего проб:</span>
                          <span style={{ fontWeight: 'bold', color: '#212529' }}>
                            {waterQualityData2015[selectedRegions[1]].samples.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Соответствует:</span>
                          <span style={{ fontWeight: 'bold', color: '#40c057' }}>
                            {waterQualityData2015[selectedRegions[1]].compliant.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Не соответствует:</span>
                          <span style={{ fontWeight: 'bold', color: '#c92a2a' }}>
                            {waterQualityData2015[selectedRegions[1]].nonCompliant.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px' }}>
                          <span style={{ color: '#868e96' }}>Процент:</span>
                          <span style={{ fontWeight: 'bold', color: '#212529' }}>
                            {waterQualityData2015[selectedRegions[1]].complianceRate.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '6px', 
                          backgroundColor: '#e9ecef', 
                          borderRadius: '3px', 
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${waterQualityData2015[selectedRegions[1]].complianceRate}%`,
                            height: '100%',
                            backgroundColor: waterQualityData2015[selectedRegions[1]].complianceRate >= 80 ? '#40c057' : '#ffa8a8'
                          }} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
                <p style={{ margin: 0, color: '#856404', fontSize: '14px' }}>
                  <strong>Нет данных для выбранных регионов</strong>
                </p>
                <p style={{ margin: '10px 0 0 0', color: '#856404', fontSize: '13px' }}>
                  Данные для этих регионов отсутствуют в статическом массиве данных
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#f8f9fa',
        opacity: isPanelExpanded ? 0 : 1,
        transition: 'opacity 0.3s ease',
        pointerEvents: isPanelExpanded ? 'none' : 'auto'
      }}>
        <div style={{ padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 5 }}>
          <h1 style={{ margin: 0, color: '#212529', fontSize: '24px' }}>
            Заболевания беременных по регионам России
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#868e96', fontSize: '14px' }}>
            Кликните на регион для просмотра статистики. Удерживайте Shift и кликните на второй регион для сравнения или суммирования. Используйте колесико мыши для зума.
          </p>
        </div>

        <div ref={mapRef} style={{ flex: 1, position: 'relative' }}>
            <RussiaMap
              onRegionClick={handleRegionClick}
              selectedRegions={selectedRegions} 
              geoData={geoData}
              regionsData={regionsDataState}
              regionsWithData={regionsWithData}
              mapTransform={mapTransform}
              setMapTransform={setMapTransform}
            />
        </div>

        <div style={{ position: 'absolute', bottom: '20px', right: '20px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#495057' }}>Уровень заболеваемости</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#40c057', borderRadius: '4px' }} />
              <span style={{ fontSize: '11px', color: '#868e96' }}>&lt; 5000 на 100 тыс.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '100px', height: '10px', background: 'linear-gradient(to right, #ffa8a8, #c92a2a)', borderRadius: '5px' }} />
              <span style={{ fontSize: '11px', color: '#868e96' }}>≥ 5000 на 100 тыс.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;