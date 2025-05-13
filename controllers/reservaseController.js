const Reservase = require("../models/Reservase");
const Auth = require("../models/Auth");
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

    const existingUser = await Auth.findById(id_user);
    if (!existingUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (existingUser.reservaseKos) {
      return res.status(400).json({
        message: "User sudah melakukan reservasi",
        status: 400,
        data: existingUser,
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
      id_kos,
      id_user,
    });

    if (!["Tahun", "Bulan"].includes(periode_penyewaan)) {
      return res.status(400).json({
        message: "Periode penyewaan harus 'Bulan' atau 'Tahun'",
      });
    }

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

exports.getReservaseById = async (req, res) => {
  try {
    const { id_kos } = req.params;
    const reservaseList = await Reservase.find({ id_kos });

    if (reservaseList.length === 0) {
      return res.status(400).json({
        message: "Tidak Ada Reservase Untuk Kos ini",
        status: 400,
      });
    }

    res.status(200).json({
      message: "Data Reservasi Berhasil Ditemukan",
      status: 200,
      data: reservaseList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Internal Error",
      error: error.message,
      data: error,
    });
  }
};
