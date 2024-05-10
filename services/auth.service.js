const User = require("../models/Users.model");
const bcrypt = require("bcrypt");
const DbMixin = require("../mixins/db.mixin");
const { loginSchema } = require("../utils/joi");
const { MoleculerClientError } = require("moleculer").Errors;
const jwt = require("jsonwebtoken");

module.exports = {
  name: "auth",
  mixins: [DbMixin("crud", User)],
  settings: { fields: ["name", "email", "_id"] },
  actions: {
    async login(ctx) {
      const { error, value } = loginSchema.validate(ctx.params);
      if (error) {
        throw new MoleculerClientError(error.details[0].message, 422, "", [
          {message: "Invalid Parameters" },
        ]);
      }
      const { email, password } = value;
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new MoleculerClientError("Invalid credentials", 422, "", [
          { message: "Email or Password does not exist" },
        ]);
      } 
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        throw new MoleculerClientError(
          "Invalid credentials",
          422,
          "",
          [{ message: "Email or password does not exist" }]
        );
      }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
        });
        return { _id: user._id, name: user.name, email: user.email, token };
    },
  },
};
