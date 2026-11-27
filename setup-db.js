import "dotenv/config";
import mysql from "mysql2/promise";

const pool = {
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "biocursos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function setup() {
  const p = mysql.createPool(pool);

  try {
    // Crear base de datos si no existe
    const [rows] = await p.query("CREATE DATABASE IF NOT EXISTS biocursos");
    console.log(`✅ Base de datos: ${rows[0] && rows[0].warningStatus ? "creada con warning" : "list/ok"}`);

    // Usar la base de datos
    await p.query("USE biocursos");
    console.log("📦 Usando base de datos biocursos");

    // Verificar tablas
    const [tables] = await p.query(
      "SHOW TABLES"
    );
    console.log("📋 Tablas existentes:", tables.map(t => t["Tables_in_biocursos"]));

    if (tables.length === 0) {
      console.warn("⚠️ No hay tablas. Ejecuta: node database/migrate.js");
    } else {
      console.log("✅ Tablas ya existen");
    }

    // Contar registros
    for (const table of ["usuarios", "cursos", "planes", "contactos"]) {
      try {
        const [[[count]]] = await p.query(`SELECT COUNT(*) as cnt FROM ${table}`);
        console.log(`  ${table}: ${count.cnt} registros`);
      } catch (e) {
        console.log(`  ${table}: error (puede que no exista)`);
      }
    }

    console.log("✅ Setup de BD completado");
  } catch (err) {
    console.error("❌ Error en setup-db:", err);
    process.exit(1);
  } finally {
    await p.end();
  }
}

setup();