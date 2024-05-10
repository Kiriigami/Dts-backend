const User = require('../models/Users.model')
const bcrypt = require('bcrypt')
const DbMixin = require('../mixins/db.mixin');
const { MoleculerClientError } = require("moleculer").Errors;
const { createUserSchema } = require('../utils/joi');
const jwt = require('jsonwebtoken');

module.exports = ({
  name: "user",
  mixins: [DbMixin("crud", User)],
  settings: {fields: ["name", "email", "_id"]},
  actions: {
    async create(ctx) {
      const {error, value} = createUserSchema.validate(ctx.params);
      if (error) {
        throw new MoleculerClientError(error.details[0].message,422, "", [
          {message: "Invalid Parameters" },
        ])
      }
      const { name, email, password } = value;
      const emailExists = await User.findOne({ email: email})
      if (emailExists) { 
        throw new MoleculerClientError("Email already exists", 500, "", [{ message: "Email already exists"}]);
      }

      const hashPassword = bcrypt.hashSync(password, 10);
      const user = new User({ name, email, password: hashPassword });
      try {
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
          });
        return { _id: user._id, name: user.name, email: user.email, token };
      } catch (error) {
        throw new MoleculerClientError("Failed", 500, "", [{ meessage: "Failed to create user"}])
      }
 
    },
  },
});
