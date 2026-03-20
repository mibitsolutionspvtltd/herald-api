module.exports = (sequelize, DataTypes) => {
  const Advertisement = sequelize.define(
    'Advertisement',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      slot: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Ad placement slot identifier (e.g., sidebar-top, article-mid, home-banner)',
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Foreign key to advertisement_type table',
      },
      format_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 3,
        comment: 'Foreign key to advertisement_format table',
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      target_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      html_content: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Custom HTML/JS for third-party ad code (e.g., AdSense)',
      },
      adsense_slot_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Higher priority ads shown first',
      },
      impressions: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      clicks: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      target_pages: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of page paths where ad should appear',
      },
      target_categories: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Array of category IDs where ad should appear',
      },
      created_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      last_updated_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'operator', key: 'id' }
      },
      status_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        references: { model: 'active_status', key: 'id' }
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'advertisement',
      timestamps: false,
    }
  );

  Advertisement.associate = (models) => {
    // Association with advertisement_type
    if (models.AdvertisementType) {
      Advertisement.belongsTo(models.AdvertisementType, {
        foreignKey: 'type_id',
        as: 'advertisementType',
      });
    }

    // Association with advertisement_format
    if (models.AdvertisementFormat) {
      Advertisement.belongsTo(models.AdvertisementFormat, {
        foreignKey: 'format_id',
        as: 'advertisementFormat',
      });
    }

    // Association with active_status
    if (models.ActiveStatus) {
      Advertisement.belongsTo(models.ActiveStatus, {
        foreignKey: 'status_id',
        as: 'status',
      });
    }

    // Association with operator (creator)
    if (models.Operator) {
      Advertisement.belongsTo(models.Operator, {
        foreignKey: 'created_by',
        as: 'creator',
      });
    }
  };

  return Advertisement;
};
