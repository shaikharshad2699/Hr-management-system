const fs = require('fs').promises;
const path = require('path');
const mailService = require('../services/mailService');

const getTemplatePath = (templateType) =>
  path.join(__dirname, '../templates', `${templateType}.html`);

exports.getTemplateContent = async (req, res) => {
  try {
    const { templateType } = req.params;
    const content = await fs.readFile(getTemplatePath(templateType), 'utf-8');

    res.status(200).json({
      success: true,
      data: {
        templateType,
        content,
      },
    });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Template not found' });
  }
};

exports.updateTemplateContent = async (req, res) => {
  try {
    const { templateType } = req.params;
    const { content } = req.body;

    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Template content is required' });
    }

    await fs.writeFile(getTemplatePath(templateType), content, 'utf-8');

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendTemplateEmail = async (req, res) => {
  try {
    const { templateType } = req.params;
    const { to, subject, html, text } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email, subject, and html are required',
      });
    }

    await mailService.sendTemplateEmail({ to, subject, html, text });

    res.status(200).json({
      success: true,
      message: `${templateType} email sent successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.previewTemplate = async (req, res) => {
  try {
    const { templateType } = req.params;
    const Employee = require('../models/Employee');
    const pdfService = require('../services/pdfService');
    
    // Get first employee or create sample data
    let employee = await Employee.findOne().populate('department');
    
    if (!employee) {
      // Create sample employee data for preview
      employee = {
        firstName: 'John',
        lastName: 'Doe',
        designation: 'Senior Developer',
        department: { name: 'Engineering' },
        joiningDate: new Date(),
        salary: 450000,
      };
    }
    
    const renderedHtml = await pdfService.renderDocument(templateType, employee);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderedHtml);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
