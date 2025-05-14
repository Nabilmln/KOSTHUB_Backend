const Reservase = require("../models/Reservase");
const Auth = require("../models/Auth");
const Kos = require("../models/Kos");

exports.createReservase = async (req, res) => {
  const { id_kos, id_user } = req.params;

  try {
    const {
      nama,
      tanggal_lahir,
      nomor_hp,
      gender,
      email,
      periode_penyewaan,
      kontrak,
      bukti_pembayaran,
    } = req.body;

    if (
      !nama ||
      !tanggal_lahir ||
      !nomor_hp ||
      gender === undefined ||
      !email ||
      !periode_penyewaan ||
      !kontrak ||
      !bukti_pembayaran
    ) {
      return res.status(400).json({ message: "Mohon Isi Semua Field!" });
    }

    // Cari user
    const existingUser = await Auth.findById(id_user);
    if (!existingUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Cek apakah sudah reservasi sebelumnya
    if (existingUser.reservaseKos) {
      return res.status(400).json({
        message: "User sudah melakukan reservasi",
        status: 400,
        data: existingUser,
      });
    }

    const kos = await Kos.findOne({ id_kos: parseInt(id_kos) });
    if (!kos) {
      return res.status(404).json({ message: "Kos tidak ditemukan" });
    }

    if (!["Tahun", "Bulan"].includes(periode_penyewaan)) {
      return res.status(400).json({
        message: "Periode penyewaan harus 'Bulan' atau 'Tahun'",
      });
    }

    const realGender = gender === "Laki" ? true : false;

    const newReservase = new Reservase({
      nama,
      tanggal_lahir,
      nomor_hp,
      gender: realGender,
      email,
      periode_penyewaan,
      kontrak,
      bukti_pembayaran,
      id_kos: kos._id,
      id_user,
    });

    await newReservase.save();

    existingUser.reservaseKos = newReservase._id;
    await existingUser.save();

    res.status(200).json({
      status: 200,
      message: "Berhasil Create Reservase",
      data: newReservase,
    });
  } catch (error) {
    console.error("Error createReservase:", error);
    return res.status(500).json({
      status: 500,
      message: "Server Error",
      data: error.message,
    });
  }
};

exports.getReservaseByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;

    const user = await Auth.findById(id_user);
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
        status: 404,
      });
    }

    const reservaseList = await Reservase.find({ id_user: user._id }).populate(
      "id_kos"
    );

    if (reservaseList.length === 0) {
      return res.status(404).json({
        message: "Tidak ada reservasi untuk user ini",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Data reservasi berhasil ditemukan",
      status: 200,
      data: reservaseList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server internal error",
      status: 500,
      error: error.message,
      data: error,
    });
  }
};
