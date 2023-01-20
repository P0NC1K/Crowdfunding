const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      cryptoWallet: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "user",
      hooks: {
        beforeCreate: async (record, options) => {
          const hashPassword = await bcrypt.hash(record.dataValues.password, 8);
          record.dataValues.password = hashPassword;
        },
        beforeUpdate: async (record, options) => {
            const hashPassword = await bcrypt.hash(record.dataValues.password, 8);
            record.dataValues.password = hashPassword;
        },
      },
    }
  );
};
