const dayjs = require("dayjs");
const cron = require("node-cron");
const { models } = require("../sequelize");

const secondly = () => {
  cron.schedule("*/2 * * * * *", async () => {
    try {
      const campaigns = await models.campaign.findAll();
      Promise.all(
        campaigns
          .filter((campaign) => {
            return dayjs(campaign.dataValues.expirationDate).isAfter(dayjs());
          })
          .map(async (campaign) => {
            await models.campaign.update(
              { state: "expired" },
              { id: campaign.dataValues.id }
            );
          })
      );
    } catch (error) {
      console.log(error);
    }
  });
};

const mainJob = () => {
  secondly();
};

module.exports = () => mainJob();
