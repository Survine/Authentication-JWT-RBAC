Collecting workspace information# Authentication-JWT

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## 📋 Overview

**Authentication-JWT** is a production-ready Node.js authentication system built with Express.js and PostgreSQL. It implements secure user authentication using JSON Web Tokens (JWT), role-based access control (RBAC), and cryptographic password hashing. This project serves as a robust foundation for building secure web applications with user management capabilities.

## ✨ Features

- **🔐 JWT Authentication:** Industry-standard token-based authentication with configurable expiration
- **👥 Role-Based Access Control (RBAC):** Fine-grained permissions with USER and ADMIN roles
- **🔒 Secure Password Storage:** HMAC-SHA256 password hashing with unique salts per user
- **🗄️ PostgreSQL Database:** Type-safe database operations using Drizzle ORM
- **🚀 RESTful API:** Clean, modular Express.js routes with middleware composition
- **🐳 Docker Support:** Containerized PostgreSQL setup for easy development
- **⚡ Hot Reload:** Development server with automatic restart on file changes
- **📦 Type Safety:** Full TypeScript type definitions for enhanced developer experience

## 🏗️ Architecture

```
Authentication-JWT/
├── db/
│   ├── index.js          # Database connection configuration
│   └── schema.js         # Drizzle ORM schema definitions
├── middlewares/
│   └── auth.middleware.js # Authentication & authorization middleware
├── routes/
│   ├── admin.routes.js   # Admin-only endpoints
│   └── user.routes.js    # User management endpoints
├── drizzle/              # Database migrations (auto-generated)
├── index.js              # Application entry point
├── drizzle.config.js     # Drizzle ORM configuration
├── docker-compose.yml    # PostgreSQL container setup
└── package.json          # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [pnpm](https://pnpm.io/) 10.22.0 or higher (or npm/yarn)
- [Docker](https://www.docker.com/) and Docker Compose (for local database)
- PostgreSQL 18.1+ (if not using Docker)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Authentication-JWT
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables:**
   Create a .env file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://postgres:admin@localhost:5432/session-auth
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   
   # Server
   PORT=8000
   ```

4. **Start PostgreSQL database:**
   ```bash
   docker-compose up -d
   ```

5. **Push database schema:**
   ```bash
   pnpm db:push
   ```

6. **Start the development server:**
   ```bash
   pnpm dev
   ```

The server will start on `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### 🏠 Health Check

**GET /** - Server health check
```http
GET /
```

**Response:**
```json
{
  "status": "Server is up and running"
}
```

---

#### 👤 User Endpoints

**POST /user/signup** - Register a new user

**Request:**
```http
POST /user/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "userID": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Errors:**
- `400` - User already exists

---

**POST /user/login** - Authenticate user

**Request:**
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `404` - User not found
- `400` - Incorrect password

---

**GET /user** - Get current user profile *(Requires Authentication)*

**Request:**
```http
GET /user
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Errors:**
- `401` - Not authenticated

---

**PATCH /user** - Update user profile *(Requires Authentication)*

**Request:**
```http
PATCH /user
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

**Response (200):**
```json
{
  "status": "success"
}
```

---

#### 👨‍💼 Admin Endpoints

**GET /admin/users** - List all users *(Requires ADMIN role)*

**Request:**
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "Users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

**Errors:**
- `401` - Not authenticated or insufficient permissions

## 🔧 Database Schema

### Users Table

| Column   | Type          | Constraints                    |
|----------|---------------|--------------------------------|
| id       | UUID          | Primary Key, Default Random    |
| name     | VARCHAR(255)  | NOT NULL                       |
| email    | VARCHAR(255)  | NOT NULL, UNIQUE               |
| role     | ENUM          | NOT NULL, Default: 'USER'      |
| password | TEXT          | NOT NULL                       |
| salt     | TEXT          | NOT NULL                       |

**Roles:** `USER`, `ADMIN`

## 🛠️ Development

### Available Scripts

```bash
# Start production server
pnpm start

# Start development server with hot reload
pnpm dev

# Push database schema changes
pnpm db:push

# Open Drizzle Studio (Database GUI)
pnpm db:studio
```

### Project Structure Details

- **index.js** - Express application setup and middleware configuration
- **index.js** - Drizzle database connection using the `DATABASE_URL` from .env
- **schema.js** - Database schema definition using [`usersTable`](db/schema.js) and [`userRoleEnum`](db/schema.js)
- **auth.middleware.js** - Contains:
  - `authenticationMiddleware` - Extracts and verifies JWT
  - `ensureAuthenticated` - Protects routes requiring login
  - `restrictToRole` - Enforces role-based access
- **user.routes.js** - User authentication and profile management
- **admin.routes.js** - Admin-only user management endpoints

## 🔐 Security Features

1. **Password Security:**
   - Passwords are hashed using HMAC-SHA256
   - Unique 256-byte salt per user
   - Passwords never stored in plain text

2. **JWT Security:**
   - Tokens expire after 1 minute (configurable in routes/user.routes.js)
   - Secret key stored in environment variables
   - Signed tokens prevent tampering

3. **Request Validation:**
   - Email uniqueness enforced at database level
   - Authorization header validation
   - Role-based middleware protection

## 🐳 Docker Setup

The docker-compose.yml provides a PostgreSQL 18.1 container:

```bash
# Start database
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop database
docker-compose down

# Remove database and volumes
docker-compose down -v
```

## 🧪 Testing

### Manual Testing with cURL

**Signup:**
```bash
curl -X POST http://localhost:8000/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl http://localhost:8000/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Configuration

### Environment Variables

| Variable      | Description                          | Default           |
|---------------|--------------------------------------|-------------------|
| DATABASE_URL  | PostgreSQL connection string         | Required          |
| JWT_SECRET    | Secret key for signing JWT tokens    | Required          |
| PORT          | Server port                          | 8000              |

### JWT Token Expiration

Modify the expiration time in user.routes.js:
```javascript
const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : '1h'}) // Change from '1m'
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License. See the package.json file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error:**
- Ensure PostgreSQL is running: `docker-compose ps`
- Verify DATABASE_URL in .env
- Check Docker container logs: `docker-compose logs postgres`

**JWT Token Expired:**
- Tokens expire after 1 minute by default
- Re-login to get a new token
- Increase expiration time in production

**Port Already in Use:**
- Change PORT in .env
- Or stop the process using port 8000

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the Readme.md file

## 🗺️ Roadmap

- [ ] Refresh token implementation
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Rate limiting
- [ ] Input validation with Zod
- [ ] Automated testing suite
- [ ] API documentation with Swagger
- [ ] Logging with Winston

---

**Made with ❤️ using Node.js, Express, and PostgreSQL**