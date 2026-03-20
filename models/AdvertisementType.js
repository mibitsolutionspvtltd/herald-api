module.exports = (sequelize, DataTypes) => {
  const AdvertisementType = sequelize.define(
    'AdvertisementType',
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
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'advertisement_type',
      timestamps: false,
    }
  );

  AdvertisementType.associate = (models) => {
    if (models.Advertisement) {
      AdvertisementType.hasMany(models.Advertisement, {
        foreignKey: 'type_id',
        as: 'advertisements',
      });
    }
  };

  return AdvertisementType;
};
