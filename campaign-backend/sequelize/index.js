const { Sequelize } = require("sequelize");
const { applyExtraSetup } = require("./extra-setup");

const sequelize = new Sequelize("test", "root", "", {
  host: "localhost",
  dialect: "mysql",
  // pool: {
  //     max: 5,
  //     min: 0,
  //     idle: 10000
  // }
});

sequelize
  .authenticate()
  .then(() => {
    console.log("MYSQL database is connected");
  })
  .catch((err) => {
    console.log("Err :" + err);
  });

const modelsDefiners = [
  require("./models/campaign.model"),
  require("./models/user.model"),
  require('./models/donation.model')
];

for (const modelsDefiner of modelsDefiners) {
  modelsDefiner(sequelize);
}

applyExtraSetup(sequelize);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Syncing again");
  })
  .catch((err) => {
    console.log("Err in syncing: " + err);
  });

module.exports = sequelize;
