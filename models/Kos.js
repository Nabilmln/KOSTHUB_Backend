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
  ulasan: [
    {
      nama: String,
      bintang: Number,
      komentar: String,
    },
  ],
  deskripsi: String,
});

module.exports = mongoose.model("Kos", KosSchema);
