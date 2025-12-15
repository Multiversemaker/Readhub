const { login, register } = require("../controllers/auth/authController");
const bcrypt = require("bcrypt");

// Mock database models
jest.mock("../models", () => ({
  user: {
    findOne: jest.fn(),
  },
  role: {}
}));

// Mock bcrypt
bcrypt.compare = jest.fn();

// Helper untuk mock req & res
const mockReqRes = () => {
  const req = {
    body: {},
    session: {},
    flash: jest.fn(),
  };

  const res = {
    redirect: jest.fn(),
  };

  return { req, res };
};

describe("Login Controller", () => {
  test("Harus gagal jika email tidak ditemukan", async () => {
    const { req, res } = mockReqRes();

    req.body = { email: "test@gmail.com", password: "123" };
    const { user } = require("../models");

    user.findOne.mockResolvedValue(null); // user tidak ada

    await login(req, res);

    expect(req.flash).toHaveBeenCalledWith("error", "Email tidak ditemukan!");
    expect(res.redirect).toHaveBeenCalledWith("/login");
  });

  test("Harus gagal jika password salah", async () => {
    const { req, res } = mockReqRes();

    req.body = { email: "test@gmail.com", password: "salah" };

    const { user } = require("../models");

    user.findOne.mockResolvedValue({
      password: "hashedpass",
      role: { role: "client" },
    });

    bcrypt.compare.mockResolvedValue(false); // password mismatch

    await login(req, res);

    expect(req.flash).toHaveBeenCalledWith("error", "Password salah!");
    expect(res.redirect).toHaveBeenCalledWith("/login");
  });

  test("Harus berhasil login admin", async () => {
    const { req, res } = mockReqRes();

    req.body = { email: "admin@gmail.com", password: "benar" };

    const { user } = require("../models");

    user.findOne.mockResolvedValue({
      id_user: 1,
      nama: "Admin",
      password: "hashedpass",
      role: { role: "admin" },
    });

    bcrypt.compare.mockResolvedValue(true); // password benar

    await login(req, res);

    expect(req.session.userId).toBe(1);
    expect(req.session.role).toBe("admin");
    expect(res.redirect).toHaveBeenCalledWith("/admin/dashboard");
  });

  test("Harus berhasil login client", async () => {
    const { req, res } = mockReqRes();

    req.body = { email: "client@gmail.com", password: "benar" };

    const { user } = require("../models");

    user.findOne.mockResolvedValue({
      id_user: 5,
      nama: "Client",
      password: "hashedpass",
      role: { role: "client" },
    });

    bcrypt.compare.mockResolvedValue(true);

    await login(req, res);

    expect(req.session.userId).toBe(5);
    expect(req.session.role).toBe("client");
    expect(res.redirect).toHaveBeenCalledWith("/client/dashboard");
  });
});

describe("Register Controller", () => {
  test("Harus gagal jika email sudah digunakan", async () => {
    const { req, res } = mockReqRes();

    req.body = { nama: "a", email: "a@g.com", password: "123", role_idrole: 1 };

    const { user } = require("../models");
    user.findOne.mockResolvedValue({ email: "a@g.com" });

    await register(req, res);

    expect(req.flash).toHaveBeenCalledWith("warning", "Email sudah digunakan!");
    expect(res.redirect).toHaveBeenCalledWith("/register");
  });

  test("Harus berhasil register", async () => {
    const { req, res } = mockReqRes();

    req.body = { nama: "a", email: "baru@g.com", password: "123", role_idrole: 2 };

    const { user } = require("../models");
    user.findOne.mockResolvedValue(null); // email belum terpakai

    user.create = jest.fn().mockResolvedValue(true);

    bcrypt.hash = jest.fn().mockResolvedValue("hashed-pass");

    await register(req, res);

    expect(user.create).toHaveBeenCalled();
    expect(req.flash).toHaveBeenCalledWith("success", "Pendaftaran berhasil!");
    expect(res.redirect).toHaveBeenCalledWith("/login");
  });
});
