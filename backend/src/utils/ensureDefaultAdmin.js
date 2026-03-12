const User = require('../models/User');

const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME || 'Admin User',
  email: (process.env.DEFAULT_ADMIN_EMAIL || 'admin@company.com').trim().toLowerCase(),
  password: process.env.DEFAULT_ADMIN_PASSWORD || 'password123',
  role: process.env.DEFAULT_ADMIN_ROLE || 'admin',
};

const ensureDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

  if (existingAdmin) {
    return;
  }

  await User.create(DEFAULT_ADMIN);
  console.log(`Default admin created: ${DEFAULT_ADMIN.email}`);
};

module.exports = ensureDefaultAdmin;
