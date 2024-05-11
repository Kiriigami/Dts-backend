const { ServiceBroker } = require("moleculer");
const DeleteUserService = require("../services/delete.service");
const User = require("../models/Users.model");
const { MoleculerClientError } = require("moleculer").Errors;

describe("DeleteUserService", () => {
  let broker;
  let deleteUserService;

  beforeAll(async () => {
    broker = new ServiceBroker({ logger: false });
    deleteUserService = broker.createService(DeleteUserService);
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  describe("delete action", () => {
    it("should delete a user successfully", async () => {
      const mockUser = {
        _id: "663cf220b84ecc02b8031682",
        name: "Test User",
        email: "test@example.com",
      };
      jest.spyOn(User, "findById").mockResolvedValueOnce(mockUser);

      const ctx = {
        meta: {
          user: {
            id: "663cf220b84ecc02b8031682",
          },
        },
      };

      const response = await broker.call("deleteUser.delete", null, ctx);
      expect(response).toEqual({ message: "User deleted successfully." });
    });

    it("should throw an error if user not found", async () => {
      jest.spyOn(User, "findById").mockResolvedValueOnce(null);

      const ctx = {
        meta: {
          user: {
            id: "663cf220b84ecc02b8031682",
          },
        },
      };

      await expect(
        broker.call("deleteUser.delete", null, ctx)
      ).rejects.toHaveProperty("code", 404);
    });
  });
});
