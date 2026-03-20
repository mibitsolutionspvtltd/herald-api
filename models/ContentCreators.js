const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContentCreators = sequelize.define('ContentCreators', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    expertise: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.00,
    },
    portfolio_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    social_links: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    avatar_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    hourly_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'USD',
    },
    availability: {
      type: DataTypes.ENUM('available', 'busy', 'unavailable'),
      allowNull: true,
      defaultValue: 'available',
    },
    languages: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'content_creators',
    timestamps: false,
    charset: 'latin1',
    collate: 'latin1_swedish_ci',
    indexes: [
      {
        name: 'idx_expertise',
        fields: [{ name: 'expertise', length: 3072 }]
      },
      {
        name: 'idx_country',
        fields: ['country']
      },
      {
        name: 'idx_city',
        fields: ['city']
      },
      {
        name: 'idx_rating',
        fields: ['rating']
      },
      {
        name: 'idx_experience',
        fields: ['experience_years']
      },
      {
        name: 'idx_verified',
        fields: ['is_verified']
      },
      {
        name: 'idx_active',
        fields: ['is_active']
      }
    ]
  });

  return ContentCreators;
};
