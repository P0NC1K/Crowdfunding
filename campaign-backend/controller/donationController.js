const { models } = require("../sequelize");
const Joi = require("joi");

const donationAddValidation = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().required(),
  campaignId: Joi.string().required(),
});

exports.postCreateDonation = async (req, res) => {
  try {
    const validRequest = donationAddValidation.validate(req.body);
    if (validRequest.error) {
      return res
        .status(400)
        .json({ status: "fail", message: validRequest.error.message });
    }
    const donation = await models.donation.create(req.body);
    res.status(200).json({ donation, message: 'Donation given successfully' });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDonationByCampaign = async (req, res) => {
  try {
    const campaignDonations = await models.donation.findAll({
      where: {
        campaignId: req.query.campaignId,
      },
    });
    res.status(200).json({ donations: campaignDonations });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
