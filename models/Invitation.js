const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invitation = sequelize.define('Invitation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    identification_no: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isd_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    phone_no: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    business_phone_no: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    address_line1: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    address_line2: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    state_province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'state_province',
        key: 'id'
      }
    },
    postal_zip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    address_country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    file_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    invitation_token: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resend_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expires_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
        key: 'id'
      }
    },
    accepted_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    activation_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'merchant_plan_type',
        key: 'id'
      }
    },
    permission: {
      type: DataTypes.STRING(9000),
      allowNull: true,
    },
    bank_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    referral_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    mobile_number_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    partner_contact_number: {
      type: DataTypes.STRING(15),
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
    parent_partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'partner',
        key: 'id'
      }
    },
    invited_by_operator: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    consumer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consumer',
        key: 'id'
      }
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'partner',
        key: 'id'
      }
    },
    advisor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'advisor',
        key: 'id'
      }
    },
    checksum: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    crm_invitation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    document_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    occupation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'gender',
        key: 'id'
      }
    },
  }, {
    tableName: 'invitation',
    timestamps: false,
    charset: 'latin1',
    collate: 'latin1_swedish_ci'
  });

  Invitation.associate = (models) => {
    Invitation.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    Invitation.belongsTo(models.Country, {
      foreignKey: 'address_country_id',
      as: 'addressCountry'
    });
    Invitation.belongsTo(models.StateProvince, {
      foreignKey: 'state_province_id',
      as: 'stateProvince'
    });
    Invitation.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status'
    });
    Invitation.belongsTo(models.Gender, {
      foreignKey: 'gender_id',
      as: 'gender'
    });
    Invitation.belongsTo(models.RoleType, {
      foreignKey: 'role_type_id',
      as: 'roleType'
    });
    Invitation.belongsTo(models.Partner, {
      foreignKey: 'parent_partner_id',
      as: 'parentPartner'
    });
    Invitation.belongsTo(models.Operator, {
      foreignKey: 'invited_by_operator',
      as: 'invitedByOperator'
    });
    Invitation.belongsTo(models.Consumer, {
      foreignKey: 'consumer_id',
      as: 'consumer'
    });
    Invitation.belongsTo(models.Partner, {
      foreignKey: 'partner_id',
      as: 'partner'
    });
    Invitation.belongsTo(models.Advisor, {
      foreignKey: 'advisor_id',
      as: 'advisor'
    });
  };

  return Invitation;
};
