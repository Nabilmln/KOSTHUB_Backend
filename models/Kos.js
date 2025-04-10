const mongoose = require("mongoose");

const KosSchema = new mongoose.Schema({
  id_kos: Number,
  nama_kos: String,
  alamat: String,
  fasilitas: [String],
  harga_perbulan: Number,
  harga_pertahun: Number,
  kontak: {
    email: String,
    nomor: String,
  },
});

module.exports = mongoose.model("Kos", KosSchema);
