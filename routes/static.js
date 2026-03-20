const express = require('express');
const router = express.Router();
const staticController = require('../controllers/staticController');
const contactController = require('../controllers/contactController');

// Static routes
router.get('/services', staticController.getServices);
router.get('/country-with-phone-code', staticController.getCountryCodes);
router.get('/states', staticController.getStates);
router.post('/device/register', staticController.registerDevice);
router.post('/notification', staticController.sendNotification);
router.get('/pin', staticController.getPinCodeDetails);
router.post('/contact', contactController.submitContact);
router.get('/search-metadata', staticController.getSearchMetadata);

// Article-related static data
router.get('/article-labels', staticController.getArticleLabels);
router.get('/active-statuses', staticController.getActiveStatuses);

module.exports = router;
