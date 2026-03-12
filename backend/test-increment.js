const fs = require('fs');
const path = require('path');

// Check if increment-letter.html exists
const templatePath = path.join(__dirname, 'src', 'templates', 'increment-letter.html');

console.log('Checking template path:', templatePath);
console.log('File exists:', fs.existsSync(templatePath));

if (fs.existsSync(templatePath)) {
  console.log('✓ Template file found!');
  const content = fs.readFileSync(templatePath, 'utf-8');
  console.log('Template size:', content.length, 'characters');
} else {
  console.log('✗ Template file NOT found!');
  console.log('\nChecking templates directory:');
  const templatesDir = path.join(__dirname, 'src', 'templates');
  if (fs.existsSync(templatesDir)) {
    const files = fs.readdirSync(templatesDir);
    console.log('Available templates:', files);
  }
}
