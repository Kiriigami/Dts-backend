const User = require("../models/Users.model");
const DbMixin = require("../mixins/db.mixin");
const { MoleculerClientError } = require("moleculer").Errors;

module.exports = {
  name: "deleteUser",
  mixins: [DbMixin("crud", User)],
  settings: { fields: ["name", "email"] },
  actions: {
    async delete(ctx) {
           const { id } = ctx.meta.user;
           const user = await User.findById(id);
           if (!user) {
             throw new MoleculerClientError("User not found.", 404, "",[{ message: "User not found"}]);
           }
       try {
            await User.deleteOne({_id: user._id})
            return { message: "User deleted successfully." };
            } catch (error) {
                console.error("Failed to delete user:", error.message);
                throw MoleculerClientError(error, 422, "",[{ message: "Failed to delete user"}]);
            }
  },
}
}
