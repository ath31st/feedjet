import Database from 'better-sqlite3';
import path from 'node:path';

// Используем абсолютные пути, чтобы точно не промахнуться
const oldDbPath = path.resolve(process.cwd(), 'feedjet old.db');
const newDbPath = path.resolve(process.cwd(), 'feedjet.db');

console.log(`Проверка путей:`);
console.log(`Старая БД: ${oldDbPath}`);
console.log(`Новая БД: ${newDbPath}`);

// 1. Подключаемся к базам
// { verbose: console.log } поможет увидеть, какие именно запросы выполняются
const oldDb = new Database(oldDbPath);
const newDb = new Database(newDbPath);

// Список таблиц для переноса (в порядке от простых к зависимым)
const tables = [
  'users',
  'kiosks',
  'rss_feeds',
  'birthdays',
  'schedule_events',
  'media_folders',
  'videos',
  'images',
  'feed_config',
  'ui_config',
  'ticker_config',
  'kiosk_work_schedule',
  'kiosk_integrations',
  'scenarios',
  'scenario_items',
  'kiosk_videos',
  'kiosk_images',
];

async function transferData() {
  console.log('🚀 Начинаем перенос данных...');

  // Отключаем проверки в новой базе для скорости и во избежание конфликтов
  newDb.pragma('foreign_keys = OFF');
  newDb.pragma('journal_mode = OFF'); // Ускоряет запись

  try {
    for (const tableName of tables) {
      console.log(`📦 Перенос таблицы: ${tableName}...`);

      const rows = oldDb.prepare(`SELECT * FROM ${tableName}`).all();

      if (rows.length === 0) {
        console.log(`⚠️ Таблица ${tableName} пуста, пропускаем.`);
        continue;
      }

      // Экранируем имена колонок двойными кавычками, чтобы избежать конфликтов с зарезервированными словами типа "order"
      const columns = Object.keys(rows[0] as object)
        .map((col) => `"${col}"`)
        .join(', ');

      const placeholders = Object.keys(rows[0] as object)
        .map(() => '?')
        .join(', ');

      const insertStmt = newDb.prepare(
        `INSERT OR IGNORE INTO ${tableName} (${columns}) VALUES (${placeholders})`,
      );

      // Выполнение транзакции
      const transaction = newDb.transaction((data) => {
        for (const row of data) {
          insertStmt.run(Object.values(row as object));
        }
      });

      transaction(rows);
      console.log(`✅ Перенесено записей: ${rows.length}`);
    }

    console.log('✨ Все данные успешно перенесены!');
  } catch (error) {
    console.error('❌ Ошибка при переносе:', error);
  } finally {
    // Возвращаем настройки базы в исходное состояние
    newDb.pragma('foreign_keys = ON');
    newDb.pragma('journal_mode = WAL');

    oldDb.close();
    newDb.close();
  }
}

transferData();
