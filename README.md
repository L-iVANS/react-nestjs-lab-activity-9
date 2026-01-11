# Activity 9 - E-Commerce Application

A full-stack e-commerce application built with React frontend and NestJS backend.

---

## 1. Requirements

- **Node.js v18+** (LTS recommended)
- **npm v9+** (comes with Node LTS)
- **MySQL** (or compatible) running locally
- **A terminal** (PowerShell / cmd / Git Bash on Windows)

```bash
cd activity9-ecommerce-backend
npm install
```

---

## 2. Configure Database & Environment

The backend uses TypeORM with MySQL. Make sure you have a database created, for example:

- **host**: localhost
- **port**: 3306
- **database**: lab_activity_db (or any name you prefer)
- **user**: e.g. root
- **password**: your_password

Then configure your connection in the TypeORM config / `.env` file according to how the project is set up (usually something like):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=stephcurry_30
DB_NAME=lab_activity_db
JWT_SECRET=your_jwt_secret
```

Adjust the actual variable names to match your `typeorm.config.ts` and auth configuration.

The API server will run by default on http://localhost:3000.

---

## 3. Backend Setup (NestJS)

Backend folder: `activity9-ecommerce-backend`

```bash
cd activity9-ecommerce-backend
npm install
```

### 3.1 Create Admin Account

From the project root, run the admin creation script:

```bash
node create-admin.js
```

This will:
- Hash the password using bcrypt
- Insert the admin user into the database
- Output the credentials for login

**Default Admin Credentials:**
- **Email**: admin@email.com
- **Password**: Admin_321

### 3.2 Run the Backend

From inside the backend folder:

```bash
npm run start:dev
```

The NestJS server will start on http://localhost:3000.

---

## 4. Frontend Setup (React App)

Frontend folder: `activity9-ecommerce-frontend`

```bash
cd activity9-ecommerce-frontend
npm install
```

### 4.1 Configure API URL

The frontend uses an environment variable `REACT_APP_API_URL` to talk to the backend.

Create a `.env` file inside `activity9-ecommerce-frontend` (same level as `package.json`) with:

```env
REACT_APP_API_URL=http://localhost:3000
```

If this file is missing, the frontend falls back to `http://localhost:3000` by default.

### 4.2 Run the Frontend

From the project root:

```bash
npm run start:frontend
```

Or inside the frontend folder:

```bash
cd activity9-ecommerce-frontend
npm start
```

The React app will start on http://localhost:3000 or http://localhost:3001 depending on your setup (Create React App will ask to use another port if 3000 is busy).

---

## 5. Run Frontend & Backend Together

In the root `Activity 9` folder there are helper scripts in `package.json`:

```json
{
  "scripts": {
    "start:frontend": "npm start --prefix activity9-ecommerce-frontend",
    "start:backend": "npm run start:dev --prefix activity9-ecommerce-backend",
    "dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  }
}
```

First install the root dependencies (for `concurrently`):

```bash
npm install
```

Then start both servers with one command:

```bash
npm run dev
```

- Backend runs on http://localhost:3000
- Frontend runs on the next free port (usually http://localhost:3001)

---

## 6. How the App Works (High-Level Description)

### Backend (NestJS)

- **REST API endpoints** for:
  - Auth: login, signup, current user (JWT)
  - Products: list products, get product, create/update/delete (admin only)
  - Orders: create order, list user orders, get order details
  - Payments: create payment links, check payment status
  - Users: list users, get user profile

- **Uses TypeORM** entities for: User, Product, Order, Payment
- **Uses JWT authentication** for protected routes
- **Uses Role-based access control** (admin, user roles)
- **API documentation** available at http://localhost:3000/api/docs (Swagger UI)

### Frontend (React + Tailwind CSS)

- **React single-page app** with the main store/dashboard screen
- **Uses React Router** for client-side navigation
- **Uses Axios** for REST API calls
- **Uses Context API** for state management (Auth, Theme)
- **Uses React Query** for data fetching/caching

- **UI Features:**
  - Product listing and search
  - Product filtering and sorting
  - Shopping cart functionality
  - Order history and order details
  - User login/signup (auth module)
  - User account management
  - Responsive design with Tailwind CSS

---

## 7. Troubleshooting

- **MySQL Connection Error**: Ensure MySQL is running and credentials in `.env` are correct
- **Port 3000 Already in Use**: Change the port in your backend config or kill the process using port 3000
- **Frontend Not Loading**: Check that `REACT_APP_API_URL` is set correctly and backend is running
- **JWT Errors on Login**: Ensure the JWT_SECRET env variable matches in both frontend and backend configs
