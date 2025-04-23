const mongoose = require("mongoose");

const KosSchema = new mongoose.Schema({
  id_kos: { type: Number, required: true, unique: true },
  nama_kos: { type: String, required: true },
  alamat: { type: String, required: true },
  fasilitas: { type: [String], default: [] }, // Contoh: ["Wifi", "Kasur"]
  harga_perbulan: { type: Number, required: true },
  harga_pertahun: { type: Number, required: true },
  kontak: {
    email: { type: String, required: true },
    nomor: { type: String, required: true },
  },
  ulasan: [
    {
      nama: { type: String, required: true },
      bintang: { type: Number, required: true }, // Rating dari 1 hingga 5
      komentar: { type: String, required: true },
    },
  ],
  image: [
    {
      url: {type: String, required: true},
      isThumbnail: {type: Boolean, default: false}
    },
  ],
  deskripsi: { type: String, default: "" },
});

module.exports = mongoose.model("Kos", KosSchema);