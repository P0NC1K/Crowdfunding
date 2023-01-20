const router = require('express').Router();
const campaignController = require("../controller/campaignController");;

router.post("/create", campaignController.addCampaign);
router.get("/markCampaignAsFraud", campaignController.markCampaignAsInvalid);
router.get('/', campaignController.getCampaigns);
router.get('/user', campaignController.getUserCampaigns);

module.exports = router;