const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: false },
  email: { type: String, required: false },
  labName: { type: String, required: false },
  crotpd: { type: Number, required: false },
  instagram: { type: String, required: false },
  telefone: { type: String, maxLength: 14 },
});

module.exports = mongoose.model("User", UserSchema);
