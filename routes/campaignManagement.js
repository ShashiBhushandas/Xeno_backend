const express = require('express');

const { addAudseg, addCamp, Audsegs, camps } = require('../controllers/campaignManagementController.js');

const router = express.Router();

router.post('/audience-segments', addAudseg);
router.post('/campaigns', addCamp);
router.get('/audience-segments', Audsegs); // NEW
router.get('/campaigns', camps);  
// router.post('/send-messages ', sendMessage); // NEW

module.exports = router;
