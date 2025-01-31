# WhatsApp Web Clone

Веб-приложение для отправки и получения сообщений через Green API.

## Запуск приложения

### Локальный запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/prot-alx/whatsapp_web_clone
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение:
```bash
npm run prod
```

Приложение будет доступно по адресу `http://localhost:4173`

### Запуск в Docker

1. Убедитесь, что у вас установлены Docker и Docker Compose

2. Запустите контейнер:
```bash
docker-compose up -d
```
Или
```bash
npm run docker:start
```
Приложение будет доступно по адресу `http://localhost:3000`

## Использование

1. Зарегистрируйтесь на [Green API](https://green-api.com/)
2. Создайте инстанс, авторизуйтесь по номеру телефона или QR
3. Убедитесь, что [настройки инстанса](https://green-api.com/docs/api/receiving/technology-http-api/) позволяют получать уведомления
4. Получите `idInstance` и `apiTokenInstance`
5. Используйте для входа в приложение

## Основные функции

- Отправка и получение сообщений
- Real-time обновление чата
- Индикация статуса доставки сообщений
- Поддержка мобильных устройств