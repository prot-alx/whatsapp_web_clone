# Этап сборки
FROM node:18-alpine AS builder
# Временно отключаем production mode для установки dev dependencies
ENV NODE_ENV=development
WORKDIR /app

# Копируем конфигурационные файлы
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Устанавливаем все зависимости (включая devDependencies)
RUN npm install

# После установки зависимостей переключаем на production
ENV NODE_ENV=production
ENV VITE_ENV=production

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /etc/nginx/conf.d/default.conf.default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]