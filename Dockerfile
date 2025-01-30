# Этап сборки
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап production
FROM nginx:alpine

# Копируем собранные файлы в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Настраиваем nginx для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]