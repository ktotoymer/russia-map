const mongoose = require('mongoose');
require('dotenv').config();
const Region = require('../models/Region');

// Соответствие английских названий регионов русским
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
  'Nizhegorod': 'Нижегородская область',
  'NorthOssetia': 'Северная Осетия',
  'Novgorod': 'Новгородская область',
  'Novosibirsk': 'Новосибирская область',
  'Omsk': 'Омская область',
  'Orel': 'Орловская область',
  'Orenburg': 'Оренбургская область',
  'Penza': 'Пензенская область',
  'Perm\'': 'Пермский край',
  'Primor\'ye': 'Приморский край',
  'Pskov': 'Псковская область',
  'Rostov': 'Ростовская область',
  'Ryazan\'': 'Рязанская область',
  'Sakha': 'Якутия',
  'Sakhalin': 'Сахалинская область',
  'Samara': 'Самарская область',
  'Saratov': 'Саратовская область',
  'Smolensk': 'Смоленская область',
  'Stavropol\'': 'Ставропольский край',
  'Sverdlovsk': 'Свердловская область',
  'Tambov': 'Тамбовская область',
  'Tatarstan': 'Татарстан',
  'Tomsk': 'Томская область',
  'Tula': 'Тульская область',
  'Tuva': 'Тува',
  'Tver\'': 'Тверская область',
  'Tyumen\'': 'Тюменская область',
  'Udmurt': 'Удмуртия',
  'Ul\'yanovsk': 'Ульяновская область',
  'Vladimir': 'Владимирская область',
  'Volgograd': 'Волгоградская область',
  'Vologda': 'Вологодская область',
  'Voronezh': 'Воронежская область',
  'Yamal-Nenets': 'ЯНАО',
  'Yaroslavl\'': 'Ярославская область',
  'Yevrey': 'Еврейская АО',
  'Zabaykal\'ye': 'Забайкальский край'
};

// Примерные данные по регионам (из исходного кода)
const regionsData = {
  'MoscowCity': {
    totalCases: 15420,
    diseases: [
      { name: 'Гестационный диабет', cases: 4500, percentage: 29.2 },
      { name: 'Анемия', cases: 3800, percentage: 24.6 },
      { name: 'Преэклампсия', cases: 2900, percentage: 18.8 },
      { name: 'Гестоз', cases: 2420, percentage: 15.7 },
      { name: 'Плацентарная недостаточность', cases: 1800, percentage: 11.7 }
    ]
  },
  'CityofSt.Petersburg': {
    totalCases: 12300,
    diseases: [
      { name: 'Анемия', cases: 4100, percentage: 33.3 },
      { name: 'Гестационный диабет', cases: 3200, percentage: 26.0 },
      { name: 'Преэклампсия', cases: 2500, percentage: 20.3 },
      { name: 'Гестоз', cases: 1600, percentage: 13.0 },
      { name: 'Угроза прерывания', cases: 900, percentage: 7.3 }
    ]
  },
  'Moskva': {
    totalCases: 18900,
    diseases: [
      { name: 'Анемия', cases: 5800, percentage: 30.7 },
      { name: 'Гестационный диабет', cases: 5100, percentage: 27.0 },
      { name: 'Преэклампсия', cases: 3600, percentage: 19.0 },
      { name: 'Гестоз', cases: 2900, percentage: 15.3 },
      { name: 'Плацентарная недостаточность', cases: 1500, percentage: 7.9 }
    ]
  },
  'Krasnodar': {
    totalCases: 11200,
    diseases: [
      { name: 'Гестоз', cases: 3800, percentage: 33.9 },
      { name: 'Анемия', cases: 3200, percentage: 28.6 },
      { name: 'Гестационный диабет', cases: 2100, percentage: 18.8 },
      { name: 'Преэклампсия', cases: 1500, percentage: 13.4 },
      { name: 'Угроза прерывания', cases: 600, percentage: 5.4 }
    ]
  },
  'Sverdlovsk': {
    totalCases: 9800,
    diseases: [
      { name: 'Анемия', cases: 3500, percentage: 35.7 },
      { name: 'Гестационный диабет', cases: 2600, percentage: 26.5 },
      { name: 'Преэклампсия', cases: 1800, percentage: 18.4 },
      { name: 'Гестоз', cases: 1200, percentage: 12.2 },
      { name: 'Плацентарная недостаточность', cases: 700, percentage: 7.1 }
    ]
  },
  'Tatarstan': {
    totalCases: 8500,
    diseases: [
      { name: 'Анемия', cases: 2900, percentage: 34.1 },
      { name: 'Гестационный диабет', cases: 2200, percentage: 25.9 },
      { name: 'Гестоз', cases: 1700, percentage: 20.0 },
      { name: 'Преэклампсия', cases: 1100, percentage: 12.9 },
      { name: 'Угроза прерывания', cases: 600, percentage: 7.1 }
    ]
  }
};

// Примерные данные о населении регионов (в тысячах человек, приблизительно)
const populationData = {
  'MoscowCity': 12615, // ~12.6 млн
  'CityofSt.Petersburg': 5398, // ~5.4 млн
  'Moskva': 7719, // ~7.7 млн
  'Krasnodar': 5661, // ~5.7 млн
  'Sverdlovsk': 4325, // ~4.3 млн
  'Tatarstan': 3903 // ~3.9 млн
};

async function migrateData() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/russia-map';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Очистить существующие данные (опционально)
    await Region.deleteMany({});
    console.log('Cleared existing regions');
    
    // Мигрировать данные
    const regionsToInsert = [];
    
    for (const [regionKey, data] of Object.entries(regionsData)) {
      const population = populationData[regionKey];
      
      if (!population) {
        console.warn(`Warning: No population data for ${regionKey}, skipping...`);
        continue;
      }
      
      const region = {
        regionKey,
        regionName: regionNames[regionKey] || regionKey,
        population: population * 1000, // Конвертируем в абсолютные числа
        totalCases: data.totalCases,
        diseases: data.diseases
      };
      
      regionsToInsert.push(region);
    }
    
    if (regionsToInsert.length > 0) {
      await Region.insertMany(regionsToInsert);
      console.log(`Successfully migrated ${regionsToInsert.length} regions`);
      
      // Вывести информацию о мигрированных регионах
      for (const region of regionsToInsert) {
        const percentage = ((region.totalCases / region.population) * 100).toFixed(2);
        console.log(`  - ${region.regionName}: ${region.totalCases} cases, ${region.population.toLocaleString()} population (${percentage}%)`);
      }
    } else {
      console.log('No regions to migrate');
    }
    
    await mongoose.disconnect();
    console.log('Migration completed');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateData();

