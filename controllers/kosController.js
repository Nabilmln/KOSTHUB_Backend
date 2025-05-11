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
    const hargaField =
      tipeHarga === "pertahun" ? "harga_pertahun" : "harga_perbulan";

    // Filter berdasarkan range harga
    if (minHarga || maxHarga) {
      filter[hargaField] = {};
      if (minHarga) {
        filter[hargaField].$gte = parseInt(minHarga);
      }
      if (maxHarga) {
        filter[hargaField].$lte = parseInt(maxHarga);
      }
    }

    // Pipeline MongoDB
    const pipeline = [
      {
        $addFields: {
          rataRataBintang: { $round: [{ $avg: "$ulasan.bintang" }, 0] },
        },
      },
      {
        $match: filter,
      },
    ];

    // Filter berdasarkan rating (bintang)
    if (rating) {
      pipeline.push({
        $match: { rataRataBintang: parseInt(rating) },
      });
    }

    // Sorting berdasarkan harga
    if (harga === "termurah") {
      pipeline.push({ $sort: { [hargaField]: 1 } });
    } else if (harga === "termahal") {
      pipeline.push({ $sort: { [hargaField]: -1 } });
    }

    const data = await Kos.aggregate(pipeline);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error filtering kos", error });
  }
};

exports.addReview = async (req, res) => {
  const { id_kos } = req.params;
  const { bintang, komentar } = req.body;

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
      imageUlasan: req.file ? req.file.path : null,
      tanggal: new Date(),
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
