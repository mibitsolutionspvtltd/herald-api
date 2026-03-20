module.exports = (sequelize, DataTypes) => {
  const Contacts = sequelize.define('Contacts', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: 'general'
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'spam'),
      defaultValue: 'pending'
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal'
    },
    source: {
      type: DataTypes.STRING(100),
      defaultValue: 'website'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    assigned_to: {
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
    }
  }, {
    tableName: 'contacts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Contacts;
};
