#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const configTsPath = path.join(projectRoot, 'server', 'src', 'config', 'config.ts');
const nginxDir = path.join(projectRoot, 'nginx');
const certsDir = path.join(nginxDir, 'certs');
const nginxConfTemplate = path.join(nginxDir, 'nginx.conf.template');
const nginxConfOutput = path.join(nginxDir, 'nginx.conf');

if (!fs.existsSync(configTsPath)) {
  console.error(`❌ Не найден ${path.relative(projectRoot, configTsPath)}. Проверь путь.`);
  process.exit(1);
}

const content = fs.readFileSync(configTsPath, 'utf-8');

// cacheDir
let match = content.match(/export\s+const\s+cacheDir\s*=\s*process\.env\.CACHE_DIR\s*\?\?\s*['"`]([^'"`]+)['"`]/m);
let cacheDirValue = match ? match[1] : null;

if (!cacheDirValue) {
  match = content.match(/export\s+const\s+cacheDir\s*=\s*['"`]([^'"`]+)['"`]/m);
  cacheDirValue = match ? match[1] : null;
}

if (!cacheDirValue) {
  match = content.match(/export\s+const\s+cacheDir\s*=\s*path\.resolve\(\s*['"`]([^'"`]+)['"`]\s*\)/m);
  cacheDirValue = match ? match[1] : null;
}

if (!cacheDirValue) {
  console.error('❌ Не удалось автоматически извлечь cacheDir из container.ts.');
  console.error('Проверь формат объявления (пример):\n  export const cacheDir = process.env.CACHE_DIR ?? \'./.image-cache\';');
  process.exit(1);
}

const containerDir = path.dirname(configTsPath);
const serverRoot = path.resolve(containerDir, '../..');
const absCacheDir = path.isAbsolute(cacheDirValue)
  ? cacheDirValue
  : path.resolve(serverRoot, cacheDirValue);

// fileStorageDir
match = content.match(/export\s+const\s+fileStorageDir\s*=\s*process\.env\.FILE_STORAGE_DIR\s*\?\?\s*['"`]([^'"`]+)['"`]/m);
let fileStorageDirValue = match ? match[1] : null;

if (!fileStorageDirValue) {
  match = content.match(/export\s+const\s+fileStorageDir\s*=\s*['"`]([^'"`]+)['"`]/m);
  if (match) fileStorageDirValue = match[1];
}

if (!fileStorageDirValue) {
  match = content.match(/export\s+const\s+fileStorageDir\s*=\s*path\.resolve\(\s*['"`]([^'"`]+)['"`]\s*\)/m);
  if (match) fileStorageDirValue = match[1];
}

if (!fileStorageDirValue) {
  console.error('❌ Не удалось автоматически извлечь fileStorageDir из container.ts.');
  process.exit(1);
}

const absFileStorageDir = path.isAbsolute(fileStorageDirValue)
  ? fileStorageDirValue
  : path.resolve(serverRoot, fileStorageDirValue);

const absVideosDir = path.join(absFileStorageDir, 'videos');
const absImagesDir = path.join(absFileStorageDir, 'images');
const absLogosDir = path.join(absFileStorageDir, 'logos');
const absBackgroundsDir = path.join(absFileStorageDir, 'backgrounds');
const absClientDist = path.join(projectRoot, 'client', 'dist');

// certs
if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir, { recursive: true });

const crtPath = path.join(certsDir, 'local.crt');
const keyPath = path.join(certsDir, 'local.key');

if (!fs.existsSync(crtPath) || !fs.existsSync(keyPath)) {
  console.log('🔐 Генерация самоподписанного сертификата...');
  try {
    execSync(
      `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "${keyPath}" -out "${crtPath}" -subj "/CN=localhost"`,
      { stdio: 'inherit' }
    );
  } catch (_) {
    console.error('❌ Ошибка при генерации сертификата (openssl). Убедись, что openssl установлен.');
    process.exit(1);
  }
}

const dirsToEnsure = [
  absCacheDir,
  absVideosDir,
  absImagesDir,
  absLogosDir,
  absBackgroundsDir,
];

for (const dir of dirsToEnsure) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(`❌ Не удалось создать каталог: ${dir}`);
    console.error(err.message || err);
    process.exit(1);
  }
}

if (!fs.existsSync(absClientDist)) {
  console.warn(`Предупреждение: каталог ${absClientDist} отсутствует. Выполните сборку клиента: cd client && yarn build`);
}

if (!fs.existsSync(nginxConfTemplate)) {
  console.error(`❌ Не найден шаблон ${path.relative(projectRoot, nginxConfTemplate)}`);
  process.exit(1);
}

const template = fs.readFileSync(nginxConfTemplate, 'utf-8');

const nginxConf = template
  .replace(/{{\s*CLIENT_DIST\s*}}/g, absClientDist)
  .replace(/{{\s*CACHE_DIR\s*}}/g, absCacheDir)
  .replace(/{{\s*VIDEO_DIR\s*}}/g, absVideosDir)
  .replace(/{{\s*IMAGE_DIR\s*}}/g, absImagesDir)
  .replace(/{{\s*LOGO_DIR\s*}}/g, absLogosDir)
  .replace(/{{\s*BACKGROUND_DIR\s*}}/g, absBackgroundsDir)
  .replace(/{{\s*CERT_PATH\s*}}/g, crtPath)
  .replace(/{{\s*KEY_PATH\s*}}/g, keyPath);

fs.writeFileSync(nginxConfOutput, nginxConf, 'utf-8');

console.log(`✅ nginx.conf обновлён: ${path.relative(projectRoot, nginxConfOutput)}`);
console.log(`📁 clientDist: ${absClientDist}`);
console.log(`📁 cacheDir: ${absCacheDir}`);
console.log(`📁 videosDir: ${absVideosDir}`);
console.log(`📁 imagesDir: ${absImagesDir}`);
console.log(`📁 logosDir: ${absLogosDir}`);
console.log(`📁 backgroundsDir: ${absBackgroundsDir}`);
console.log(`📄 certs: ${crtPath}, ${keyPath}`);
console.log(`Подключение к системному Nginx (выполняется один раз):`);
console.log(`   sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.reserved`);
console.log(`   sudo ln -s "${nginxConfOutput}" /etc/nginx/nginx.conf`);
console.log(`   sudo nginx -t && sudo systemctl reload nginx`);
console.log(`Примечание: симлинк подменяет стоковый /etc/nginx/nginx.conf конфигом проекта.`);
console.log(`sites-enabled пакета Debian при этом не используются; исходник сохранён как nginx.conf.reserved.`);
console.log(`После apt upgrade nginx проверьте, что симлинк на месте.`);
