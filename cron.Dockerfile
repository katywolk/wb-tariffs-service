FROM alpine:latest

# 1. Устанавливаем cron (dcron) и curl
RUN apk update && apk add --no-cache dcron curl

# 2. Создаем рабочую директорию
WORKDIR /usr/src/app

# 3. Копируем crontab
COPY crontab /tmp/crontab

# 4. Регистрируем задачи (Alpine crontab)
RUN crontab /tmp/crontab && rm /tmp/crontab

# 5. Создаем файл лога
RUN touch /var/log/cron.log && chmod 666 /var/log/cron.log

CMD ["crond", "-f", "-l", "2"]