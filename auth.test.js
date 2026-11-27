import request from "supertest";
import { describe, it, beforeAll, afterAll, beforeEach } from "jest";
import app from "../server.js";
import { pool } from "../src/server.js";

let server;
let authToken;

beforeAll(async () => {
  server = app.listen(0);
  const port = server.address().port;
  // Insertar un usuario de prueba antes de los tests
  const hashedPassword = await new Promise((resolve, reject) => {
    require("bcryptjs").hash("test123", 12, (err, hash) => {
      err ? reject(err) : resolve(hash);
    });
  });
  await pool.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    ["Usuario Test", "test@biocursos.com", hashedPassword, "estudiante"]
  );
  const loginRes = await request(app)
    .post("/api/login")
    .send({ email: "test@biocursos.com", password: "test123" });
  authToken = loginRes.body.token;
  console.log("🔑 Token obtenido en beforeAll");
});

afterAll(async () => {
  await pool.query("DELETE FROM usuarios WHERE email = 'test@biocursos.com'");
  server.close();
});

describe("Auth API", () => {
  it("debería login exitoso y retornar token", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@biocursos.com", password: "test123" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "test@biocursos.com");
  });

  it("debería fallar con credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@biocursos.com", password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("debería rechazar acceso sin token", async () => {
    const res = await request(app).get("/api/me");
    expect(res.status).toBe(401);
  });

  it("debería permitir acceso con token válido", async () => {
    const res = await request(app)
      .get("/api/me")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "test@biocursos.com");
  });
});