const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/v1/login - Autenticação de usuário
router.post('/login', authController.login);

module.exports = router;
