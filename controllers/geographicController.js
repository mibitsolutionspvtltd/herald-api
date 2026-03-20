const { 
  Country, 
  StateProvince, 
  City, 
  Address,
  Pin,
  PinCodes,
  States,
  CountryCodes,
  AddressType,
  ActiveStatus
} = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// COUNTRY MANAGEMENT

// Get all countries
exports.getAllCountries = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: countries } = await Country.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.status(200).json({
      success: true,
      data: {
        countries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalCountries: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get country by ID with states
exports.getCountryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const country = await Country.findByPk(id, {
      include: [
        {
          model: StateProvince,
          as: 'states',
          attributes: ['id', 'name', 'code']
        }
      ]
    });

    if (!country) {
      return next(new ErrorResponse('Country not found', 404));
    }

    res.status(200).json({
      success: true,
      data: country
    });
  } catch (error) {
    next(error);
  }
};

// Create new country
exports.createCountry = async (req, res, next) => {
  try {
    const {
      name,
      code,
      dialCode,
      currency,
      currencySymbol,
      flag,
      isActive = true
    } = req.body;

    // Check if country already exists
    const existingCountry = await Country.findOne({ 
      where: { 
        [Op.or]: [
          { code: code },
          { name: name }
        ]
      }
    });

    if (existingCountry) {
      return next(new ErrorResponse('Country with this name or code already exists', 400));
    }

    const country = await Country.create({
      name,
      code,
      dial_code: dialCode,
      currency,
      currency_symbol: currencySymbol,
      flag,
      active_status_id: isActive ? 1 : 2,
      created_on: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Country created successfully',
      data: country
    });
  } catch (error) {
    next(error);
  }
};

// Update country
exports.updateCountry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      dialCode,
      currency,
      currencySymbol,
      flag,
      isActive
    } = req.body;

    const country = await Country.findByPk(id);
    if (!country) {
      return next(new ErrorResponse('Country not found', 404));
    }

    await country.update({
      name: name || country.name,
      code: code || country.code,
      dial_code: dialCode || country.dial_code,
      currency: currency || country.currency,
      currency_symbol: currencySymbol || country.currency_symbol,
      flag: flag || country.flag,
      active_status_id: isActive !== undefined ? (isActive ? 1 : 2) : country.active_status_id,
      last_updated_on: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Country updated successfully',
      data: country
    });
  } catch (error) {
    next(error);
  }
};

// STATE/PROVINCE MANAGEMENT

// Get all states
exports.getAllStates = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search,
      countryId,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    try {
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { code: { [Op.like]: `%${search}%` } }
        ];
      }

      if (countryId) {
        whereClause.country_id = countryId;
      }

      const { count, rows: states } = await StateProvince.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Country,
            as: 'country',
            attributes: ['id', 'name', 'code']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      res.status(200).json({
        success: true,
        data: {
          states,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalStates: count,
            hasNext: page * limit < count,
            hasPrev: page > 1
          }
        }
      });
    } catch (modelError) {
      // Fallback to raw query
      console.error('StateProvince model error, using raw query:', modelError.message);
      const { sequelize } = require('../config/database');
      
      let query = 'SELECT * FROM state_province WHERE 1=1';
      const replacements = [];
      
      if (countryId) {
        query += ' AND country_id = ?';
        replacements.push(countryId);
      }
      
      if (search) {
        query += ' AND (name LIKE ? OR code LIKE ?)';
        replacements.push(`%${search}%`, `%${search}%`);
      }
      
      query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
      replacements.push(parseInt(limit), parseInt(offset));
      
      const [states] = await sequelize.query(query, { replacements });
      const [countResult] = await sequelize.query('SELECT COUNT(*) as count FROM state_province', {});
      const count = countResult[0].count;
      
      res.status(200).json({
        success: true,
        data: states,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalStates: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get states by country
exports.getStatesByCountry = async (req, res, next) => {
  try {
    const { countryId } = req.params;

    const states = await StateProvince.findAll({
      where: { country_id: countryId },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: states
    });
  } catch (error) {
    next(error);
  }
};

// Create new state
exports.createState = async (req, res, next) => {
  try {
    const {
      name,
      code,
      countryId,
      isActive = true
    } = req.body;

    // Verify country exists
    const country = await Country.findByPk(countryId);
    if (!country) {
      return next(new ErrorResponse('Country not found', 404));
    }

    // Check if state already exists in this country
    const existingState = await StateProvince.findOne({ 
      where: { 
        name: name,
        country_id: countryId
      }
    });

    if (existingState) {
      return next(new ErrorResponse('State with this name already exists in this country', 400));
    }

    const state = await StateProvince.create({
      name,
      code,
      country_id: countryId,
      active_status_id: isActive ? 1 : 2,
      created_on: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'State created successfully',
      data: state
    });
  } catch (error) {
    next(error);
  }
};

// CITY MANAGEMENT

// Get all cities
exports.getAllCities = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search,
      stateId,
      countryId,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    try {
      const whereClause = {};

      if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
      }

      if (stateId) {
        whereClause.state_id = stateId;
      }

      if (countryId) {
        whereClause.country_id = countryId;
      }

      const { count, rows: cities } = await City.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: StateProvince,
            as: 'state',
            attributes: ['id', 'name', 'code'],
            include: [
              {
                model: Country,
                as: 'country',
                attributes: ['id', 'name', 'code']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      res.status(200).json({
        success: true,
        data: {
          cities,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalCities: count,
            hasNext: page * limit < count,
            hasPrev: page > 1
          }
        }
      });
    } catch (modelError) {
      // Fallback to raw query
      console.error('City model error, using raw query:', modelError.message);
      const { sequelize } = require('../config/database');
      
      let query = 'SELECT id, city_name as name, state_province_id as state_id FROM city WHERE 1=1';
      const replacements = [];
      
      if (stateId) {
        query += ' AND state_province_id = ?';
        replacements.push(stateId);
      }
      
      if (countryId) {
        // City table doesn't have country_id, skip this filter
        console.log('City table does not have country_id column');
      }
      
      if (search) {
        query += ' AND city_name LIKE ?';
        replacements.push(`%${search}%`);
      }
      
      query += ` ORDER BY city_name ${sortOrder} LIMIT ? OFFSET ?`;
      replacements.push(parseInt(limit), parseInt(offset));
      
      const [cities] = await sequelize.query(query, { replacements });
      const [countResult] = await sequelize.query('SELECT COUNT(*) as count FROM city', {});
      const count = countResult[0].count;
      
      res.status(200).json({
        success: true,
        data: cities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalCities: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get cities by state
exports.getCitiesByState = async (req, res, next) => {
  try {
    const { stateId } = req.params;

    try {
      const cities = await City.findAll({
        where: { state_id: stateId },
        order: [['name', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: cities
      });
    } catch (modelError) {
      // Fallback to raw query
      console.error('City model error, using raw query:', modelError.message);
      const { sequelize } = require('../config/database');
      
      const [cities] = await sequelize.query(
        'SELECT id, city_name as name, state_province_id as state_id FROM city WHERE state_province_id = ? ORDER BY city_name ASC',
        { replacements: [stateId] }
      );
      
      res.status(200).json({
        success: true,
        data: cities
      });
    }
  } catch (error) {
    next(error);
  }
};

// Create new city
exports.createCity = async (req, res, next) => {
  try {
    const {
      name,
      stateId,
      countryId,
      latitude,
      longitude
    } = req.body;

    // Verify state exists
    const state = await StateProvince.findByPk(stateId);
    if (!state) {
      return next(new ErrorResponse('State not found', 404));
    }

    const city = await City.create({
      name,
      state_id: stateId,
      country_id: countryId,
      latitude,
      longitude
    });

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: city
    });
  } catch (error) {
    next(error);
  }
};

// ADDRESS MANAGEMENT

// Get all addresses
exports.getAllAddresses = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      cityId,
      stateId,
      typeId
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { city: { [Op.like]: `%${search}%` } },
        { zip_code: { [Op.like]: `%${search}%` } }
      ];
    }

    if (typeId) {
      whereClause.type_id = typeId;
    }

    const { count, rows: addresses } = await Address.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: StateProvince,
          as: 'stateProvince',
          attributes: ['id', 'name', 'code'],
          include: [
            {
              model: Country,
              as: 'country',
              attributes: ['id', 'name', 'code']
            }
          ]
        },
        {
          model: AddressType,
          as: 'type',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_on', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        addresses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalAddresses: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new address
exports.createAddress = async (req, res, next) => {
  try {
    const {
      city,
      zipCode,
      stateProvinceId,
      typeId
    } = req.body;

    const address = await Address.create({
      city,
      zip_code: zipCode,
      state_province_id: stateProvinceId,
      type_id: typeId,
      status_id: 1, // Active
      created_on: new Date()
    });

    const newAddress = await Address.findByPk(address.id, {
      include: [
        {
          model: StateProvince,
          as: 'stateProvince',
          attributes: ['id', 'name', 'code']
        },
        {
          model: AddressType,
          as: 'type',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: newAddress
    });
  } catch (error) {
    next(error);
  }
};

// PIN CODE MANAGEMENT

// Get all pin codes
exports.getAllPinCodes = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search,
      stateId,
      cityId
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { pin_code: { [Op.like]: `%${search}%` } },
        { area: { [Op.like]: `%${search}%` } }
      ];
    }

    if (stateId) {
      whereClause.state_id = stateId;
    }

    if (cityId) {
      whereClause.city_id = cityId;
    }

    const { count, rows: pinCodes } = await PinCodes.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: States,
          as: 'state',
          attributes: ['id', 'name']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['pin_code', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        pinCodes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalPinCodes: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search pin code
exports.searchPinCode = async (req, res, next) => {
  try {
    const { pinCode } = req.params;

    const pinCodeData = await PinCodes.findOne({
      where: { pin_code: pinCode },
      include: [
        {
          model: States,
          as: 'state',
          attributes: ['id', 'name']
        },
        {
          model: City,
          as: 'city',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!pinCodeData) {
      return next(new ErrorResponse('Pin code not found', 404));
    }

    res.status(200).json({
      success: true,
      data: pinCodeData
    });
  } catch (error) {
    next(error);
  }
};

// Get geographic statistics
exports.getGeographicStats = async (req, res, next) => {
  try {
    const totalCountries = await Country.count();
    const activeCountries = await Country.count({ where: { active_status_id: 1 } });
    
    const totalStates = await StateProvince.count();
    const activeStates = await StateProvince.count({ where: { active_status_id: 1 } });
    
    const totalCities = await City.count();
    const totalAddresses = await Address.count();
    const totalPinCodes = await PinCodes.count();

    // Top countries by states
    const countriesWithMostStates = await Country.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: StateProvince,
          as: 'states',
          attributes: []
        }
      ],
      group: ['Country.id'],
      order: [[{ model: StateProvince, as: 'states' }, 'id', 'DESC']],
      limit: 5
    });

    res.status(200).json({
      success: true,
      data: {
        totalCountries,
        activeCountries,
        totalStates,
        activeStates,
        totalCities,
        totalAddresses,
        totalPinCodes,
        countriesWithMostStates
      }
    });
  } catch (error) {
    next(error);
  }
};
