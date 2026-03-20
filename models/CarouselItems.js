module.exports = (sequelize, DataTypes) => {
  const CarouselItems = sequelize.define('CarouselItems', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    subtitle: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    button_text: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    button_url: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    link_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tag: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
        key: 'id'
      }
    },
    cover_image_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document',
        key: 'id'
      }
    }
  }, {
    tableName: 'carousel_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  CarouselItems.associate = (models) => {
    CarouselItems.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status'
    });
    CarouselItems.belongsTo(models.Document, {
      foreignKey: 'cover_image_id',
      as: 'coverImage'
    });
  };

  return CarouselItems;
};
