module.exports = (sequelize, DataTypes) => {
  const DocumentType = sequelize.define('DocumentType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    document_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document_category',
        key: 'id'
      }
    },
    is_verification_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'document_type',
    timestamps: false
  });

  DocumentType.associate = (models) => {
    DocumentType.belongsTo(models.DocumentCategory, {
      foreignKey: 'document_category_id',
      as: 'documentCategory'
    });
    DocumentType.hasMany(models.Document, {
      foreignKey: 'document_type_id',
      as: 'documents'
    });
  };

  return DocumentType;
};
