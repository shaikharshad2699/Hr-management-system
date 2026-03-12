# HR Document Generator System

A modern, production-ready HR Document Management System built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Dashboard**: Real-time statistics and analytics
- **Employee Management**: Complete CRUD operations
- **Department Management**: Organize by departments
- **Document Templates**: Pre-built templates (Offer Letter, Experience Letter, Salary Slip, etc.)
- **Document Generation**: Generate documents with employee data
- **Document History**: Track all generated documents
- **Payroll Management**: Salary information management
- **Settings**: Application configuration

## 🛠️ Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router v6** - Routing
- **Redux Toolkit** - State Management
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Axios** - HTTP Client
- **Framer Motion** - Animations
- **Lucide Icons** - Icon Library

## 📁 Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
│   ├── ui/         # Base UI components
│   └── common/     # Common components
├── constants/      # App constants
├── features/       # Redux slices
├── hooks/          # Custom hooks
├── layouts/        # Layout components
├── pages/          # Page components
│   ├── admin/     # Admin pages
│   └── auth/      # Auth pages
├── routes/         # Route configuration
├── services/       # API services
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BroadStairs-documnet
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## 🔐 Demo Credentials

- Email: `admin@company.com`
- Password: `password`

## 📦 Build for Production

```bash
npm run build
```

Build output will be in `dist/` folder.

## 🔌 API Integration

Update the `VITE_API_BASE_URL` in `.env` file.

API services:
- `src/services/employeeService.ts` - Employee operations
- `src/services/documentService.ts` - Document operations

## 📱 Responsive Design

Fully responsive:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔒 Security

- JWT token authentication
- Protected routes
- API interceptors
- Input validation with Zod

## 📄 License

MIT License

---

Built with ❤️ using React + TypeScript + Tailwind CSS
