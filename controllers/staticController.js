const { Service, CountryCodes, States, PinCodes, SearchMetadata, Country } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// Get all services
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: services.map(service => ({
        id: service.id.toString(),
        title: service.name,
        description: service.description,
        iconUrl: service.icon_url,
        noOfExperts: 0,
        solvedProblemsCount: 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get country codes
exports.getCountryCodes = async (req, res, next) => {
  try {
    const countries = await CountryCodes.findAll({
      order: [['country_name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: countries.map(country => ({
        id: country.id.toString(),
        shortName: country.country_code,
        name: country.country_name,
        code: country.phone_code,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get states
exports.getStates = async (req, res, next) => {
  try {
    const { country } = req.query;

    const whereClause = {};
    if (country) {
      whereClause.country_id = country;
    }

    const states = await States.findAll({
      where: whereClause,
      order: [['state_name', 'ASC']],
      limit: 50 // Limit results if no country filter
    });

    res.status(200).json({
      success: true,
      data: states.map(state => state.state_name),
    });
  } catch (error) {
    next(error);
  }
};

// Get pin code details
exports.getPinCodeDetails = async (req, res, next) => {
  try {
    const { filter } = req.query;

    if (!filter) {
      return next(new ErrorResponse('Filter parameter is required', 400));
    }

    const pinDetails = await PinCodes.findOne({
      where: { pin_code: filter },
    });

    if (!pinDetails) {
      return next(new ErrorResponse('Pin code not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        pinCode: pinDetails.pin_code,
        pinId: pinDetails.id.toString(),
        cityId: pinDetails.id.toString(),
        cityName: pinDetails.city,
        stateId: pinDetails.id.toString(),
        stateName: pinDetails.state,
        countryName: pinDetails.country,
        countryId: pinDetails.id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Register device
exports.registerDevice = async (req, res, next) => {
  try {
    const { fcmToken, deviceId, platform, model, manufacturer, latitude, longitude } = req.body;

    // In a real application, you would save device details to a database
    // For now, we'll just return success

    res.status(201).json({
      success: true,
      message: 'Device registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Send notification
exports.sendNotification = async (req, res, next) => {
  try {
    const { type, recipient, title, topic, body, data } = req.body;

    // In a real application, you would send the notification using FCM or other services
    // For now, we'll just return success

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get search metadata
exports.getSearchMetadata = async (req, res, next) => {
  try {
    const { 'x-api-country': countryId } = req.headers;

    const searchMetadata = await SearchMetadata.findOne({
      where: { country_id: countryId || 105 },
      include: [{
        model: Country,
        as: 'country'
      }]
    });

    if (!searchMetadata) {
      return next(new ErrorResponse('Search metadata not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        title: searchMetadata.title,
        subtitle: searchMetadata.subtitle,
        suggestions: [
          "Study Abroad",
          "University",
          "Technology",
          "Personal Development",
          "Education",
          "Health & Fitness"
        ],
      },
    });
  } catch (error) {
    next(error);
  }
};


// Get article labels
exports.getArticleLabels = async (req, res, next) => {
  try {
    const { ArticleLabel } = require('../models');
    const labels = await ArticleLabel.findAll({
      order: [['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: labels.map(label => ({
        id: label.id,
        name: label.name,
        description: label.description || ''
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get active statuses
exports.getActiveStatuses = async (req, res, next) => {
  try {
    const { ActiveStatus } = require('../models');
    const statuses = await ActiveStatus.findAll({
      order: [['id', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: statuses.map(status => ({
        id: status.id,
        name: status.name,
        description: status.description || ''
      })),
    });
  } catch (error) {
    next(error);
  }
};
