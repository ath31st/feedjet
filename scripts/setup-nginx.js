#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const containerTsPath = path.join(projectRoot, 'server', 'src', 'container.ts');
const nginxDir = path.join(projectRoot, 'nginx');
const certsDir = path.join(nginxDir, 'certs');
const nginxConfTemplate = path.join(nginxDir, 'nginx.conf.template');
const nginxConfOutput = path.join(nginxDir, 'nginx.conf');

if (!fs.existsSync(containerTsPath)) {
  console.error(`❌ Не найден ${path.relative(projectRoot, containerTsPath)}. Проверь путь.`);
  process.exit(1);
}

const content = fs.readFileSync(containerTsPath, 'utf-8');

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

const absCacheDir = path.isAbsolute(cacheDirValue)
  ? cacheDirValue
  : path.resolve(projectRoot, cacheDirValue);

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

try {
  if (!fs.existsSync(absCacheDir)) fs.mkdirSync(absCacheDir, { recursive: true });
} catch (err) {
  console.error(`❌ Не удалось создать cacheDir: ${absCacheDir}`);
  console.error(err.message || err);
  process.exit(1);
}

if (!fs.existsSync(nginxConfTemplate)) {
  console.error(`❌ Не найден шаблон ${path.relative(projectRoot, nginxConfTemplate)}`);
  process.exit(1);
}

const template = fs.readFileSync(nginxConfTemplate, 'utf-8');

const nginxConf = template
  .replace(/{{\s*CACHE_DIR\s*}}/g, absCacheDir)
  .replace(/{{\s*CERT_PATH\s*}}/g, crtPath)
  .replace(/{{\s*KEY_PATH\s*}}/g, keyPath);

fs.writeFileSync(nginxConfOutput, nginxConf, 'utf-8');

console.log(`✅ nginx.conf обновлён: ${path.relative(projectRoot, nginxConfOutput)}`);
console.log(`📁 cacheDir: ${absCacheDir}`);
console.log(`📄 certs: ${crtPath}, ${keyPath}`);
console.log(`🚀 Запусти: sudo nginx -c "${nginxConfOutput}"`);
