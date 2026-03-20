module.exports = (sequelize, DataTypes) => {
  const EnquiryStatusType = sequelize.define(
    'EnquiryStatusType',
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
      tableName: 'enquiry_status_type',
      timestamps: false,
    }
  );

  return EnquiryStatusType;
};
