const User = require("../models/Users.model");
const DbMixin = require("../mixins/db.mixin");
const { MoleculerClientError } = require("moleculer").Errors;
const { updateUserSchema } = require("../utils/joi");

module.exports = {
  name: "updateUser",
  mixins: [DbMixin("crud", User)],
  settings: { fields: ["name", "email",] },
  actions: {
    async update(ctx) {
        console.log(ctx.meta.user)
        const { id } = ctx.meta.user;
        const user = await User.findById(id);
          if (!user) {
            throw new MoleculerClientError("User not found", 404, "", [
              { message: "User not found" },
            ]);
          }
        const {error, value} = updateUserSchema.validate(ctx.params);
        if (error) {
            throw new MoleculerClientError(error.details[0].message, 422, "", [{message: "Invalid parameters"}]);
        }     
            const { name, email } = value;
            if (name) user.name = name;
            if (email) user.email = email;
          try {
            await user.save();
            return { _id: user._id, name: user.name, email: user.email };
          } catch (error) {
            throw new MoleculerClientError(error, 500, "",[{ message: "Failed to Update User"}]);
          }
    },
  },
};
