const express = require("express");
const {
  addCustomer,
  getCustomers,
  addOrder,
  getOrders,
  createCampaign,
  getCampaigns,
  googleLogin,
  // googleCallback,
} = require("../controllers/controllers");
const router = express.Router();

router.post("/customers", addCustomer);
router.get("/customers", getCustomers);

router.post("/orders", addOrder);
router.get("/orders", getOrders);

router.post("/campaigns", createCampaign);
router.get("/campaigns", getCampaigns);

router.post("/auth/google", googleLogin);
// router.get("/auth/google/callback", googleCallback);

module.exports = router;
