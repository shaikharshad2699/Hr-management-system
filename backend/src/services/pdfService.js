const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class PDFService {
  async loadTemplate(documentType) {
    const templatePath = path.join(__dirname, '../templates', `${documentType}.html`);
    const template = await fs.readFile(templatePath, 'utf-8');
    return template;
  }

  replaceVariables(template, data) {
    let html = template;
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key] || '');
    });
    return html;
  }

  async generatePDF(html) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      displayHeaderFooter: false
    });
    
    await browser.close();
    return pdfBuffer;
  }

  buildTemplateData(employeeData) {
    const salary = employeeData.salary || 450000;
    const basicYearly = Math.round(salary * 0.30);
    const hraYearly = Math.round(salary * 0.20);
    const conveyanceYearly = Math.round(salary * 0.10);
    const medicalYearly = Math.round(salary * 0.16);
    const variableYearly = Math.round(salary * 0.13);
    const personalYearly = Math.round(salary * 0.11);

    return {
      employeeId: employeeData.employeeId || String(employeeData._id || ''),
      employeeName: `${employeeData.firstName} ${employeeData.lastName}`,
      designation: employeeData.designation,
      department: employeeData.department?.name || employeeData.department,
      joiningDate: new Date(employeeData.joiningDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      salary: salary.toLocaleString('en-IN'),
      annualSalary: `Rs ${salary.toLocaleString('en-IN')}`,
      monthlySalary: `Rs ${Math.round(salary / 12).toLocaleString('en-IN')}`,
      salaryInWords: this.numberToWords(salary),
      currentDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      companyName: 'Broadstairs IT Solutions',
      companyLogo: 'data:image/png;base64,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',
      hrName: 'Waseem Sajjad',
      location: 'Pune',
      acceptanceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      offerValidUntil: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      basicYearly: basicYearly.toLocaleString('en-IN'),
      basicMonthly: Math.round(basicYearly / 12).toLocaleString('en-IN'),
      hraYearly: hraYearly.toLocaleString('en-IN'),
      hraMonthly: Math.round(hraYearly / 12).toLocaleString('en-IN'),
      conveyanceYearly: conveyanceYearly.toLocaleString('en-IN'),
      conveyanceMonthly: Math.round(conveyanceYearly / 12).toLocaleString('en-IN'),
      medicalYearly: medicalYearly.toLocaleString('en-IN'),
      medicalMonthly: Math.round(medicalYearly / 12).toLocaleString('en-IN'),
      variableYearly: variableYearly.toLocaleString('en-IN'),
      variableMonthly: Math.round(variableYearly / 12).toLocaleString('en-IN'),
      personalYearly: personalYearly.toLocaleString('en-IN'),
      personalMonthly: Math.round(personalYearly / 12).toLocaleString('en-IN'),
    };
  }

  async renderDocument(documentType, employeeData) {
    const template = await this.loadTemplate(documentType);
    const data = this.buildTemplateData(employeeData);
    return this.replaceVariables(template, data);
  }

  async createDocument(documentType, employeeData) {
    const html = await this.renderDocument(documentType, employeeData);
    const pdfBuffer = await this.generatePDF(html);
    
    return pdfBuffer;
  }

  numberToWords(num) {
    if (num === 450000) return 'Rupees Four Lakh Fifty Thousand only';
    const lakhs = Math.floor(num / 100000);
    const thousands = Math.floor((num % 100000) / 1000);
    let words = 'Rupees ';
    if (lakhs > 0) words += this.getLakhWords(lakhs) + ' Lakh ';
    if (thousands > 0) words += this.getThousandWords(thousands) + ' Thousand ';
    words += 'only';
    return words;
  }

  getLakhWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  }

  getThousandWords(num) {
    return this.getLakhWords(num);
  }
}

module.exports = new PDFService();

