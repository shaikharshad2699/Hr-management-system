# Testing Instructions

## Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```bash
mongod
```

## Step 2: Start Server
```bash
cd server
npm run dev
```

## Step 3: Test Health Check
```bash
curl http://localhost:5000/api/health
```

## Step 4: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@company.com",
    "password": "password123",
    "role": "admin"
  }'
```

## Step 5: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123"
  }'
```

Copy the token from response.

## Step 6: Create Department
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Engineering",
    "description": "Software Development Team"
  }'
```

## Step 7: Create Employee
```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fullName": "John Doe",
    "email": "john@company.com",
    "phone": "1234567890",
    "department": "DEPARTMENT_ID_FROM_STEP_6",
    "designation": "Software Engineer",
    "joiningDate": "2024-01-01",
    "salary": 50000,
    "status": "active"
  }'
```

## Alternative: Use Postman
Import `postman_collection.json` into Postman for easier testing.
