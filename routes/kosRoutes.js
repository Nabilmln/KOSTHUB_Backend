const express = require("express");
const router = express.Router();
const kosController = require("../controllers/kosController");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth");


router.get("/filter", kosController.filterKos); 
router.post("/add-review/:id_kos", verifyToken, upload.single("imageUlasan"), kosController.addReview);

router.get("/", kosController.getAllKos);
router.get("/:id", kosController.getKosById);
router.post("/", kosController.createKos);
router.put("/:id", kosController.updateKos);
router.delete("/:id", kosController.deleteKos);
// router.get("/:id_kos/gallery", kosController.getGalleryKos);

module.exports = router;
