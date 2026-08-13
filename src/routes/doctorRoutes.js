const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/rbacMiddleware');

// POST /api/v1/medicos - Cadastro de médico (somente ADMIN)
router.post('/', authMiddleware, authorize('ADMIN'), doctorController.register);

// GET /api/v1/medicos - Listar todos os médicos (autenticado)
router.get('/', authMiddleware, doctorController.listAll);

module.exports = router;
