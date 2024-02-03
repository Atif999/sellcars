// customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Preserve original file name
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error("Only CSV files are allowed!"), false);
    }
    cb(null, true);
  },
});
// Route to handle customer data upload
router.post(
  "/upload",
  upload.single("file"),
  customerController.uploadCustomerData
);

router.post(
  "/upload-contact",
  upload.single("file"),
  customerController.uploadContactsData
);

router.post(
  "/upload-address",
  upload.single("file"),
  customerController.uploadAddressData
);

router.get("/allCustomers", customerController.getCustomers);
router.delete("/:intnr", customerController.deleteCustomerById);
router.put("/updateCustomer", customerController.updateCustomerById);

module.exports = router;
