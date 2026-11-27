import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import zod from "zod";

// Cargar .env
dotenv.config();

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(compression());
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Body parsing
app.use(express.json({ limit: "10kb" }));

// --- Configuración de MySQL ---
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "biocursos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Probar conexión
pool.getConnection()
  .then((conn) => {
    console.log("✅ Conectado a MySQL");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err.message);
    process.exit(1);
  });

// --- Schemas de validación Zod ---
const loginSchema = z.object({
  email: z.string().email({ min: 1, max: 255 }),
  password: z.string().min(6, { min: 6, max: 255 }),
});

const registerSchema = z.object({
  nombre: z.string().min(1, { min: 1, max: 100 }).max(100),
  email: z.string().email({ min: 1, max: 255 }),
  password: z.string().min(6, { min: 6, max: 255 }),
  rol: z.enum(["estudiante", "empresa", "admin"]).default("estudiante"),
});

// --- Middleware de autenticación JWT ---
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token faltante" });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "biocursos-dev-secret");
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// --- Rutas públicas ---

// Login
app.post("/api/login", async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Datos inválidos", details: result.error.format() });
    }
    const { email, password } = result.data;

    const [rows] = await pool.query(
      "SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Eliminar password del resultado
    const { password: _p, ...userWithoutPass } = user;

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || "biocursos-dev-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ token, user: userWithoutPass });
  } catch (err) {
    console.error("Error en login:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Register
app.post("/api/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Datos inválidos", details: result.error.format() });
    }

    const { nombre, email, password, rol } = result.data;

    // Verificar si el usuario ya existe
    const [existing] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol]
    );

    const [newUser] = await pool.query(
      "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?",
      [result.insertId]
    );

    const token = jwt.sign(
      { id: newUser[0].id, email: newUser[0].email, rol: newUser[0].rol },
      process.env.JWT_SECRET || "biocursos-dev-secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(201).json({ token, user: newUser[0] });
  } catch (err) {
    console.error("Error en register:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Rutas protegidas (requieren JWT) ---

// Perfil del usuario
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error en /me:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Rutas de Cursos (solo admin) ---
app.get("/api/cursos", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, slug, titulo, subtitulo, descripcion, area, tema, nivel_educativo, formato, precio_individual, rating, estudiantes, tono FROM cursos"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al listar cursos:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener curso por slug
app.get("/api/cursos/:slug", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      "SELECT id, slug, titulo, subtitulo, descripcion, area, tema, nivel_educativo, formato, precio_individual, rating, estudiantes, tono FROM cursos WHERE slug = ?",
      [slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener curso:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear curso (admin solo - lógica simplificada)
app.post("/api/cursos", authMiddleware, async (req, res) => {
  try {
    const { slug, titulo, descripcion, area, tema, nivel_educativo, formato, precio_individual } = req.body;
    if (!slug || !titulo) {
      return res.status(400).json({ error: "Slug y título son obligatorios" });
    }

    const [result] = await pool.query(
      "INSERT INTO cursos (slug, titulo, descripcion, area, tema, nivel_educativo, formato, precio_individual) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [slug, titulo, descripcion || "", area || "Biología", tema || "Celular", nivel_educativo || "Preparatoria", formato || "Online", precio_individual || 0]
    );

    const [newCourse] = await pool.query(
      "SELECT id, slug, titulo, descripcion, area, tema, nivel_educativo, formato, precio_individual FROM cursos WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json(newCourse[0]);
  } catch (err) {
    console.error("Error al crear curso:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Rutas de Planes ---
app.get("/api/planes", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre, tipo, precio_mensual FROM planes");
    res.json(rows);
  } catch (err) {
    console.error("Error al listar planes:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Sistema de Carrito Inteligente ---

// Agregar curso al carrito
app.post("/api/cart", authMiddleware, async (req, res) => {
  try {
    const { courseSlug } = req.body;
    if (!courseSlug) {
      return res.status(400).json({ error: "Slug del curso es obligatorio" });
    }

    // Verificar que el curso existe
    const [courses] = await pool.query(
      "SELECT id, slug, titulo, precio_individual FROM cursos WHERE slug = ?",
      [courseSlug]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    const course = courses[0];

    // Obtener carrito actual del usuario
    const [userCart] = await pool.query(
      "SELECT carrito FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );

    let cart = userCart[0].carrito || [];
    // Evitar duplicados
    if (!cart.includes(courseSlug)) {
      cart = [...cart, courseSlug];
    }

    // Actualizar usuario con nuevo carrito
    await pool.query(
      "UPDATE usuarios SET carrito = ? WHERE id = ?",
      [JSON.stringify(cart), req.usuario.id]
    );

    // Obtener carrito actualizado
    const [updatedUser] = await pool.query(
      "SELECT carrito FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );

    res.json({ 
      success: true, 
      cart: JSON.parse(updatedUser[0].carrito),
      message: "Curso añadido al carrito" 
    });
  } catch (err) {
    console.error("Error al añadir al carrito:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener carrito del usuario
app.get("/api/cart", authMiddleware, async (req, res) => {
  try {
    const [userCart] = await pool.query(
      "SELECT carrito FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );
    const cart = userCart.length > 0 ? JSON.parse(userCart[0].carrito) : [];
    res.json({ cart });
  } catch (err) {
    console.error("Error al obtener carrito:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Realizar compra (checkout simulado)
app.post("/api/purchase", authMiddleware, async (req, res) => {
  try {
    const { courseSlugs, planId } = req.body;

    // Obtener usuario actual
    const [user] = await pool.query(
      "SELECT id, nombre, email, rol, carrito FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );
    const userData = user[0];
    const cart = userData.carrito || [];

    // Validar que el carrito no esté vacío
    if (cart.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    // Si es un plan, verificar que existe
    let planData = null;
    if (planId) {
      const [plans] = await pool.query("SELECT * FROM planes WHERE id = ?", [planId]);
      if (plans.length > 0) {
        planData = plans[0];
      }
    }

    // Simular descuento con cupón si viene
    let discount = 0;
    if (req.body.cupon) {
      // Lógica simple de cupones (podrías expandir esto)
      discount = 0.1; // 10% de descuento simulado
    }

    // Calcular total
    let total = 0;
    const coursesPurchased = [];

    for (const slug of cart) {
      const [courses] = await pool.query(
        "SELECT id, slug, titulo, precio_individual FROM cursos WHERE slug = ?",
        [slug]
      );
      if (courses.length > 0) {
        const course = courses[0];
        const priceAfterDiscount = course.precio_individual * (1 - discount);
        total += priceAfterDiscount;
        coursesPurchased.push({
          id: course.id,
          slug: course.slug,
          titulo: course.titulo,
          precio: course.precio_individual,
          precioConDescuento: priceAfterDiscount
        });
      }
    }

    if (planData) {
      total = planData.precio_mensual; // Total del plan
      // Agregar planes comprados al usuario
      const currentPlanes = userData.carrito || [];
      const newPlan = [...currentPlanes, `plan-${planData.id}`];
      await pool.query(
        "UPDATE usuarios SET carrito = ?, planes_comprados = COALESCE(planes_comprados, '[]') || ? WHERE id = ?",
        [JSON.stringify(newPlan), planData.id, req.usuario.id]
      );
    } else {
      // Para cursos individuales: agregar a cursos_comprados del usuario
      const currentCourses = userData.cursos_comprados || [];
      const newCourses = [...new Set([...currentCourses, ...courseSlugs])];
      await pool.query(
        "UPDATE usuarios SET cursos_comprados = ?, carrito = '[]' WHERE id = ?",
        [JSON.stringify(newCourses), req.usuario.id]
      );
    }

    // Registrar la transacción en historial
    await pool.query(
      "INSERT INTO historial_compras (usuario_id, total, tipo, detalle, creado_en) VALUES (?, ?, ?, ?, NOW())",
      [req.usuario.id, total, planId ? 'plan' : 'curso', JSON.stringify({ courseSlugs, planId, discount })]
    );

    // Limpiar carrito después de compra
    await pool.query(
      "UPDATE usuarios SET carrito = '[]' WHERE id = ?",
      [req.usuario.id]
    );

    res.json({ 
      success: true, 
      total: Math.round(total * 100) / 100, // Redondear a 2 decimales
      coursesPurchased,
      planData,
       message: "Compra completada exitosamente" 
    });
  } catch (err) {
    console.error("Error en compra:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Historial de compras
app.get("/api/historial-compras", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, total, tipo, detalle, creado_en FROM historial_compras WHERE usuario_id = ? ORDER BY creado_en DESC LIMIT 20",
      [req.usuario.id]
    );
    res.json({ historial: rows });
  } catch (err) {
    console.error("Error al obtener historial:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Rutas de Cupones ---

// Validar cupón
app.post("/api/cupones/validar", authMiddleware, async (req, res) => {
  try {
    const { codigo } = req.body;

    // Buscar cupón en base de datos (o lógica simulada)
    const cuponesValidos = {
      "BIENVENIDA10": { porcentaje: 10, usos: 1, usado: false },
      "ESTUDIANTE20": { porcentaje: 20, usos: 1, usado: false },
      "ANOLOGY30": { porcentaje: 30, usos: 1, usado: false, fechaExpiracion: "2027-12-31" }
    };

    const cupon = cuponesValidos[codigo];

    if (!cupon) {
      return res.status(400).json({ error: "Cupón inválido" });
    }

    // Verificar fecha de expiración
    if (cupon.fechaExpiracion && new Date() > new Date(cupon.fechaExpiracion)) {
      return res.status(400).json({ error: "Cupón expirado" });
    }

    // Marcar como usado
    cupon.usado = true;

    res.json({ 
      success: true, 
      porcentaje: cupon.porcentaje, 
      mensaje: "Cupón aplicado correctamente" 
    });
  } catch (err) {
    console.error("Error al validar cupón:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Sistema de Progreso y Logros ---

// Actualizar progreso de lección
app.post("/api/progreso", authMiddleware, async (req, res) => {
  try {
    const { courseSlug, leccionId, completada } = req.body;

    const [user] = await pool.query(
      "SELECT progreso FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );
    let progreso = user[0].progreso || {};

    // Actualizar progreso de la lección
    progreso = {
      ...progreso,
      [courseSlug]: {
        ...progreso[courseSlug],
        [leccionId]: completada,
        ultima_leccion: leccionId,
        lecciones_completadas: (progreso[courseSlug]?.lecciones_completadas || 0) + (completada ? 1 : 0)
      }
    };

    await pool.query(
      "UPDATE usuarios SET progreso = ? WHERE id = ?",
      [JSON.stringify(progreso), req.usuario.id]
    );

    // Verificar logros
    const newAchievements = checkAchievements(progreso, req.usuario.id);

    res.json({ 
      success: true, 
      progreso,
      nuevosLogros: newAchievements 
    });
  } catch (err) {
    console.error("Error al actualizar progreso:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Helper function para logros (agregaremos esto después)
function checkAchievements(progreso, userId) {
  // Lógica simplificada - en producción sería más robusta
  return [];
}

// --- Rutas de Certificados ---

// Generar certificado
app.post("/api/certificados", authMiddleware, async (req, res) => {
  try {
    const { courseSlug } = req.body;

    const [user] = await pool.query(
      "SELECT id, nombre, email, certificados FROM usuarios WHERE id = ?",
      [req.usuario.id]
    );
    const userData = user[0];
    let certificados = userData.certificados || [];

    // Verificar si ya tiene certificado para este curso
    if (certificados.includes(courseSlug)) {
      return res.status(400).json({ error: "Ya tienes un certificado para este curso" });
    }

    // Generar código único
    const codigoCertificado = `BC-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    certificados.push({
      courseSlug,
      codigo: codigoCertificado,
      emitido_en: new Date().toISOString()
    });

    await pool.query(
      "UPDATE usuarios SET certificados = ? WHERE id = ?",
      [JSON.stringify(certificados), req.usuario.id]
    );

    res.json({ 
      success: true, 
      certificado: { courseSlug, codigo: codigoCertificado, fecha: new Date().toISOString() } 
    });
  } catch (err) {
    console.error("Error al generar certificado:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Rutas de Preguntas y Respuestas ---

// Publicar pregunta
app.post("/api/cursos/:slug/preguntas", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const { pregunta } = req.body;

    if (!pregunta || pregunta.trim().length === 0) {
      return res.status(400).json({ error: "La pregunta no puede estar vacía" });
    }

    const [course] = await pool.query(
      "SELECT id, titulo FROM cursos WHERE slug = ?",
      [slug]
    );

    if (course.length === 0) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Insertar pregunta
    const [result] = await pool.query(
      "INSERT INTO preguntas (curso_id, usuario_id, pregunta, creado_en) VALUES ((SELECT id FROM cursos WHERE slug = ?), ?, ?, NOW())",
      [slug, req.usuario.id, pregunta]
    );

    res.json({ 
      success: true, 
      id: result.insertId,
      mensaje: "Pregunta publicada" 
    });
  } catch (err) {
    console.error("Error al publicar pregunta:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener preguntas de un curso
app.get("/api/cursos/:slug/preguntas", authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;

    const [preguntas] = await pool.query(
      "SELECT p.id, u.nombre, p.pregunta, p.creado_en FROM preguntas p JOIN usuarios u ON p.usuario_id = u.id WHERE p.curso_id = (SELECT id FROM cursos WHERE slug = ?) ORDER BY p.creado_en DESC",
      [slug]
    );

    res.json({ preguntas });
  } catch (err) {
    console.error("Error al obtener preguntas:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Health check ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), endpoints: ["carrito", "certificados", "progreso", "preguntas", "cupones"] });
});

// --- Rutas de Usuarios (admin) ---
app.get("/api/usuarios", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol, creado_en FROM usuarios"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error al listar usuarios:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --- Iniciar servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor BioCursos API escuchando en http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});

export default app;