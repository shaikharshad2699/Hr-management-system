# HR Document Generator - Backend API

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Server runs on: `http://localhost:5000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Employees (Protected)
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments (Protected)
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `GET /api/departments/:id` - Get department by ID
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Documents (Protected)
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create document
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

## 🔐 Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 📦 Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 🗂️ Folder Structure

```
src/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── models/         # Mongoose models
├── routes/         # API routes
├── middlewares/    # Auth middleware
├── services/       # Business logic
├── utils/          # Helper functions
├── app.js          # Express app
└── server.js       # Entry point
```
