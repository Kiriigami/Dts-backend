const { ServiceBroker } = require("moleculer");
const AuthService = require("../services/auth.service");
const userModel = require("../models/Users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("AuthService", () => {
  let broker = new ServiceBroker({ logger: false });
  let service = broker.createService(AuthService);
  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("login action", () => {
    it("should return user data and token for valid credentials", async () => {
      const user = {
        _id: "userId",
        name: "Test User",
        email: "amos@gmail.com",
        password: bcrypt.hashSync("Mypassword", 10),
      };
      jest.spyOn(userModel, "findOne").mockImplementationOnce(() =>
        Promise.resolve({
          _id: "userId",
          name: "Test User",
          email: "amos@gmail.com",
          password: bcrypt.hashSync("Mypassword", 10),
        })
      );
      jest
        .spyOn(jwt, "sign")
        .mockImplementationOnce(() => Promise.resolve("thanks"));

      const params = { email: "amos@gmail.com", password: "Mypassword" };
      const response = await broker.call("auth.login", params);

      expect(response).toHaveProperty("email", user.email);
    });

    it("should throw an error for missing parameters", async () => {
      const params = {};
      await expect(broker.call("auth.login", params)).rejects.toHaveProperty(
        "code",
        422
      );
    });

    it("should throw an error for invalid email or password", async () => {
      service.adapter.findOne = jest.fn(() => null);

      const params = {
        email: "invalid@example.com",
        password: "invalidpassword",
      };
      await expect(broker.call("auth.login", params)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });
});
