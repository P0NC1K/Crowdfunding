const { models } = require("../sequelize");
const Joi = require("joi");

const campaignAddValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  goalAmount: Joi.number().required(),
  expirationDate: Joi.date().raw().required(),
  userId: Joi.string().required(),
});

exports.addCampaign = async (req, res) => {
  try {
    const validRequest = campaignAddValidation.validate(req.body);
    if (validRequest.error) {
      return res
        .status(400)
        .json({ status: "fail", message: validRequest.error.message });
    }
    const campaign = await models.campaign.create(req.body);
    res.status(200).json({ campaign, message: 'Created campaign successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.markCampaignAsInvalid = async (req, res) => {
  try {
    const campaign = await models.campaign.findOne({
      id: req.query.campaignId,
    });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    await models.campaign.update(
      { status: "fraud" },
      {
        where: {
          id: req.query.campaignId,
        },
      }
    );
    await models.donation.update(
      { status: "inValid" },
      {
        where: {
          campaignId: req.query.campaignId,
        },
      }
    );
    res.status(200).json(campaign);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await models.campaign.findAndCountAll({
      limit: 10,
      offset: req.query.page * 10,
    });
    console.log(campaigns);
    res.status(200).json(campaigns);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserCampaigns = async (req, res) => {
  try {
    const campaigns = await models.campaign.findAndCountAll({
      limit: 10,
      offset: req.query.page * 10,
      where: { userId: req.query.userId },
    });
    res.status(200).json(campaigns);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
