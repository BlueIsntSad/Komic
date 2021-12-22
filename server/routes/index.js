const express = require('express');
const router = express.Router();

// Require controller
const controller = require('../controllers/index');
const {checkAuthenticated} = require('../config/auth');
// GET home page
router.get('/', controller.index)

module.exports = router;