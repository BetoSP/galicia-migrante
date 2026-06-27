const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DB_HOST = process.env.SUPABASE_DB_HOST || 'db.vrtqtltkiifconviaiwf.supabase.co';
const DB_PORT = parseInt(process.env.SUPABASE_DB_PORT || '5432', 10);
const DB_NAME = process.env.SUPABASE_DB_NAME || 'postgres';
const DB_USER = process.env.SUPABASE_DB_USER || 'postgres';

console.log('====================================================');
console.log('  Portal Galicia Migrante — Database Migration Tool ');
console.log('====================================================\n');

rl.question('Introducí la contraseña de tu base de datos de Supabase: ', async (password) => {
  rl.close();
  
  if (!password.trim()) {
    console.error('La contraseña no puede estar vacía.');
    process.exit(1);
  }

  const connectionString = `postgresql://${DB_USER}:${encodeURIComponent(password)}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require`;
  const client = new Client({ 
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('\nConectando a Supabase...');
    await client.connect();
    console.log('Conexión exitosa.');

    // Crear la tabla para controlar migraciones aplicadas si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS _schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Leer archivos de migración
    const migrationsDir = path.join(__dirname, 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`\nSe encontraron ${files.length} archivos de migración.`);

    for (const file of files) {
      // Verificar si ya fue aplicada
      const { rows } = await client.query('SELECT 1 FROM _schema_migrations WHERE version = $1', [file]);
      
      if (rows.length > 0) {
        console.log(`[Saltada] ${file} (ya estaba aplicada)`);
        continue;
      }

      console.log(`[Aplicando] ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      
      try {
        await client.query(sql);
        await client.query('INSERT INTO _schema_migrations (version) VALUES ($1)', [file]);
        console.log(`[Éxito] ${file} aplicada correctamente.`);
      } catch (err) {
        console.error(`\n[ERROR] Falló al aplicar la migración: ${file}`);
        console.error(err.message);
        console.log('\nCancelando ejecuciones posteriores.');
        await client.end();
        process.exit(1);
      }
    }

    console.log('\n====================================================');
    console.log(' ¡Todas las migraciones se aplicaron con éxito! ');
    console.log('====================================================');

  } catch (err) {
    console.error('\nError al conectar o ejecutar comandos en la base de datos:');
    console.error(err.message);
  } finally {
    await client.end();
  }
});
