function applyExtraSetup(sequelize) {
    const {campaign, user, donation} = sequelize.models;
    user.hasMany(campaign);
    campaign.belongsTo(user);
    campaign.hasMany(donation);
    donation.belongsTo(campaign);
}

module.exports = { applyExtraSetup };