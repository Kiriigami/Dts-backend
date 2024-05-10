const DbService = require("moleculer-db");
const MongooseDbAdapter = require("moleculer-db-adapter-mongoose");

module.exports = function (collection, model) {
  return {
    mixins: [DbService],
    adapter: new MongooseDbAdapter(`${process.env.MONGO_URL}${collection}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    model,
  };
};
