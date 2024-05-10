const DbService = require("moleculer-db");
const MongooseDbAdapter = require("moleculer-db-adapter-mongoose");

module.exports = function (collection, model) {
  return {
    mixins: [DbService],
    adapter: new MongooseDbAdapter(`mongodb://localhost:27017/${collection}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    model,
  };
};
