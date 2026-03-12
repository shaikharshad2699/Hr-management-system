const User = require('../models/User');

const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME || 'Admin User',
  email: (process.env.DEFAULT_ADMIN_EMAIL || 'admin@company.com').trim().toLowerCase(),
  password: process.env.DEFAULT_ADMIN_PASSWORD || 'password123',
  role: process.env.DEFAULT_ADMIN_ROLE || 'admin',
};

const ensureDefaultAdmin = async ({ syncPassword = false } = {}) => {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN.email });

  if (existingAdmin && !syncPassword) {
    return;
  }

  if (!existingAdmin) {
    await User.create(DEFAULT_ADMIN);
    console.log(`Default admin created: ${DEFAULT_ADMIN.email}`);
    return;
  }

  existingAdmin.name = DEFAULT_ADMIN.name;
  existingAdmin.role = DEFAULT_ADMIN.role;
  existingAdmin.password = DEFAULT_ADMIN.password;
  await existingAdmin.save();
  console.log(`Default admin credentials refreshed: ${DEFAULT_ADMIN.email}`);
};

ensureDefaultAdmin.DEFAULT_ADMIN = DEFAULT_ADMIN;

module.exports = ensureDefaultAdmin;
