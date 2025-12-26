const express = require('express');
const router = express.Router();
const Region = require('../models/Region');

// Функция для преобразования данных из формата БД в формат для frontend
function transformRegionData(region) {
  if (!region) {
    console.warn('transformRegionData received null/undefined region');
    return null;
  }

  // Если данные уже в правильном формате (есть diseases массив)
  if (region.diseases && Array.isArray(region.diseases) && region.population && region.totalCases) {
    return region;
  }

  // Преобразуем из формата со statistics
  if (region.statistics) {
    const statistics = region.statistics;
    const diseases = [];
    let totalCases = 0;

    // Преобразуем statistics в массив diseases
    for (const [diseaseName, data] of Object.entries(statistics)) {
      if (data && typeof data.cases === 'number') {
        diseases.push({
          name: diseaseName,
          cases: data.cases,
          rate: data.rate || 0 // Сохраняем rate для расчета population
        });
        totalCases += data.cases;
      }
    }

    // Вычисляем population из rate (rate = cases / population * 100000)
    // Используем первое заболевание с rate > 0 для расчета
    let population = 0;
    for (const disease of diseases) {
      if (disease.rate > 0 && disease.cases > 0) {
        // rate = (cases / population) * 100000
        // population = (cases / rate) * 100000
        population = Math.round((disease.cases / disease.rate) * 100000);
        break;
      }
    }

    // Вычисляем percentage для каждого заболевания (процент от totalCases)
    const diseasesWithPercentage = diseases.map(disease => ({
      name: disease.name,
      cases: disease.cases,
      percentage: totalCases > 0 ? (disease.cases / totalCases) * 100 : 0
    }));

    return {
      regionKey: region.regionKey,
      regionName: region.name || region.regionName,
      population: population,
      totalCases: totalCases,
      diseases: diseasesWithPercentage.sort((a, b) => b.cases - a.cases) // Сортируем по количеству случаев
    };
  }

  return region;
}

// GET /api/regions - получить все регионы с данными
router.get('/', async (req, res) => {
  try {
    console.log('Fetching regions from database...');
    let regions = await Region.find({}).select('-__v -createdAt -updatedAt');
    console.log(`Found ${regions.length} regions using Mongoose model`);
    
    // Если модель не нашла данные, попробуем прямое обращение к коллекции
    if (regions.length === 0) {
      console.log('No regions found via model. Trying direct collection access...');
      try {
        const mongoose = require('mongoose');
        const db = mongoose.connection.db;
        
        if (!db) {
          throw new Error('Database connection not available');
        }
        
        // Используем правильный метод для получения списка коллекций
        const collections = await db.admin().listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Попробуем получить данные напрямую из коллекции
        const collection = db.collection('regions');
        const rawRegions = await collection.find({}).toArray();
        console.log(`Found ${rawRegions.length} regions via direct collection access`);
        
        if (rawRegions.length > 0) {
          // Преобразуем raw документы в формат, который понимает transformRegionData
          regions = rawRegions.map(doc => {
            // Преобразуем _id в строку, если нужно
            const region = { ...doc };
            if (region._id) {
              region._id = region._id.toString();
            }
            return region;
          });
        }
      } catch (dbError) {
        console.error('Error accessing database directly:', dbError);
        // Продолжаем с пустым массивом
      }
    }
    
    // Фильтруем null/undefined значения после трансформации
    const transformedRegions = regions
      .map(transformRegionData)
      .filter(region => region !== null && region !== undefined);
    
    console.log(`Transformed ${transformedRegions.length} regions`);
    res.json(transformedRegions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/regions/:regionKey - получить конкретный регион
router.get('/:regionKey', async (req, res) => {
  try {
    const region = await Region.findOne({ regionKey: req.params.regionKey })
      .select('-__v -createdAt -updatedAt');
    
    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }
    
    const transformedRegion = transformRegionData(region);
    res.json(transformedRegion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

