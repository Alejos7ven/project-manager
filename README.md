# ProjectPulse — Digital Agency Client & Project Management System

A full-stack client and project management application tailored for digital agencies. Built with a decoupled architecture featuring a **Laravel 11 REST API** with **Laravel Sanctum** token-based authentication and a **React 18 + Vite** Single Page Application styled with **Tailwind CSS**.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Architecture & Standards](#architecture--standards)
- [Local Installation Guide](#local-installation-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Laravel 11)](#backend-setup-laravel-11)
  - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [Demo Credentials](#demo-credentials)
- [API Endpoints Reference](#api-endpoints-reference)
- [Environment Variables](#environment-variables)
- [Design Decisions & Edge Case Handling](#design-decisions--edge-case-handling)
- [Productivity Disclosure](#productivity-disclosure)

---

## Tech Stack

### Backend
- **Framework:** Laravel 11.x (Strict REST API mode, no Blade views)
- **Language & Runtime:** PHP 8.2+ / PHP 8.4
- **Database:** MySQL 8.x
- **Authentication:** Laravel Sanctum (Personal Access Tokens)
- **Architecture:** Controller-Service-Resource pattern with dedicated FormRequests

### Frontend
- **Framework:** React 18.x
- **Build Tool:** Vite 6.x / 8.x
- **Styling:** Tailwind CSS (utility-first, responsive mobile-first)
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios (custom client instance with Bearer interceptor & 401 redirection)
- **Icons:** Lucide React

---

## Key Features

1. **Authentication & Session Security:**
   - Secure token-based authentication via Laravel Sanctum.
   - Frontend `AuthContext` with automatic token verification and session persistence.
   - Protected client-side routes with redirect to `/login` upon 401 unauthorized responses.
   - Quick "Auto-fill Demo Credentials" button on login for evaluator convenience.

2. **Dashboard Analytics:**
   - 4 High-impact StatCards: Total Clients, Active Projects, Completed Projects, Pending Projects.
   - Recent projects overview with associated clients, statuses, and deadlines.
   - Recent client activity with project counters.

3. **Client Management (CRUD):**
   - Full Create, Read, Update, Delete with database-backed relational integrity.
   - Live search (filtering across client name, email, and company).
   - Filter by status (`active`, `inactive`, `lead`).
   - Paginated table view for desktop and responsive cards for mobile viewports.
   - Client deletion safety: blocks deletion with **HTTP 409 Conflict** if the client has associated projects.

4. **Project Management (CRUD):**
   - Full Create, Read, Update, Delete linked to clients.
   - Filter by status (`pending`, `active`, `completed`) and keyword search.
   - Strict date validation ensuring `deadline >= start_date`.
   - Desktop responsive data table and mobile stacked card view.

5. **AI Assistant Integration (Bonus):**
   - Integrated endpoint `POST /api/v1/ai/generate-description`.
   - "Generate with AI" button on the project creation/edit modal.
   - Graceful fallback: If `GEMINI_API_KEY` is not present, returns **HTTP 503** with a clear user alert without breaking or crashing the application.

---

## Architecture & Standards

### Uniform JSON Response Envelope
All API endpoints conform strictly to the standard JSON payload structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Clean Code Practices
- **Thin Controllers:** Controllers delegate validation to FormRequests and business logic to services.
- **FormRequests:** 100% of input validation occurs in `app/Http/Requests/Api/V1/*`.
- **API Resources:** Data transformations managed in `app/Http/Resources/*` ensuring encapsulation.
- **Global Exception Handling:** Configured in `bootstrap/app.php` to intercept all API exceptions (Validation, Authentication, ModelNotFound, HTTP exceptions) and format them into the uniform JSON envelope.

---

## Local Installation Guide

### Prerequisites
- PHP 8.2 or higher
- Composer 2.x
- Node.js 18+ & npm
- MySQL Server 8.0+

---

### Backend Setup (Laravel 11)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Generate application encryption key:
   ```bash
   php artisan key:generate
   ```

5. Configure database in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=project_manager
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password

   # Optional for AI Project Description feature:
   GEMINI_API_KEY=your_gemini_api_key
   ```

6. Create the MySQL database:
   ```sql
   CREATE DATABASE project_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

7. Run database migrations and seed realistic demo data:
   ```bash
   php artisan migrate:fresh --seed
   ```

8. Start the local backend development server:
   ```bash
   php artisan serve --port=8000
   ```
   The API will be accessible at: `http://127.0.0.1:8000/api/v1`

---

### Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` exists with the backend API URL:
   ```bash
   cp .env.example .env
   ```
   Content of `frontend/.env`:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api/v1
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at: `http://localhost:5173`

---

## Demo Credentials

The database seeder pre-populates a verified administrator account along with 10 realistic clients and 18 diverse projects:

| Field | Value |
|---|---|
| **Email** | `admin@example.com` |
| **Password** | `password` |

*(Note: The login page includes a convenient "Auto-fill" button that inputs these credentials with a single click.)*

---

## API Endpoints Reference

All endpoints are versioned under `/api/v1` and return JSON.

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Authenticate user & issue Sanctum Bearer token | No |
| `POST` | `/api/v1/auth/logout` | Revoke current access token | Yes |
| `GET` | `/api/v1/auth/me` | Retrieve authenticated user profile | Yes |

### Dashboard Analytics
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | Aggregated client/project metrics and recent records | Yes |

### Clients CRUD
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/clients` | List clients with search, status filter, & pagination | Yes |
| `POST` | `/api/v1/clients` | Create a new client | Yes |
| `GET` | `/api/v1/clients/{id}` | Retrieve single client with associated projects | Yes |
| `PUT` | `/api/v1/clients/{id}` | Update existing client details | Yes |
| `DELETE` | `/api/v1/clients/{id}` | Delete client (returns 409 if client has projects) | Yes |

### Projects CRUD
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/projects` | List projects with search, status, client filter, & pagination | Yes |
| `POST` | `/api/v1/projects` | Create a new project | Yes |
| `GET` | `/api/v1/projects/{id}` | Retrieve single project with client relation | Yes |
| `PUT` | `/api/v1/projects/{id}` | Update existing project details | Yes |
| `DELETE` | `/api/v1/projects/{id}` | Delete project | Yes |

### AI Description Generator (Bonus)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/ai/generate-description` | Generate project scope and summary via Gemini API | Yes |

---

## Environment Variables

### Backend (`backend/.env`)
```env
APP_NAME=ProjectPulse
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=project_manager
DB_USERNAME=root
DB_PASSWORD=

# Optional: Google Gemini API Key for AI Project Scope generation
GEMINI_API_KEY=
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

---

## Design Decisions & Edge Case Handling

1. **Client Deletion with Existing Projects:**
   - Instead of cascading deletions which would cause silent project loss, deleting a client with existing projects is blocked with **HTTP 409 Conflict**:
     `"Cannot delete client with existing projects. Please reassign or delete projects first."`
   - The frontend catches this status code and presents a clear warning message rather than a generic error.

2. **Date Validation:**
   - `deadline` is validated in FormRequests to ensure it is always greater than or equal to `start_date` (`after_or_equal:start_date`).
   - The frontend also provides client-side pre-validation and renders 422 error messages below the respective input field.

3. **AI Service Resilience:**
   - If `GEMINI_API_KEY` is not present, the endpoint returns **HTTP 503 Service Unavailable** with an explicit notification message.
   - Network failures or API downtime do not compromise project creation, as the description field remains editable manually.

4. **Zero Console Logs & No Secrets:**
   - All debugging artifacts and `console.log` statements are omitted from production code.
   - Sensitive credentials remain strictly inside local `.env` files protected by `.gitignore`.

---

## Productivity Disclosure

This solution was designed and implemented utilizing modern AI pair-programming tooling to rapidly accelerate scaffolding, ensure comprehensive unit/integration test coverage, and uphold strict architectural patterns within the project timeframe.
