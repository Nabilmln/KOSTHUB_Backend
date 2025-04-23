const express = require("express");
const router = express.Router();
const kosController = require("../controllers/kosController");

router.get("/filter", kosController.filterKos); // Filter berdasarkan fasilitas, harga, rating

router.get("/", kosController.getAllKos);
router.get("/:id", kosController.getKosById);
router.post("/", kosController.createKos);
router.put("/:id", kosController.updateKos);
router.delete("/:id", kosController.deleteKos);

module.exports = router;
