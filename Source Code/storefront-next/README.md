# Matgarco Storefront

Customer-facing storefront for merchant stores.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Run Development Server

```bash
npm run dev
```

The storefront will be available at `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Lint code
- `npm run format` - Format code

## Features

- Product browsing
- Shopping cart
- Checkout
- Order tracking
- Product reviews
- Multiple store templates
- Subdomain routing

## Store Templates

1. **Modern** - Clean, grid-based layout
2. **Minimal** - Simple, fast-loading
3. **Luxury** - Premium brand experience

## License

MIT
