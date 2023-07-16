const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username required"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
  },
  password: {
    type: String,
    required: [true, "please enter password"],
  },
  todoId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo",
  }],
  refreshToken: [ String],
})

module.exports = mongoose.model("User", userSchema)
