# Этап сборки
FROM node:18-alpine AS builder

# Устанавливаем переменные окружения для production
ENV NODE_ENV=production
ENV VITE_ENV=production

WORKDIR /app

# Копируем только файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение в production режиме
RUN npm run build

# Этап production
FROM nginx:alpine

# Копируем собранные файлы в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Настраиваем nginx для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Очищаем nginx дефолтный конфиг
RUN rm -rf /etc/nginx/conf.d/default.conf.default

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]