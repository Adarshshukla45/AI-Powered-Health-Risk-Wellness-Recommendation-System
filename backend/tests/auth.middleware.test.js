
// test in backend

// "Testing in the backend" means running automated checks that confirm the backend code (the Express server, login system, database logic) actually works correctly — without you having to manually click through the app every time you make a change.

jest.mock("../models/User", () => ({
  findById: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

describe("auth middleware: protect", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, JWT_SECRET: "test_secret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  test("rejects requests with no Authorization header", async () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects an invalid/garbage token", async () => {
    const req = { headers: { authorization: "Bearer not-a-real-token" } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects a valid token whose user no longer exists", async () => {
    const token = jwt.sign({ id: "60f0000000000000000000aa" }, "test_secret");
    User.findById.mockResolvedValue(null);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("attaches req.user and calls next() for a valid token + existing user", async () => {
    const token = jwt.sign({ id: "60f0000000000000000000aa" }, "test_secret");
    const fakeUser = { _id: "60f0000000000000000000aa", name: "Test User" };
    User.findById.mockResolvedValue(fakeUser);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(req.user).toBe(fakeUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
