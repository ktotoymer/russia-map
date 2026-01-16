# Russia Map Project

Веб-приложение для визуализации данных о заболеваниях беременных по регионам России.

## 📋 Требования

### Для локального запуска:
- **Node.js** версии 18 или выше ([скачать](https://nodejs.org/))
- **npm** (устанавливается вместе с Node.js)
- **MongoDB** версии 7 или выше ([скачать](https://www.mongodb.com/try/download/community))

### Для запуска через Docker:
- **Docker Desktop** ([скачать](https://www.docker.com/products/docker-desktop/))
  - Windows: Docker Desktop for Windows
  - macOS: Docker Desktop for Mac
  - Linux: Docker Engine + Docker Compose

## 🚀 Быстрый старт

### Способ 1: Запуск через Docker (рекомендуется)

Самый простой способ запустить все сервисы одной командой.

#### Windows

1. **Скачайте проект:**
   ```powershell
   git clone https://github.com/ktotoymer/russia-map.git
   cd russia-map
   ```

2. **Убедитесь, что Docker Desktop запущен**

3. **Запустите все сервисы:**
   ```powershell
   docker-compose up --build
   ```
   Или используйте новую команду:
   ```powershell
   docker compose up --build
   ```

4. **Откройте в браузере:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

#### macOS / Linux

1. **Скачайте проект:**
   ```bash
   git clone https://github.com/ktotoymer/russia-map.git
   cd russia-map
   ```

2. **Убедитесь, что Docker запущен:**
   ```bash
   docker info
   ```

3. **Запустите все сервисы:**
   ```bash
   docker-compose up --build
   ```
   Или используйте скрипт (macOS):
   ```bash
   chmod +x docker-run.sh
   ./docker-run.sh up --build
   ```

4. **Откройте в браузере:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

**Остановка сервисов:**
```bash
docker-compose down
```

---

### Способ 2: Локальный запуск (для разработки)

#### Windows

1. **Установите зависимости:**

   Откройте PowerShell или Command Prompt в корне проекта:
   ```powershell
   # Установка зависимостей frontend
   npm install
   
   # Установка зависимостей backend
   cd backend
   npm install
   cd ..
   ```

2. **Настройте MongoDB:**
   
   Убедитесь, что MongoDB запущен и работает на порту 27017.
   
   Если MongoDB установлен как служба Windows, он должен запускаться автоматически.
   Проверить можно через:
   ```powershell
   Get-Service MongoDB
   ```

3. **Настройте переменные окружения:**
   
   Создайте файл `backend/.env` на основе `env.example.txt`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/russia-map
   PORT=3001
   NODE_ENV=development
   ```

4. **Запустите backend:**
   ```powershell
   cd backend
   npm start
   ```
   Backend будет доступен на http://localhost:3001

5. **В новом терминале запустите frontend:**
   ```powershell
   npm start
   ```
   Frontend автоматически откроется в браузере на http://localhost:3000

#### macOS

1. **Установите зависимости:**
   ```bash
   # Установка зависимостей frontend
   npm install
   
   # Установка зависимостей backend
   cd backend
   npm install
   cd ..
   ```

2. **Настройте MongoDB:**
   
   Если MongoDB установлен через Homebrew:
   ```bash
   # Запуск MongoDB
   brew services start mongodb-community
   
   # Проверка статуса
   brew services list
   ```
   
   Или если установлен через установщик:
   ```bash
   # Запуск MongoDB
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Настройте переменные окружения:**
   
   Создайте файл `backend/.env`:
   ```bash
   cp env.example.txt backend/.env
   ```
   
   Отредактируйте `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/russia-map
   PORT=3001
   NODE_ENV=development
   ```

4. **Запустите backend:**
   ```bash
   cd backend
   npm start
   ```
   Или для разработки с автоперезагрузкой:
   ```bash
   npm run dev
   ```

5. **В новом терминале запустите frontend:**
   ```bash
   npm start
   ```

#### Linux (Ubuntu/Debian)

1. **Установите зависимости:**
   ```bash
   # Установка зависимостей frontend
   npm install
   
   # Установка зависимостей backend
   cd backend
   npm install
   cd ..
   ```

2. **Настройте MongoDB:**
   
   ```bash
   # Запуск MongoDB
   sudo systemctl start mongod
   
   # Проверка статуса
   sudo systemctl status mongod
   
   # Включение автозапуска при загрузке системы
   sudo systemctl enable mongod
   ```

3. **Настройте переменные окружения:**
   
   Создайте файл `backend/.env`:
   ```bash
   cp env.example.txt backend/.env
   ```
   
   Отредактируйте `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/russia-map
   PORT=3001
   NODE_ENV=development
   ```

4. **Запустите backend:**
   ```bash
   cd backend
   npm start
   ```
   Или для разработки с автоперезагрузкой:
   ```bash
   npm run dev
   ```

5. **В новом терминале запустите frontend:**
   ```bash
   npm start
   ```

---

## 📦 Структура проекта

```
russia-map/
├── backend/              # Backend API (Node.js + Express + MongoDB)
│   ├── models/           # Модели данных
│   ├── routes/           # API маршруты
│   ├── scripts/          # Скрипты миграции данных
│   └── server.js         # Главный файл сервера
├── public/               # Статические файлы
│   └── gadm41_RUS_1.json # GeoJSON карта России
├── src/                  # Исходный код React приложения
│   └── App.js            # Главный компонент
├── docker-compose.yml    # Конфигурация Docker Compose
├── Dockerfile            # Dockerfile для frontend
└── package.json          # Зависимости frontend
```

## 🔧 Полезные команды

### Docker

```bash
# Запуск в фоновом режиме
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f frontend
docker-compose logs -f backend

# Остановка всех сервисов
docker-compose down

# Пересборка образов
docker-compose build --no-cache

# Очистка (удаление контейнеров и volumes)
docker-compose down -v

# Перезапуск конкретного сервиса
docker-compose restart frontend
```

### Локальная разработка

```bash
# Frontend
npm start          # Запуск dev сервера
npm run build      # Сборка для production
npm test           # Запуск тестов

# Backend
cd backend
npm start          # Запуск сервера
npm run dev        # Запуск с автоперезагрузкой (nodemon)
npm run migrate    # Миграция данных в БД
```

## 🌐 Порты

- **3000** - Frontend (React)
- **3001** - Backend API
- **27017** - MongoDB

Если порты заняты, измените их в:
- `docker-compose.yml` (для Docker)
- `package.json` (для frontend, через переменную PORT)
- `backend/.env` (для backend)

## ⚠️ Решение проблем

### Проблемы с портами

**Ошибка:** `Port 3000 is already in use`

**Решение для Windows:**
```powershell
# Найдите процесс, использующий порт
netstat -ano | findstr :3000

# Завершите процесс (замените PID на номер процесса)
taskkill /PID <PID> /F
```

**Решение для macOS/Linux:**
```bash
# Найдите и завершите процесс
lsof -ti:3000 | xargs kill -9

# Или более безопасный способ
kill $(lsof -t -i:3000)
```

### Проблемы с Docker

**Ошибка:** `Cannot connect to the Docker daemon`

**Решение:**
- **Windows:** Убедитесь, что Docker Desktop запущен. Проверьте в системном трее.
- **macOS:** Откройте Docker Desktop из Applications и дождитесь полного запуска.
- **Linux:** Убедитесь, что Docker запущен:
  ```bash
  sudo systemctl start docker
  sudo systemctl enable docker
  ```
  
  Убедитесь, что пользователь в группе `docker`:
  ```bash
  sudo usermod -aG docker $USER
  # После этого перелогиньтесь
  ```

**Ошибка:** `WSL 2 installation is incomplete`

**Решение для Windows:**
1. Установите WSL 2:
   ```powershell
   wsl --install
   ```
2. Перезагрузите компьютер
3. Запустите Docker Desktop снова

### Проблемы с MongoDB

**Ошибка:** `MongoNetworkError: connect ECONNREFUSED`

**Решение:**

**Windows:**
```powershell
# Проверьте, запущен ли MongoDB
Get-Service MongoDB

# Если не запущен, запустите
Start-Service MongoDB
```

**macOS:**
```bash
# Проверьте статус
brew services list

# Запустите MongoDB
brew services start mongodb-community
```

**Linux:**
```bash
# Проверьте статус
sudo systemctl status mongod

# Запустите MongoDB
sudo systemctl start mongod

# Проверьте подключение
mongosh --eval "db.adminCommand('ping')"
```

**Для Docker:** Убедитесь, что сервис `mongodb` запущен:
```bash
docker-compose ps
docker-compose up mongodb
```

### Проблемы с зависимостями

**Ошибка:** `npm ERR! code ELIFECYCLE`

**Решение:**

**Windows:**
```powershell
# Удалите node_modules и package-lock.json
Remove-Item -Recurse -Force node_modules, package-lock.json
Remove-Item -Recurse -Force backend\node_modules, backend\package-lock.json

# Очистите кэш npm
npm cache clean --force

# Переустановите зависимости
npm install
cd backend
npm install
```

**macOS/Linux:**
```bash
# Удалите node_modules и package-lock.json
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Очистите кэш npm
npm cache clean --force

# Переустановите зависимости
npm install
cd backend && npm install
```

### Проблемы с правами доступа

**Linux:**
```bash
# Если возникают проблемы с правами при установке пакетов
sudo chown -R $USER:$USER node_modules
sudo chown -R $USER:$USER backend/node_modules
```

## 📝 Переменные окружения

### Backend (.env)

Создайте файл `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/russia-map
PORT=3001
NODE_ENV=development
```

**Для Docker:** Переменные окружения настраиваются в `docker-compose.yml`.

### Frontend

Переменные окружения для React должны начинаться с `REACT_APP_`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🚀 Деплой

Проект настроен для деплоя на Render.com. При пуше в ветку `main` происходит автоматическая сборка и деплой.

- **Frontend:** https://russia-map.onrender.com
- **Backend:** настраивается отдельно в Render Dashboard

## 🎯 Использование приложения

1. Откройте приложение в браузере
2. Карта России автоматически центрируется и показывает все регионы
3. Кликните на регион для просмотра статистики
4. Удерживайте **Shift** и кликните на второй регион для сравнения или суммирования данных
5. Используйте колесико мыши для масштабирования карты
6. Перетаскивайте карту мышью для навигации

## 📄 Лицензия

ISC

## 👥 Авторы

Проект создан для визуализации данных о заболеваниях беременных по регионам России.

## 🔗 Полезные ссылки

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/)
- [React](https://react.dev/)
- [D3.js](https://d3js.org/)
