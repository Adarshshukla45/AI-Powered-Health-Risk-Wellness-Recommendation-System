/**
 * These tests hit real Express routes + a real MongoDB connection via
 * mongoose, using supertest. They need MONGO_URI to point at a
 * disposable test database (never your production data).
 *
 * Run:
 *   MONGO_URI=mongodb://localhost:27017/ai_health_risk_test JWT_SECRET=test_secret npx jest tests/integration.test.js --runInBand
 *
 * These are skipped automatically if MONGO_URI is not set, so `npm test`
 * still runs the unit tests in CI/sandboxes without a MongoDB instance.
 */
const mongoose = require("mongoose");

const hasMongo = !!process.env.MONGO_URI;
const describeIfMongo = hasMongo ? describe : describe.skip;

describeIfMongo("Auth + Products integration (requires real MongoDB)", () => {
  let app;
  let User;
  let Product;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
    app = require("../server");
    User = require("../models/User");
    Product = require("../models/Product");
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  const request = require("supertest");

  test("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("test@example.com");
  });

  test("rejects duplicate email registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  test("logs in with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("rejects login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrong-password",
    });
    expect(res.status).toBe(401);
  });

  test("GET /api/products returns an empty list before seeding", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test("GET /api/assessment/history requires auth", async () => {
    const res = await request(app).get("/api/assessment/history");
    expect(res.status).toBe(401);
  });
});
