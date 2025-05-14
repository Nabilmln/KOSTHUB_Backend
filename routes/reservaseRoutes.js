const express = require("express");
const router = express.Router();
const reservaseConroller = require("../controllers/reservaseController");
const { verifyToken } = require("../middleware/auth");

router.post(
  "/:id_user/:id_kos",
  verifyToken,
  reservaseConroller.createReservase
);

router.get(
  "/user/:id_user",
  verifyToken,
  reservaseConroller.getReservaseByUserId
);

module.exports = router;
