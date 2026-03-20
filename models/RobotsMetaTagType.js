module.exports = (sequelize, DataTypes) => {
    const RobotsMetaTagType = sequelize.define(
        'RobotsMetaTagType',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            created_on: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'robots_meta_tag_type',
            timestamps: false,
        }
    );

    return RobotsMetaTagType;
};
