# User Management API

A robust and well-structured CRUD API for user management using Bun, Elysia, Drizzle ORM (SQLite), and authentication.

## Features

- 🔐 User authentication (signup/login)
- 👤 User management (CRUD operations)
- 🔍 Role-based access control (admin vs regular users)
- 📝 User plans (Free, Basic, Premium)
- 🛢️ SQLite database with Drizzle ORM
- 🧩 Modular architecture
- 📏 ESLint and Prettier for code quality

## Project Structure

The application follows a clean, modular architecture separating concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Repositories**: Manage database interactions
- **Middleware**: Provide cross-cutting concerns (auth, error handling)
- **Routes**: Define API endpoints
- **Utils**: Shared utilities and helpers

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine

### Installation

1. Clone the repository:

```bash
# Clone the repository
git clone https://github.com/yourusername/workflows.git
cd workflows
```

2. Install dependencies:

```bash
bun install
```

3. Initialize the database (creates tables based on schema):

```bash
bun run db:generate
bun run db:migrate
```

4. Start the development server:

```bash
bun run dev
```

The API will be available at http://localhost:3000.

## API Endpoints

### Authentication

- **POST /api/auth/signup**: Register a new user
- **POST /api/auth/login**: User login

### User Management (Admin Only)

- **POST /api/admin/users**: Create a new user
- **GET /api/admin/users**: Get all users
- **GET /api/admin/users/:id**: Get a specific user
- **PUT /api/admin/users/:id**: Update a specific user
- **DELETE /api/admin/users/:id**: Delete a specific user

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
JWT_SECRET=your-secret-key
```

## Development

### Linting

```bash
# Check code style
bun run lint

# Fix code style issues
bun run lint:fix

# Format code with Prettier
bun run format
```