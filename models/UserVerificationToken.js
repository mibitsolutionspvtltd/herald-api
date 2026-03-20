const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserVerificationToken = sequelize.define('UserVerificationToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM('email_verification', 'password_reset', 'login_otp'),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
    },
    is_used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    used_at: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user_verification_tokens',
    timestamps: false,
  });

  UserVerificationToken.associate = (models) => {
    // User association removed - using operator-based system
    // Can be updated to use Operator model if needed:
    // UserVerificationToken.belongsTo(models.Operator, {
    //   foreignKey: 'user_id', // or operator_id if column is renamed
    //   as: 'operator'
    // });
  };

  return UserVerificationToken;
};
