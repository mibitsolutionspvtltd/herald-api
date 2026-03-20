module.exports = (sequelize, DataTypes) => {
  const PostStatus = sequelize.define('PostStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'post_status',
    timestamps: false
  });

  PostStatus.associate = (models) => {
    // BlogPost association removed - blog functionality deprecated
    // PostStatus.hasMany(models.BlogPost, {
    //   foreignKey: 'post_status_id',
    //   as: 'blogPosts'
    // });
  };

  return PostStatus;
};
