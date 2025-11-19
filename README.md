# Project Name: Task Management App

## Overview

This is a full-stack task management application built with React (frontend) and Node.js (backend).  
It features user authentication (register/login/logout using JWT), a dashboard to manage tasks (CRUD operations), and a dark mode toggle in the UI.

---

## Features

- User registration and login with JWT authentication.
- Protected dashboard route showing user profile and task list.
- Create, read, update, and delete tasks.
- Dark mode / light mode toggle using Tailwind CSS.
- API testing enabled via Postman collection.

---

## Technologies Used

- Frontend: React, Tailwind CSS, React Router, React Hook Form.
- Backend: Node.js, Express.js, MongoDB (or your DB of choice).
- Authentication: JWT tokens.
- API Testing: Postman.

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB running locally or remote DB URI

---

### Installation

#### Backend

cd backend
npm install
npm run dev


#### Frontend

cd frontend
npm install
npm start


---

### Environment Variables

Create `.env` files for backend and frontend with:

Backend
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend
REACT_APP_API_URL=http://localhost:5000/api


---


---

## API Documentation & Testing

### Postman Collection

You can import the API collection from [`docs/tasks-api.postman_collection.json`](./docs/tasks-api.postman_collection.json) into Postman to easily interact with the API endpoints.

### Available Endpoints

| Method | Endpoint          | Description                     | Auth Required |
| ------ | ----------------- | ------------------------------ | ------------- |
| POST   | /api/auth/signup  | Register a new user             | No            |
| POST   | /api/auth/login   | Login and get JWT token         | No            |
| GET    | /api/auth/profile | Get user profile info           | Yes           |
| GET    | /api/tasks        | List user tasks                 | Yes           |
| POST   | /api/tasks        | Create new task                 | Yes           |
| PUT    | /api/tasks/:id    | Update task by ID               | Yes           |
| DELETE | /api/tasks/:id    | Delete task by ID               | Yes           |

---

## Frontend Usage Notes

- Upon login, the JWT token is stored and attached to protected requests.
- Dashboard supports add/edit/delete tasks with real-time UI updates.
- Dark mode toggle switches UI theming using Tailwind CSS dark variant.

---

## Deployment & Scalability

### Scaling Frontend-Backend Integration for Production

- **Environment Separation:** Use environment variables and configuration files to separate development, staging, and production environments.
- **API Versioning:** Version your API endpoints (e.g., `/api/v1/tasks`) to allow backward compatible changes.
- **Security:** Use HTTPS/TLS everywhere, securely store JWT secrets, implement CORS policies, and sanitize user inputs.
- **Load Balancing:** Deploy backend with load balancers to distribute traffic across multiple instances for scalability and redundancy.
- **Cloud Hosting:** Host frontend on CDN-powered static hosting (like Vercel or Netlify), backend on scalable PaaS like Heroku, Render, or AWS Elastic Beanstalk.
- **Rate Limiting & Throttling:** Protect APIs from abuse with rate limiting middleware.
- **Logging & Monitoring:** Use centralized logging and monitoring tools (e.g., LogRocket, Sentry, Grafana).
- **CI/CD Pipelines:** Automate testing and deployment via pipelines like GitHub Actions or Jenkins.
- **Caching:** Utilize HTTP caching headers and database caches to reduce load and improve responsiveness.

---

## License

Specify your license here (MIT, GPL, etc.).

---

## Contact

Gautam Rawat - gautamrawat52002@gmail.com


