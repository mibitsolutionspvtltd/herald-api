module.exports = (sequelize, DataTypes) => {
  const RobotTagsType = sequelize.define(
    'RobotTagsType',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'robot_tags_type',
      timestamps: false,
    }
  );

  return RobotTagsType;
};
