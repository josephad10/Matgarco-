# Matgarco Merchant Dashboard

React SPA for merchants to manage their stores.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Run Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3002`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component
├── pages/                # Page components
├── components/           # Reusable components
├── hooks/                # Custom hooks
├── lib/                  # Utilities & API client
├── store/                # Zustand stores
├── types/                # TypeScript types
└── styles/               # Global styles
```

## Features

- Product management (CRUD)
- Order management
- Customer management
- Analytics dashboard
- Store customization
- AI tools
- Subscription management

## License

MIT
