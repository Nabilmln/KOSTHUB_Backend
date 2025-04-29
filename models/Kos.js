const mongoose = require("mongoose");

const KosSchema = new mongoose.Schema({
  id_kos: { type: Number, required: true, unique: true },
  nama_kos: { type: String, required: true },
  alamat: { type: String, required: true },
  fasilitas: [
    {
      nama: { type: String, required: true },
      jumlah: { type: Number, required: true },
    },
  ],
  harga_perbulan: { type: Number, required: true },
  harga_pertahun: { type: Number, required: true },
  kontak: {
    email: { type: String, required: true },
    nomor: { type: String, required: true },
  },
  avgBintang: { type: Number, default: 0 },
  image: [
    {
      url: { type: String, required: true },
      isThumbnail: { type: Boolean, default: false },
    },
  ],
  deskripsi: { type: String, default: "" },
  ulasan: [
    {
      nama: { type: String, required: true },
      bintang: { type: Number, required: true },
      komentar: { type: String, required: true },
      tanggal: { type: Date, default: Date.now },
      imageUlasan: { url: { type: String, required: true } },
    },
  ],
});

module.exports = mongoose.model("Kos", KosSchema);
