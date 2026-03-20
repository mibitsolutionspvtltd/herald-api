const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agent = sequelize.define('Agent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(90),
      allowNull: true,
    },
    middle_name: {
      type: DataTypes.STRING(90),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(90),
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checksum: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    last_updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
  }, {
    tableName: 'agent',
    timestamps: false,
  });

  Agent.associate = (models) => {
    Agent.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Agent.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater'
    });
  };

  return Agent;
};
