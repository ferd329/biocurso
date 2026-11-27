import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function setup() {
  const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "biocursos",
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    const conn = await pool.getConnection();
    console.log("Conexión exitosa");
    
    // Verificar usuarios existentes
    const [users] = await conn.execute("SELECT id, nombre, email, rol FROM usuarios");
    console.log("Usuarios existentes:", users.length);
    users.forEach(u => console.log(" -", u.email, "rol:", u.rol));
    
    // Hashear contraseñas
    const adminHash = await bcrypt.hash("admin123", 12);
    const studentHash = await bcrypt.hash("est123", 12);
    
    // Insertar administrador si no existe
    const [adminCheck] = await conn.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      ["admin@biocursos.com"]
    );
    if (adminCheck.length === 0) {
      const [result] = await conn.execute(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
        ["Admin BioCursos", "admin@biocursos.com", adminHash, "admin"]
      );
      console.log("Admin creado con ID:", result.insertId);
    } else {
      console.log("Admin ya existe");
    }
    
    // Insertar estudiante si no existe
    const [studentCheck] = await conn.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      ["estudiante@biocursos.com"]
    );
    if (studentCheck.length === 0) {
      const [result] = await conn.execute(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
        ["Estudiante BioCursos", "estudiante@biocursos.com", studentHash, "estudiante"]
      );
      console.log("Estudiante creado con ID:", result.insertId);
    } else {
      console.log("Estudiante ya existe");
    }
    
    await conn.release();
    console.log("¡Setup completado!");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

setup();