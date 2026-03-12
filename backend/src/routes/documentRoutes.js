const express = require('express');
const {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  generateDocument,
  streamDocuments,
} = require('../controllers/documentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/stream', streamDocuments);
router.get('/generate/:employeeId/:documentType', generateDocument);

router.route('/')
  .get(getAllDocuments)
  .post(createDocument);

router.route('/:id')
  .get(getDocumentById)
  .put(updateDocument)
  .delete(deleteDocument);

module.exports = router;
