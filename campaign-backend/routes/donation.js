const router = require('express').Router();
const donationController = require("../controller/donationController");

router.post("/create", donationController.postCreateDonation);
router.get("/", donationController.getDonationByCampaign);

module.exports = router;