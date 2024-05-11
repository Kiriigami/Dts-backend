const { ServiceBroker } = require("moleculer");
const UserService = require("../services/create.service");
const User = require("../models/Users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

describe("UserService", () => {
  let broker;
  let userService;

  beforeAll(async () => {
    broker = new ServiceBroker({ logger: false });
    userService = broker.createService(UserService);
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  describe("create action", () => {
    it("should create a new user and return user data with token", async () => {
      const mockUser = {
        _id: "user_id",
        name: "Test User",
        email: "test@example.com",
        password: bcrypt.hashSync("password", 10),
      };
      jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(User.prototype, "save").mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, "hashSync").mockReturnValueOnce(mockUser.password);
      jest.spyOn(jwt, "sign").mockReturnValueOnce("mocked_token");

      const params = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
        confirmPassword: "password",
      };
      const response = await broker.call("user.create", params);

      expect(response).toHaveProperty("token", "mocked_token");
    });

    it("should throw an error if email already exists", async () => {
      jest
        .spyOn(User, "findOne")
        .mockResolvedValueOnce({ email: "test@example.com" });

      const params = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
        confirmPassword: "password",
      };
      await expect(broker.call("user.create", params)).rejects.toThrow(
        "Email already exists"
      );
    });
  });
});
