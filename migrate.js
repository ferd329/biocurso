import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

const pool = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "biocursos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

async function getPool() {
  const p = mysql.createPool(pool);
  const conn = await p.getConnection();
  return { p, conn };
}

async function run() {
  const { p, conn } = await getPool();

  try {
    // Crear base de datos si no existe
    await conn.execute("CREATE DATABASE IF NOT EXISTS biocursos");
    await conn.execute("USE biocursos");

    // Tabla: usuarios
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('estudiante', 'empresa', 'admin') DEFAULT 'estudiante',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tabla: cursos
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS cursos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        titulo VARCHAR(200) NOT NULL,
        subtitulo VARCHAR(255),
        descripcion TEXT,
        area VARCHAR(100) DEFAULT 'Biología',
        tema VARCHAR(100) DEFAULT 'Celular',
        nivel_educativo VARCHAR(50) DEFAULT 'Preparatoria',
        formato VARCHAR(50) DEFAULT 'Online',
        precio_individual DECIMAL(10, 2) DEFAULT 0.00,
        rating DECIMAL(3, 1) DEFAULT 0.0,
        estudiantes INT DEFAULT 0,
        tono VARCHAR(50) DEFAULT 'navy',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Tabla: planes
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS planes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        tipo ENUM('mensual', 'anual', 'unique') NOT NULL,
        precio_mensual DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        asientos_maximos INT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla: usuarios_planes (relación N-N o suscripción)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS usuarios_planes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        plan_id INT NOT NULL,
        fecha_inicio DATE NOT NULL DEFAULT (CURRENT_DATE),
        fecha_fin DATE,
        estado ENUM('activo', 'vencido', 'cancelado') DEFAULT 'activo',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_usuario_plan (usuario_id, plan_id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES planes(id) ON DELETE SET NULL
      )
    `);

    // Tabla: modulos (dentro de cada curso)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS modulos (
        id VARCHAR(50) PRIMARY KEY,
        curso_id INT NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        descripcion VARCHAR(500),
        orden INT DEFAULT 0,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
      )
    `);

    // Tabla: lecciones
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS lecciones (
        id VARCHAR(50) PRIMARY KEY,
        modulo_id VARCHAR(50) NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        duracion VARCHAR(20) DEFAULT '10:00',
        duracion_seg INT DEFAULT 600,
        resumen TEXT,
        puntos_clave JSON,
        quiz JSON,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE
      )
    `);

    // Tabla: flashcards
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS flashcards (
        id VARCHAR(50) PRIMARY KEY,
        leccion_id VARCHAR(50) NOT NULL,
        frente TEXT NOT NULL,
        reverso TEXT NOT NULL,
        pista VARCHAR(255),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (leccion_id) REFERENCES lecciones(id) ON DELETE CASCADE
      )
    `);

    // Tabla: labs
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS labs (
        id VARCHAR(50) PRIMARY KEY,
        curso_id INT NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        descripcion TEXT,
        tipo ENUM('simulacion', 'real', 'investigacion') DEFAULT 'simulacion',
        pasos JSON,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
      )
    `);

    // Tabla: contactos (para el portal de empresas)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS contactos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        empresa VARCHAR(200),
        mensaje TEXT NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Migraciones ejecutadas correctamente");
  } catch (err) {
    console.error("❌ Error en migración:", err);
    process.exit(1);
  } finally {
    await conn.release();
    await p.end();
  }
}

run();