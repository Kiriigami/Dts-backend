require("dotenv").config();
const { ServiceBroker } = require("moleculer");
const ApiService = require("moleculer-web");
const userServices = require("./services/create.service");
const updateService = require("./services/update.service");
const deleteService = require("./services/delete.service");
const authService = require("./services/auth.service");
const jwt = require("jsonwebtoken");
const E = require("moleculer-web").Errors;

const broker = new ServiceBroker({
  nodeID: "node-1",
  //   transporter: "NATS",
  cacher: "Memory",
  logger: true,
  logLevel: "info",
});

broker.createService(userServices);
broker.createService(updateService);
broker.createService(deleteService);
broker.createService(authService);

broker.createService({
  name: "api",
  mixins: [ApiService],
  settings: {
    port: 8080,
    bodyParsers: {
      json: true,
      urlencoded: { extended: true },
    },
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
          "X-HTTP-Method-Override",
        ],
        exposedHeaders: ["X-Total-Count"],
        credentials: true,
        maxAge: 3600,
    },
    routes: [
      {
        path: "/api",
        aliases: {
          "POST user/create": "user.create",
          "POST user/login": "auth.login",
        },
      },

      {
        path: "/api/auth",
        aliases: {
          "PATCH user/update/:id": "updateUser.update",
          "DELETE user/delete": "deleteUser.delete",
        },
        authorization: true,
      },
    ],
  },

  methods: {
    authorize(ctx, route, req, res) {
      let auth = req.headers["authorization"];
      if (auth && auth.startsWith("Bearer ")) {
        let token = auth.slice(7);
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          console.log(decodedToken);
          ctx.meta.user = decodedToken;
          return Promise.resolve(ctx);
        } catch (error) {
          console.error(error);
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
        }
      } else {
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
      }
    },
  },
});

broker.start().then(() => {
  console.log("broker started");
});
