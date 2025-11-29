# Шаблон для выполнения тестового задания

## Описание
Шаблон подготовлен для того, чтобы попробовать сократить трудоемкость выполнения тестового задания.

В шаблоне настоены контейнеры для `postgres` и приложения на `nodejs`.  
Для взаимодействия с БД используется `knex.js`.  
В контейнере `app` используется `build` для приложения на `ts`, но можно использовать и `js`.

Шаблон не является обязательным!\
Можно использовать как есть или изменять на свой вкус.

Все настройки можно найти в файлах:
- compose.yaml
- dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts

## Подготовка перед запуском:

Для то, чтобы все корректно работало, перед запуском команды `docker compose up --build` необходимо сделать следующие шаги: 

1) Указать полученный ключ от API Wildberries в файле `.env` в `WB_API_KEY`
2) Получить доступы для Google Sheets API, вставить содержимое JSON файла Service Account Credentials file в `.env` в `GOOGLE_PRIVATE_KEY_FILE_AS_JSON_STRING`
3) Создать 3 таблицы и дать права редактора для Service account email
4) Внести ID таблиц в `.env` в `GOOGLE_SHEETS_IDS` через запятую

Все примеры отображения чувствительных данных можно посмотреть в example.env

## Команды:

Запуск базы данных:
```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```
Также можно использовать и остальные команды (`migrate make <name>`,`migrate up`, `migrate down` и т.д.)

Для запуска приложения в режиме разработки:
```bash
npm run dev
```

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```

PS: С наилучшими пожеланиями!
