FROM node:18-alpine

WORKDIR /app

# Копируем package.json для кэширования зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь код
COPY . .

# Собираем приложение
RUN npm run build

# Команда запуска
CMD ["npm", "start"]