const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentMetadata = sequelize.define('DocumentMetadata', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    content_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    original_file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    other_meta_data: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    stored_file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document',
        key: 'id'
      }
    },
  }, {
    tableName: 'document_metadata',
    timestamps: false,
  });

  DocumentMetadata.associate = (models) => {
    DocumentMetadata.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'document'
    });
  };

  return DocumentMetadata;
};
