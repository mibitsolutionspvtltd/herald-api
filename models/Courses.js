module.exports = (sequelize, DataTypes) => {
  const Courses = sequelize.define('Courses', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD'
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    thumbnail_key: {
      type: DataTypes.STRING(255),
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
    university_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'universities',
        key: 'id'
      }
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_trending: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    enrollment_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
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
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Courses.associate = (models) => {
    Courses.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    Courses.belongsTo(models.Universities, {
      foreignKey: 'university_id',
      as: 'university'
    });
    Courses.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  };

  return Courses;
};
