# Quiz Management System

A modern web application for managing quizzes, exams and class assignments built with React, TypeScript and Vite.

## Features

- 👥 Role-based access (Admin, Teacher, Student)
- 📚 Class management system
- 📝 Question bank management
- 📋 Exam creation and management
- 🔐 Authentication and authorization
- 🎨 Modern UI with shadcn/ui components

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS for styling
- Shadcn UI component library
- React Router for navigation
- Zustand for state management
- Axios for API calls
- React Hook Form + Zod for form handling

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Java 17+ (for backend)
- MySQL 8.0+ (for backend)

### Installation & Setup
1. **Backend Setup**
```bash
# Clone backend repository
git clone https://github.com/thanhdao86/quize_online/

# Follow backend setup instructions
# Make sure MySQL is running and configured
```
2. **Frontend Setup**
```bash
# Clone this repository
git clone https://github.com/voducthang16/online-quizzes

# Install dependencies
npm install

# Configure API endpoint
# Edit src/api/core.ts:
baseURL: "http://localhost:3334/api/"  # Update with your backend URL
```
3. **Start Development**
```bash
# Start frontend development server
npm run dev
```

## License
MIT License - feel free to use this code for your own projects.