import request from "supertest";
import { describe, it, beforeAll, afterAll } from "jest";
import app from "../server.js";
import { pool } from "../src/server.js";

let server;
let authToken;

beforeAll(async () => {
  server = app.listen(0);
  // Insertar usuario admin para pruebas de admin
  const hashedPassword = await new Promise((resolve, reject) => {
    require("bcryptjs").hash("admin123", 12, (err, hash) => {
      err ? reject(err) : resolve(hash);
    });
  });
  await pool.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    ["Admin Test", "admin@test.com", hashedPassword, "admin"]
  );
  const loginRes = await request(app)
    .post("/api/login")
    .send({ email: "admin@test.com", password: "admin123" });
  authToken = loginRes.body.token;
  console.log("🔑 Token admin obtenido");
});

afterAll(async () => {
  await pool.query("DELETE FROM usuarios WHERE email = 'admin@test.com'");
  server.close();
});

describe("Cursos API", () => {
  it("debería listar cursos", async () => {
    const res = await request(app).get("/api/cursos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("debería obtener un curso por slug", async () => {
    // Primero creamos un curso
    const createRes = await request(app)
      .post("/api/cursos")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ slug: "test-curso", titulo: "Curso de Prueba", descripcion: "Descripción de prueba" });
    expect(createRes.status).toBe(201);
    const slug = createRes.body.slug;

    const res = await request(app).get(`/api/cursos/${slug}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("titulo", "Curso de Prueba");
  });

  it("debería fallar al crear curso sin auth", async () => {
    const res = await request(app).post("/api/cursos").send({ titulo: "Sin auth" });
    expect(res.status).toBe(401);
  });
});