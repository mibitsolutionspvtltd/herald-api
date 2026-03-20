const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Party = sequelize.define('Party', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    party_type_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'party_type',
        key: 'id'
      }
    },
    parent_party_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'party',
        key: 'id'
      }
    },
    party_status_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'party_status',
        key: 'id'
      }
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    created_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    activated_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    client_domain: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kyc_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    commercial_registration: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    trade_license: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    business_phone_no: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    ui_theme_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    gateway_id: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
    },
    secret_key: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mode: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    trial_mode_start: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    trial_mode_end: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    type_of_business: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    owner_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    allowed_encryption: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    two_factor_required: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    vertical: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    risk_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_category: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    updated_by_operator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'party',
        key: 'id'
      }
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commercial_registration_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    computer_card_number: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    computer_card_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    trade_license_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    additional_phone: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    super_merchant_name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    super_merchant_id: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    authorized_signatory_qid_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    qid_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    authorized_signatory_qid_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    qid_expiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    enable_qib_payout: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    tableName: 'party',
    timestamps: false,
  });

  Party.associate = (models) => {
    Party.belongsTo(models.PartyType, {
      foreignKey: 'party_type_id',
      as: 'partyType'
    });
    Party.belongsTo(models.PartyStatus, {
      foreignKey: 'party_status_id',
      as: 'partyStatus'
    });
    Party.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    Party.belongsTo(models.Party, {
      foreignKey: 'parent_party_id',
      as: 'parentParty'
    });
    Party.hasMany(models.Party, {
      foreignKey: 'parent_party_id',
      as: 'childParties'
    });
    Party.belongsTo(models.Operator, {
      foreignKey: 'updated_by_operator_id',
      as: 'updatedByOperator'
    });
    Party.belongsTo(models.Party, {
      foreignKey: 'updated_by',
      as: 'updatedByParty'
    });
  };

  return Party;
};
