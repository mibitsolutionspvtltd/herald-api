module.exports = (sequelize, DataTypes) => {
  const DocumentCategory = sequelize.define('DocumentCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'document_category',
    timestamps: false
  });

  DocumentCategory.associate = (models) => {
    DocumentCategory.hasMany(models.DocumentType, {
      foreignKey: 'document_category_id',
      as: 'documentTypes'
    });
  };

  return DocumentCategory;
};
