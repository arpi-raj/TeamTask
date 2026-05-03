# Team Task Manager

# Index

- [Team Task Manager](#team-task-manager)
- [Index](#index)
- [About](#about)
  - [Techstack](#techstack)
- [How to setup](#how-to-setup)
  - [Clone the repo](#clone-the-repo)
  - [Install dependencies](#install-dependencies)
  - [Create a .env file](#create-a-env-file)
- [Features](#features)
- [Finally run the webapp](#finally-run-the-webapp)
- [License](#license)

# About

Team Task Manager is a full-stack web application that allows teams to seamlessly manage projects, assign tasks, and track their progress with role-based access control.

The project is divided into a robust REST API backend and a responsive, modern frontend dashboard.

## Techstack

- MongoDB
- Express.js
- React.js
- Node.js
- Tailwind CSS

# How to setup

## Clone the repo

Fork and clone the repo

```bash
git clone git@github.com:<YOUR_USERNAME>/TeamTaskManager.git
cd TeamTaskManager
```

## Install dependencies

You will need to install the dependencies for both the frontend and the backend.

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Create a .env file

Create a `.env` file in the `server` folder of the project and add the following variables:

```bash
MONGODB_URL=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET_KEY=YOUR_SECRET_KEY_FOR_JWT
```

Replace the values with your MongoDB Atlas connection string and a secure random string for JWT authentication.

# Features

- **Authentication:** Secure Login and Registration using JWT.
- **Project Management:** Create new workspaces and invite members.
- **Role-Based Access Control:** Project Admins can remove members, create tasks, and delete projects.
- **Task Tracking:** Assign tasks to specific members and track statuses (Pending, In Progress, Completed, Overdue).
- **Responsive UI:** Modern dark-themed glassmorphism interface.

# Finally run the webapp

You need to run both the backend and frontend servers simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The webapp will be running on `http://localhost:5173`.
The backend API will be running on `http://localhost:5000`.

# License

The project is licensed under [MIT](https://choosealicense.com/licenses/mit/)
