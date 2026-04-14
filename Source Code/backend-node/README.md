# Matgarco Backend API

REST API for Matgarco - Multi-tenant E-commerce Platform

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **File Upload:** Cloudinary
- **Email:** Nodemailer

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## API Documentation

See [PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md#5-api-endpoints) for complete API documentation.

## Project Structure

```
src/
├── server.ts              # Entry point
├── app.ts                 # Express app configuration
├── config/                # Configuration files
├── models/                # Mongoose models
├── routes/                # API routes
├── controllers/           # Request handlers
├── middleware/            # Express middleware
├── services/              # Business logic
├── utils/                 # Utility functions
└── types/                 # TypeScript types
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

MIT
