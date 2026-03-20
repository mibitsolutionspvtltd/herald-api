const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RoleNesting = sequelize.define('RoleNesting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    left_node: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    right_node: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role_type_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'role_type',
        key: 'id'
      }
    },
  }, {
    tableName: 'role_nesting',
    timestamps: false,
    charset: 'latin1',
    collate: 'latin1_swedish_ci'
  });

  RoleNesting.associate = (models) => {
    RoleNesting.belongsTo(models.RoleType, {
      foreignKey: 'role_type_id',
      as: 'roleType'
    });
  };

  return RoleNesting;
};
