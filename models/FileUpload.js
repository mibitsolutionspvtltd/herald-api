module.exports = (sequelize, DataTypes) => {
  const FileUpload = sequelize.define('FileUpload', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    file_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    folder: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    entity_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'file_uploads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return FileUpload;
};
