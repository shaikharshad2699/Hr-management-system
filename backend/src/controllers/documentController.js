const Document = require('../models/Document');
const Employee = require('../models/Employee');
const pdfService = require('../services/pdfService');
const documentEvents = require('../services/documentEvents');

const ALLOWED_DOCUMENT_TYPES = [
  'offer-letter',
  'appointment-letter',
  'experience-letter',
  'relieving-letter',
  'salary-slip',
  'internship-letter',
  'promotion-letter',
  'warning-letter',
  'increment-letter',
  'joining-letter'
];

const DOCUMENT_POPULATION = { path: 'employeeId', select: 'firstName lastName email employeeId' };

const serializeDocument = async (documentId) => (
  Document.findById(documentId).populate(DOCUMENT_POPULATION)
);

const upsertDocumentHistory = async ({ employeeId, documentType, status = 'generated', fileUrl }) => (
  Document.findOneAndUpdate(
    { employeeId, documentType },
    {
      $set: {
        status,
        ...(fileUrl ? { fileUrl } : {}),
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  )
);

const broadcastDocumentSnapshot = async (eventName, document) => {
  const hydratedDocument = await serializeDocument(document._id);

  if (hydratedDocument) {
    documentEvents.broadcast(eventName, hydratedDocument);
  }
};

exports.generateDocument = async (req, res) => {
  try {
    const { employeeId, documentType } = req.params;

    console.log('Generate Document Request:', { employeeId, documentType });

    if (!ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
      console.error('Invalid document type:', documentType);
      return res.status(400).json({ success: false, message: 'Invalid document type' });
    }

    const employee = await Employee.findById(employeeId).populate('department');
    if (!employee) {
      console.error('Employee not found:', employeeId);
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    console.log('Employee found:', employee.firstName, employee.lastName);
    console.log('Generating PDF...');

    const pdfBuffer = await pdfService.createDocument(documentType, employee);

    console.log('PDF generated successfully, size:', pdfBuffer.length);

    // Upsert history so one employee/document-type pair keeps a single latest row.
    try {
      const document = await upsertDocumentHistory({
        employeeId,
        documentType,
        status: 'generated',
      });
      console.log('Document history upserted:', document._id);
      await broadcastDocumentSnapshot('document:upsert', document);
    } catch (docError) {
      console.warn('Failed to upsert document record:', docError.message);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=${documentType}-${employee.firstName}-${employee.lastName}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate(DOCUMENT_POPULATION)
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: documents.length, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.streamDocuments = async (req, res) => {
  try {
    documentEvents.addClient(res);

    const documents = await Document.find()
      .populate(DOCUMENT_POPULATION)
      .sort({ createdAt: -1 });

    documentEvents.writeEvent(res, 'document:snapshot', documents);

    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 30000);

    req.on('close', () => {
      clearInterval(heartbeat);
      documentEvents.removeClient(res);
    });
  } catch (error) {
    documentEvents.removeClient(res);
    res.end();
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(DOCUMENT_POPULATION);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDocument = async (req, res) => {
  try {
    const document = await upsertDocumentHistory(req.body);
    const hydratedDocument = await serializeDocument(document._id);
    await broadcastDocumentSnapshot('document:upsert', document);
    res.status(201).json({ success: true, data: hydratedDocument ?? document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    const hydratedDocument = await serializeDocument(document._id);
    await broadcastDocumentSnapshot('document:upsert', document);
    res.status(200).json({ success: true, data: hydratedDocument ?? document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    documentEvents.broadcast('document:delete', { id: document._id.toString() });
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
