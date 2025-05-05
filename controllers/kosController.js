const Kos = require("../models/Kos");

// GET all
exports.getAllKos = async (req, res) => {
  const data = await Kos.find();
  res.json(data);
};

// GET by ID
exports.getKosById = async (req, res) => {
  const kos = await Kos.findOne({ id_kos: req.params.id });
  kos ? res.json(kos) : res.status(404).json({ message: "Tidak ditemukan" });
};

// POST
exports.createKos = async (req, res) => {
  const kos = new Kos(req.body);
  await kos.save();
  res.status(201).json(kos);
};

// PUT
exports.updateKos = async (req, res) => {
  const updated = await Kos.findOneAndUpdate(
    { id_kos: req.params.id },
    req.body,
    { new: true }
  );
  updated
    ? res.json(updated)
    : res.status(404).json({ message: "Tidak ditemukan" });
};

// DELETE
exports.deleteKos = async (req, res) => {
  const result = await Kos.findOneAndDelete({ id_kos: req.params.id });
  result
    ? res.json({ message: "Dihapus" })
    : res.status(404).json({ message: "Tidak ditemukan" });
};

exports.filterKos = async (req, res) => {
  const { fasilitas, minHarga, maxHarga, rating, tipeHarga, harga } = req.query;

  try {
    let filter = {};

    // Filter berdasarkan fasilitas
    if (fasilitas) {
      const fasilitasArray = Array.isArray(fasilitas) ? fasilitas : [fasilitas];
      filter.fasilitas = { $all: fasilitasArray };
    }

    // Tentukan field harga berdasarkan tipeHarga
    const hargaField = tipeHarga === "pertahun" ? "harga_pertahun" : "harga_perbulan";

    // Filter berdasarkan range harga
    if (minHarga || maxHarga) {
      filter[hargaField] = {};
      if (minHarga) {
        filter[hargaField].$gte = parseInt(minHarga); // Harga minimum
      }
      if (maxHarga) {
        filter[hargaField].$lte = parseInt(maxHarga); // Harga maksimum
      }
    }

    // Pipeline MongoDB
    const pipeline = [
      {
        $addFields: {
          rataRataBintang: { $round: [{ $avg: "$ulasan.bintang" }, 0] }, // Hitung rata-rata bintang dan bulatkan
        },
      },
      {
        $match: filter, // Terapkan filter lain nya
      },
    ];

    // Filter berdasarkan rating (bintang)
    if (rating) {
      pipeline.push({
        $match: { rataRataBintang: parseInt(rating) }, // Cocokkan dengan nilai bintang yang dipilih
      });
    }

    // Sorting berdasarkan harga
    if (harga === "termurah") {
      pipeline.push({ $sort: { [hargaField]: 1 } }); // Ascending (termurah ke termahal)
    } else if (harga === "termahal") {
      pipeline.push({ $sort: { [hargaField]: -1 } }); // Descending (termahal ke termurah)
    }

    // Eksekusi query dengan pipeline
    const data = await Kos.aggregate(pipeline);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error filtering kos", error });
  }
};

exports.addReview = async (req, res) => {
  const { id_kos } = req.params; // Ambil id_kos dari parameter URL
  const { bintang, komentar } = req.body; // Data ulasan dari body request

  try {
    // Validasi input
    if (!bintang || bintang < 1 || bintang > 5) {
      return res
        .status(400)
        .json({ message: "Rating harus antara 1 hingga 5" });
    }

    if (!komentar || komentar.trim() === "") {
      return res.status(400).json({ message: "Komentar tidak boleh kosong" });
    }

    // Cari kos berdasarkan id_kos
    const kos = await Kos.findOne({ id_kos });
    if (!kos) {
      return res.status(404).json({ message: "Kos not found" });
    }

    // Tambahkan ulasan baru ke array ulasan
    const newReview = {
      nama: req.user.username,
      bintang,
      komentar,
      imageUlasan: req.file ? req.file.path : null, // URL gambar ulasan (jika ada)
      tanggal: new Date(), // Tanggal ulasan
    };

    kos.ulasan.push(newReview);

    // Hitung rata-rata bintang baru
    const totalBintang = kos.ulasan.reduce(
      (sum, review) => sum + review.bintang,
      0
    );
    kos.avgBintang = totalBintang / kos.ulasan.length;

    await kos.save();

    res
      .status(200)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review for kos ID:", id_kos, error);
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};
