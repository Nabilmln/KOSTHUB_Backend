const mongoose = require("mongoose");

const Auth = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  nomor: {
    type: String,
    required: true,
  },
  tanggal_lahir: {
    type: String,
  },
  alamat: {
    type: String,
  },
  gender : {
    type: Boolean,
  },
  bio : {
    type: String,
    default: "",
  },
  token: {
    type: String,
  },
});

module.exports = mongoose.model("Auth", Auth);