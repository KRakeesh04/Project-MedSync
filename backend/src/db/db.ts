import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

if (process.env.DATABASE_PASSWORD === undefined) {
  console.error(
    'DATABASE_PASSWORD environment variable is undefined, check if .env is present in the current working directory.'
  );
  process.exit(2);
}

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'Project-MedSync',
  multipleStatements: true
});

const sqlFiles = [
  './src/db/table.sql',
  './src/db/init.sql',
  // './src/db/procedures.sql'
];

// only run SQL init if RUN_SQL_INIT=true
(async () => {
  const shouldRunSql =
    process.env.RUN_SQL_INIT === 'true' &&
    !process.argv.includes('--watch');
  if (shouldRunSql) {
    console.log('Running initial SQL setup...');
    for (const sqlFilePath of sqlFiles) {
      if (fs.existsSync(sqlFilePath)) {
        try {
          const sqlInit = fs.readFileSync(sqlFilePath, 'utf8');
          await pool.query(sqlInit);
          console.log(`Executed SQL file: ${sqlFilePath}`);
        } catch (err) {
          console.error(
            `Error executing SQL file (${sqlFilePath}):`,
            err instanceof Error ? err.message : err
          );
          if (sqlFilePath === sqlFiles[0]) process.exit(1);
        }
      } else {
        console.warn(`SQL file not found at ${sqlFilePath}, skipping.`);
      }
    }
  } else {
    console.log('Skipping SQL initialization (RUN_SQL_INIT not set or watch mode detected).');
  }
})();

export default pool;