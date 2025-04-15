# BetterAuth with Elysia

A clean implementation of BetterAuth in an Elysia application.

## Features

- 🔐 User authentication with email/password and social providers (Google, GitHub)
- 👤 User profile management
- 📝 User plans (Free, Basic, Premium)
- 🛢️ SQLite database with BetterAuth integration
- 📚 API documentation with Swagger

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine

### Installation

1. Clone the repository and install dependencies:

```bash
bun install
```

2. Set up environment variables:

Create a `.env` file with the following:

```env
PORT=3000
BETTER_AUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

3. Initialize the database:

```bash
# Generate BetterAuth schema and tables
bun run db:better-auth

# Run database migrations
bun run db:migrate

# Setup the database (runs both of the above)
bun run db:setup
```

4. Start the development server:

```bash
bun run dev
```

The API will be available at http://localhost:3000.

## API Endpoints

### Authentication

- **POST /api/auth/sign-up/email**: Register a new user
- **POST /api/auth/sign-in/email**: User login with email/password
- **POST /api/auth/sign-in/google**: Login with Google
- **POST /api/auth/sign-in/github**: Login with GitHub
- **POST /api/auth/sign-out**: Log out
- **GET /api/auth/session**: Get current session
- **POST /api/auth/forget-password**: Request password reset
- **POST /api/auth/reset-password**: Reset password with token
- **GET /api/auth/verify-email**: Verify email address
- **POST /api/auth/send-verification-email**: Send verification email

### User Profile

- **GET /api/profile**: Get user profile
- **PUT /api/profile**: Update user profile
- **PUT /api/profile/password**: Update user password

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