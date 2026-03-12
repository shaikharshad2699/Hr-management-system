const express = require('express');
const {
  getTemplateContent,
  sendTemplateEmail,
  updateTemplateContent,
  previewTemplate,
} = require('../controllers/templateController');

const router = express.Router();

router.get('/preview/:templateType', previewTemplate);
router.post('/send-email/:templateType', sendTemplateEmail);
router.get('/:templateType', getTemplateContent);
router.put('/:templateType', updateTemplateContent);

module.exports = router;
