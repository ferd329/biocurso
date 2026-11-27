import request from "supertest";
import { describe, it, beforeAll, afterAll } from "jest";
import app from "../server.js";
import { pool } from "../src/server.js";

let server;
let authToken;

beforeAll(async () => {
  server = app.listen(0);
  // Insertar usuario admin
  const hashedPassword = await new Promise((resolve, reject) => {
    require("bcryptjs").hash("admin123", 12, (err, hash) => {
      err ? reject(err) : resolve(hash);
    });
  });
  await pool.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    ["Admin Test", "admin2@test.com", hashedPassword, "admin"]
  );
  const loginRes = await request(app)
    .post("/api/login")
    .send({ email: "admin2@test.com", password: "admin123" });
  authToken = loginRes.body.token;
  console.log("🔑 Token admin2 obtenido");
});

afterAll(async () => {
  await pool.query("DELETE FROM usuarios WHERE email = 'admin2@test.com'");
  server.close();
});

describe("Planes API", () => {
  it("debería listar planes", async () => {
    const res = await request(app).get("/api/planes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("debería retornar al menos 3 planes", async () => {
    const res = await request(app).get("/api/planes");
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });
});