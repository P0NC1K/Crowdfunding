const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('donation', {
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
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        state: {
            type: DataTypes.ENUM('valid', 'invalid'),
            defaultValue: 'valid',
        }
    });
};