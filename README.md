# Campus Complaint Portal

## 1. Project Overview

The Campus Complaint Portal is a web-based application designed to help students submit campus-related complaints and track their progress. Administrators can view complaints and update their status.

## 2. Objectives

- Provide students with an online complaint submission system.
- Allow students to track complaint status.
- Help administrators manage and review complaints.
- Support image uploads for complaints, where applicable.
- Improve communication between students and campus administration.

## 3. Technologies Used

**Frontend**
- React
- Vite
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Authentication and File Uploads**
- JSON Web Tokens (JWT)
- bcryptjs
- Multer

## 4. Main Modules

### Student Module
- Student registration and login
- Submit complaints
- View submitted complaints
- Track complaint status
- Upload complaint images

### Administrator Module
- View submitted complaints
- Review complaint details
- Update complaint status
- Manage complaint priorities and departments, where implemented

## 5. Project Structure

- `client/` — React frontend
- `backend/server/` — Express backend
- `backend/server/src/models/` — Database models
- `backend/server/src/routes/` — API routes
- `backend/server/src/middleware/` — Middleware
- `backend/server/uploads/` — Uploaded files, depending on the configured upload directory

## 6. Installation and Execution

### Start the Backend

Open a terminal:

```bash
cd backend/server
npm install
npm run dev
```

The backend normally runs at:

`http://localhost:5000`

### Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## 7. Database Configuration

Configure the MongoDB connection and JWT secret in the backend `.env` file.

Do not commit `.env` or publish passwords, database credentials, or JWT secrets.

## 8. Testing

The following workflows were tested manually:

- Student registration
- Student login and logout
- Complaint submission
- Student complaint listing
- Admin complaint listing
- Complaint status updates
- Student verification of updated status
- Complaint image upload

## 9. Conclusion

The Campus Complaint Portal provides a centralized platform for submitting and tracking campus complaints. It helps students communicate issues and enables administrators to monitor complaint progress through a web application.