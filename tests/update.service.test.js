const { ServiceBroker } = require("moleculer");
const UpdateUserService = require("../services/update.service");
const User = require("../models/Users.model");
const { MoleculerClientError } = require("moleculer").Errors;
const { updateUserSchema } = require("../utils/joi");

describe("UpdateUserService", () => {
  let broker;
  let updateUserService;

  beforeAll(async () => {
    broker = new ServiceBroker({ logger: false });
    updateUserService = broker.createService(UpdateUserService);
    await broker.start();
  });

  afterAll(async () => {
    await broker.stop();
  });

  describe("update action", () => {
    it("should update user data successfully", async () => {
      const mockUser = {
        _id: "663cf220b84ecc02b8031682",
        name: "Test User",
        email: "test@example.com",
        // save: jest.fn(),
      };
      jest.spyOn(User, "findById").mockResolvedValueOnce(mockUser);

      const params = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const ctx = {
        meta: {
          user: {
            id: "663cf220b84ecc02b8031682",
          },
        },
        params,
      };
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
      await expect(broker.call("updateUser.update", null, ctx)).rejects.toThrow(
        MoleculerClientError
      );
    });

    it("should throw an error if parameters are invalid", async () => {
      const params = {};

      const ctx = {
        meta: {
          user: {
            id: "663cf220b84ecc02b8031682",
          },
        },
        params,
      };

      //   await expect(updateUserService.actions.update(ctx)).rejects.toThrow(
      //     MoleculerClientError
      //   );

      await expect(broker.call("updateUser.update", null, ctx)).rejects.toThrow(
        MoleculerClientError
      );
    });
  });
});
