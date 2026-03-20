module.exports = (sequelize, DataTypes) => {
  const HeroContent = sequelize.define('HeroContent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    subtitle: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    link_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    heading: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category',
        key: 'id'
      }
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    image_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document',
        key: 'id'
      }
    },
    active_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'active_status',
        key: 'id'
      }
    }
  }, {
    tableName: 'hero_content',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  HeroContent.associate = (models) => {
    HeroContent.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    HeroContent.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    HeroContent.belongsTo(models.Document, {
      foreignKey: 'image_id',
      as: 'image'
    });
    HeroContent.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'status'
    });
  };

  return HeroContent;
};
