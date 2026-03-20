module.exports = (sequelize, DataTypes) => {
  // Model matches actual production database schema
  // Only includes columns that exist in the database table
  const Universities = sequelize.define('Universities', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    established_on: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(288),
      allowNull: false
    },
    students_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numbers_of_faculty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    zip_code: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'universities',
    timestamps: false
  });

  Universities.associate = (models) => {
    // Universities have courses - this relationship exists via courses.university_id
    Universities.hasMany(models.Courses, {
      foreignKey: 'university_id',
      as: 'courses'
    });
    
    // Note: Status and country relationships exist via the courses table
    // not directly on universities. Use courses to access these relationships.
  };

  return Universities;
};
