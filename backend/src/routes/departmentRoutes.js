const express = require('express');
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAllDepartments)
  .post(createDepartment);

router.route('/:id')
  .get(getDepartmentById)
  .put(updateDepartment)
  .delete(deleteDepartment);

module.exports = router;
