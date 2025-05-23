const express = require('express');
const { requireAuth, restrictToUserType } = require('../middleware/auth');
const { renderDepartmentPage } = require('../controllers/departmentController');

const router = express.Router();

router.get('/', requireAuth, restrictToUserType(['faculty', 'hod']), renderDepartmentPage);

module.exports = router;
