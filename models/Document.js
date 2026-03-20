module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    uid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_on: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    last_updated_on: {
      type: DataTypes.DATE(6),
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
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    document_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document_type',
        key: 'id'
      }
    },
    last_updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    }
  }, {
    tableName: 'document',
    timestamps: false
  });

  Document.associate = (models) => {
    Document.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status'
    });
    Document.belongsTo(models.DocumentType, {
      foreignKey: 'document_type_id',
      as: 'documentType'
    });
    Document.hasMany(models.Article, {
      foreignKey: 'document_id',
      as: 'articles'
    });
    Document.hasMany(models.Category, {
      foreignKey: 'cover_image_id',
      as: 'categories'
    });
    Document.hasMany(models.CarouselItems, {
      foreignKey: 'cover_image_id',
      as: 'carouselItems'
    });
    Document.hasMany(models.HeroContent, {
      foreignKey: 'image_id',
      as: 'heroContent'
    });
    Document.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Document.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater'
    });
    Document.hasOne(models.DocumentMetadata, {
      foreignKey: 'document_id',
      as: 'metadata'
    });
  };

  return Document;
};
