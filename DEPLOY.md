# Развёртывание Feedjet

Инструкция для установки на чистую систему Debian.

---

## 1. Системные пакеты

Команды с `sudo` выполняются от имени пользователя с правами администратора либо от `root`.

```bash
sudo apt update
sudo apt install -y \
  curl ca-certificates git openssl \
  build-essential python3 \
  ffmpeg nginx \
  android-tools-adb
```

---

## 2. Пользователь и группа `feedjet`

Создание пользователя (домашний каталог `/home/feedjet` появится при клонировании репозитория в разделе 4):

```bash
sudo useradd -s /bin/bash -d /home/feedjet feedjet
```

Задание пароля. Команда запросит ввод дважды — придумайте свой пароль и введите его. 

```bash
sudo passwd feedjet
```

Чтобы пользователь `feedjet` мог выполнять команды установки Nginx и systemd (`sudo ...` в разделах 7–8), добавьте его в группу `sudo`:

```bash
sudo usermod -aG sudo feedjet
```

---

## 3. Node.js 20 и Yarn Classic

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn@1
```

Проверка версий:

```bash
node -v   # ожидается v20.x
yarn -v   # ожидается 1.x
```

---

## 4. Получение исходного кода

Разделы 1–3 выполнялись от администратора. Дальше клонирование и смена владельца:

```bash
cd /home
sudo git clone https://github.com/ath31st/feedjet
sudo chown -R feedjet:feedjet /home/feedjet
```

Переход в сессию пользователя `feedjet` (пароль — тот, что задали в разделе 2). Последующие шаги до разделов с `sudo` выполняйте в этой сессии:

```bash
sudo -iu feedjet
cd /home/feedjet
yarn install
```

---

## 5. Конфигурация

### 5.1. Сервер

```bash
cp /home/feedjet/server/.env.example /home/feedjet/server/.env
```

Генерация ключа шифрования. Значение необходимо сохранить: при его утрате зашифрованные данные станут недоступны.

```bash
node -e "console.log('base64:' + require('crypto').randomBytes(32).toString('base64'))"
```

Генерация секрета JWT:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Минимальный набор параметров в `server/.env`:

```env
DB_FILE_NAME=./feedjet.db
OPEN_WEATHER_API_KEY=<ключ_OpenWeatherMap>
DATA_ENCRYPTION_KEY=base64:<сгенерированный_ключ>
JWT_SECRET=<сгенерированный_секрет>
JWT_EXPIRES_IN=1d
PORT=3000
```

При работе без погоды и RSS укажите `OFFLINE_MODE=true` вместо `OPEN_WEATHER_API_KEY`.  
Полный перечень переменных — в `server/.env.example`.

### 5.2. Клиент

Переменные с префиксом `VITE_` подставляются на этапе сборки. После изменения URL или координат необходима повторная сборка клиента.

```bash
cp /home/feedjet/client/.env.example /home/feedjet/client/.env
```

Пример для доступа по IP-адресу сервера:

```env
VITE_API_URL=https://192.168.1.10

VITE_SCHEDULE_LOCATION_TITLE="Городово"
VITE_SCHEDULE_LOCATION_LAT="35.152072"
VITE_SCHEDULE_LOCATION_LON="57.617507"
```

При появлении домена замените `VITE_API_URL` на соответствующий HTTPS-адрес (например `https://feedjet.example.com`) и выполните повторную сборку клиента.

---

## 6. Миграции базы данных и сборка

```bash
cd /home/feedjet/server
yarn db:migrate
yarn build

cd /home/feedjet/client
yarn build
```

Файл базы данных должен существовать до запуска API. Проверка:

```bash
ls -la /home/feedjet/server/feedjet.db
```

---

## 7. Systemd-сервис API

Создание unit-файла (нужны права `sudo`; пользователь `feedjet` уже в группе `sudo` — раздел 2):

```bash
sudo nano /etc/systemd/system/feedjet.service
```

Содержимое:

```ini
[Unit]
Description=Feedjet API
After=network.target

[Service]
Type=simple
User=feedjet
Group=feedjet
WorkingDirectory=/home/feedjet/server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/server/src/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Запуск и автозагрузка:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now feedjet
sudo systemctl status feedjet
```

Просмотр журнала:

```bash
sudo journalctl -u feedjet -f
```

---

## 8. Nginx

### 8.1. Назначение скрипта `setup-nginx.js`

Команда `node scripts/setup-nginx.js` выполняет следующее:

1. Определяет пути кеша изображений и файлового хранилища по конфигурации сервера.
2. При отсутствии файлов `nginx/certs/local.crt` и `nginx/certs/local.key` создаёт самоподписанный TLS-сертификат в каталоге `nginx/certs/`.
3. Формирует файл `nginx/nginx.conf` на основе шаблона: раздача статики из `client/dist`, проксирование `/trpc` и `/sse/` на API (порт 3000), раздача медиафайлов с диска, указание путей к сертификатам.

Сертификаты используются по путям внутри каталога проекта. Отдельное копирование в системные каталоги не требуется.

### 8.2. Запуск скрипта

Предварительно выполните сборку клиента (раздел 6).

```bash
cd /home/feedjet
node scripts/setup-nginx.js
```

### 8.3. Подключение конфигурации к системному Nginx

Системный Nginx читает файл `/etc/nginx/nginx.conf`. Для использования конфигурации проекта создаётся символическая ссылка на `/home/feedjet/nginx/nginx.conf`.

Что даёт эта схема:

- Nginx обслуживает только то, что описано в конфиге проекта (один полный `nginx.conf`: `events` + `http`). Стоковые сайты из `sites-enabled` и прочие включения из пакета Debian в работу не входят.
- Исходный `/etc/nginx/nginx.conf` сохраняется как `/etc/nginx/nginx.conf.reserved` — к нему можно вернуться, убрав симлинк и восстановив файл.
- `systemctl reload nginx` / `restart nginx` сразу читают актуальный файл из каталога проекта после `setup-nginx.js`.
- После `apt upgrade nginx` пакет иногда заменяет `/etc/nginx/nginx.conf` своим файлом — нужно снова проверить, что на месте симлинк на конфиг проекта.

Выполняется один раз. Нужны права `sudo`:

```bash
sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.reserved
sudo ln -s /home/feedjet/nginx/nginx.conf /etc/nginx/nginx.conf

sudo chmod o+x /home/feedjet
sudo chmod -R o+rX /home/feedjet/client/dist /home/feedjet/nginx/certs \
  /home/feedjet/server/file-storage /home/feedjet/server/.image-cache

sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx
```

После последующих запусков `setup-nginx.js` достаточно проверить конфигурацию и перезагрузить Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 8.4. Перевыпуск самоподписанного сертификата

Файлы сертификата: `/home/feedjet/nginx/certs/local.crt` и `local.key`. Скрипт записывает эти пути в `nginx.conf`.

```bash
rm /home/feedjet/nginx/certs/local.crt /home/feedjet/nginx/certs/local.key
cd /home/feedjet && node scripts/setup-nginx.js
sudo nginx -t && sudo systemctl reload nginx
```

При использовании самоподписанного сертификата браузер отображает предупреждение о недоверенном издателе. Для доступа по IP-адресу это ожидаемое поведение: необходимо подтвердить переход на сайт.

Адреса после развёртывания:

- админ-панель: `https://<IP>/login`
- киоск по умолчанию: `https://<IP>/default`

---

## 9. Создание учётной записи администратора

Сервис API должен быть запущен (`systemctl status feedjet`).

```bash
cd /home/feedjet
node scripts/send-create-user.js
```

Учётные данные по умолчанию: логин `admin`, пароль `1234`. Рекомендуется задать собственный пароль в файле send-create-user.js перед его запуском.

Создание пользователя с произвольным паролем:

```bash
curl -sS -X POST http://127.0.0.1:3000/trpc/user.create \
  -H 'Content-Type: application/json' \
  -d '{"login":"admin","password":"<пароль>"}'
```

---

## 10. Обновление приложения

```bash
sudo -iu feedjet
cd /home/feedjet
git pull
yarn install

cd server && yarn db:migrate && yarn build
cd ../client && yarn build

cd /home/feedjet && node scripts/setup-nginx.js
```

Перезапуск служб:

```bash
sudo systemctl restart feedjet
sudo nginx -t && sudo systemctl reload nginx
```

---

## 11. Резервное копирование

Копируются: база данных, медиафайлы, файлы `.env` (в них же ключ `DATA_ENCRYPTION_KEY`).  
Каталог `.image-cache` не копируется.

Подставьте путь назначения вместо `/mnt/backup` (внешний диск, другой сервер и т.п.).

```bash
BACKUP_ROOT=/mnt/backup/feedjet-$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_ROOT"

# Остановка API, чтобы снимок SQLite был согласованным
sudo systemctl stop feedjet

cp -a /home/feedjet/server/feedjet.db "$BACKUP_ROOT/"
# побочные файлы WAL, если есть
cp -a /home/feedjet/server/feedjet.db-wal "$BACKUP_ROOT/" 2>/dev/null || true
cp -a /home/feedjet/server/feedjet.db-shm "$BACKUP_ROOT/" 2>/dev/null || true

cp -a /home/feedjet/server/.env "$BACKUP_ROOT/server.env"
cp -a /home/feedjet/client/.env "$BACKUP_ROOT/client.env"
cp -a /home/feedjet/server/file-storage "$BACKUP_ROOT/file-storage"

sudo systemctl start feedjet

echo "Резервная копия: $BACKUP_ROOT"
ls -la "$BACKUP_ROOT"
```

Восстановление (кратко): остановить `feedjet`, вернуть файлы на места (`feedjet.db` → `server/`, `.env` → `server/.env` и `client/.env`, содержимое `file-storage` → `server/file-storage/`), выставить владельца `feedjet:feedjet`, запустить сервис.

---

## 12. Сертификат Let's Encrypt (при наличии домена)

Для работы по IP-адресу или в локальной сети достаточно самоподписанного сертификата из раздела 8.

При наличии доменного имени и доступности сервера из сети на портах 80 и 443 можно получить доверенный сертификат [Let's Encrypt](https://letsencrypt.org/) с помощью [Certbot](https://certbot.eff.org/).

Последовательность работы Certbot:

1. Запрос сертификата для указанного домена у Let's Encrypt.
2. Проверка владения доменом (как правило, через HTTP на порту 80).
3. Сохранение сертификата в `/etc/letsencrypt/live/<домен>/`.
4. При использовании плагина Nginx — обновление конфигурации веб-сервера и настройка автоматического продления.

Установка и выпуск:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d feedjet.example.com
```

Затем укажите в `client/.env` значение `VITE_API_URL=https://feedjet.example.com`, пересоберите клиент и при необходимости перезапустите API.

Повторный запуск `setup-nginx.js` возвращает в конфигурацию пути к самоподписанным сертификатам в `nginx/certs/`. После перехода на Let's Encrypt либо не запускайте этот скрипт без адаптации шаблона, либо после его выполнения вручную укажите в `nginx.conf` пути `/etc/letsencrypt/live/<домен>/` и выполните `sudo systemctl reload nginx`.

---

## Краткая последовательность шагов

1. Установка пакетов.
2. Создание пользователя `feedjet`.
3. Установка Node.js и Yarn.
4. `git clone` в `/home` → каталог `/home/feedjet`.
5. Настройка `server/.env` и `client/.env`.
6. Миграции и сборка сервера и клиента.
7. Запуск systemd-сервиса `feedjet`.
8. Генерация конфигурации Nginx и символическая ссылка `/etc/nginx/nginx.conf`.
9. Создание учётной записи администратора.
10. Проверка доступа по `https://<IP>/login`.
