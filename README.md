# Custom Tailor Suits - 3DLook Measurement Integration

## Project Overview
A Next.js application for a bespoke suit manufacturing business that integrates with 3DLook's body measurement technology. Customers can get perfectly fitted suits by using their smartphone to capture accurate body measurements through 3DLook's AI-powered solution.

## Features
- **3DLook Integration**: Seamless connection with 3DLook's measurement API
- **Responsive Design**: Tailwind CSS for beautiful, mobile-friendly interfaces
- **Type Safety**: TypeScript for robust development
- **Custom Suit Configurator**: Interactive interface to design your perfect suit
- **Order Tracking**: Customers can view their order status
- **Admin Dashboard**: For business owners to manage orders and customers

## Technologies Used
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- 3DLook Measurement API
- React Hook Form (for forms)

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/Armando284/suit-up-web.git
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server
   ```bash
   pnpm dev
   ```

## Environment Variables
- `NEXT_PUBLIC_API_URL`: API base url.
- `NEXT_PUBLIC_ENV`: Environment for development, staging, or production.

## Production Build
```bash
pnpm build
```

## Deployment
The application is configured for easy deployment on Vercel, Netlify, or other modern hosting platforms.

## License
This project is proprietary software owned by Chule Sithole. All rights reserved.