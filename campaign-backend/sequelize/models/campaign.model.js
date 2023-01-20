const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('campaign', {
        id: {
            allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            allowNull: false,
			type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        goalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'expired', 'fraud', 'successful'),
            defaultValue: 'active'
        }
    });
};