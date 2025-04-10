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
