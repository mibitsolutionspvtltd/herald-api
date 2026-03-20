const express = require('express');
const router = express.Router();
const {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  getAllStates,
  getStatesByCountry,
  createState,
  getAllCities,
  getCitiesByState,
  createCity,
  getAllAddresses,
  createAddress,
  getAllPinCodes,
  searchPinCode,
  getGeographicStats
} = require('../controllers/geographicController');

// Middleware for authentication
const { authenticateToken, checkPermission } = require('../middleware/auth');

// Country Management Routes
router.get('/countries', getAllCountries);
router.get('/countries/stats', authenticateToken, checkPermission('VIEW_ANALYTICS'), getGeographicStats);
router.get('/countries/:id', getCountryById);
router.post('/countries', authenticateToken, checkPermission('SYSTEM_SETTINGS'), createCountry);
router.put('/countries/:id', authenticateToken, checkPermission('SYSTEM_SETTINGS'), updateCountry);

// State/Province Management Routes
router.get('/states', getAllStates);
router.get('/countries/:countryId/states', getStatesByCountry);
router.post('/states', authenticateToken, checkPermission('SYSTEM_SETTINGS'), createState);

// City Management Routes
router.get('/cities', getAllCities);
router.get('/states/:stateId/cities', getCitiesByState);
router.post('/cities', authenticateToken, checkPermission('SYSTEM_SETTINGS'), createCity);

// Address Management Routes
router.get('/addresses', authenticateToken, checkPermission('VIEW_USER'), getAllAddresses);
router.post('/addresses', authenticateToken, createAddress);

// Pin Code Management Routes
router.get('/pin-codes', getAllPinCodes);
router.get('/pin-codes/:pinCode', searchPinCode);

module.exports = router;
