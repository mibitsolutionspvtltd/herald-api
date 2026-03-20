module.exports = (sequelize, DataTypes) => {
  const AdvertisementFormat = sequelize.define(
    'AdvertisementFormat',
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
      width: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: 'advertisement_format',
      timestamps: false,
    }
  );

  AdvertisementFormat.associate = (models) => {
    if (models.Advertisement) {
      AdvertisementFormat.hasMany(models.Advertisement, {
        foreignKey: 'format_id',
        as: 'advertisements',
      });
    }
  };

  return AdvertisementFormat;
};
