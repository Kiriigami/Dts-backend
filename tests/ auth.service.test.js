const { ServiceBroker } = require("moleculer");
const AuthService = require("../services/auth.service");

describe("AuthService", () => {
 let broker = new ServiceBroker({ logger: false });
 let service = broker.createService(AuthService);
 beforeAll(() => broker.start());
 afterAll(() => broker.stop());

  describe("login action", () => {
    it("should return user data and token for valid credentials", async () => {
      service.adapter.findOne = jest.fn(() => ({
        _id: "userId",
        name: "Test User",
        email: "amos@gmail.com",
        password: bcrypt.hashSync("Mypassword", 10),
      }));

      const params = { email: "amos@gmail.com", password: "Mypassword" };
      const response = await broker.call("auth.login", params);

      expect(response).toHaveProperty("code", 200)
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
