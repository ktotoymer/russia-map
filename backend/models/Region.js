const mongoose = require('mongoose');

// Гибкая схема, которая поддерживает оба формата данных
const regionSchema = new mongoose.Schema({
  regionKey: {
    type: String,
    index: true
  },
  // Поддержка обоих форматов: name (из БД) и regionName (ожидаемый формат)
  name: String,
  regionName: String,
  // Поддержка обоих форматов: statistics (из БД) и diseases (ожидаемый формат)
  statistics: mongoose.Schema.Types.Mixed,
  diseases: [mongoose.Schema.Types.Mixed],
  population: Number,
  totalCases: Number
}, {
  timestamps: true,
  strict: false // Разрешаем дополнительные поля
});

// Указываем имя коллекции явно, так как в БД данные хранятся в коллекции 'regions'
module.exports = mongoose.model('Region', regionSchema, 'regions');

