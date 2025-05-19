# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
<<<<<<< HEAD
=======

# BookStore Application

This is a full-stack application for an online bookstore with Stripe payment integration.

## Project Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:

   **Backend (.env in root directory):**
   ```
   # Server Configuration
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookstore
   JWT_SECRET=your_jwt_secret_key

   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend (.env.local in root directory):**
   ```
   VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
   ```

4. Run the development server:
   ```
   # Start backend server
   npm run server

   # Start frontend development server
   npm run dev
   ```

## Stripe Integration

This application uses Stripe for payment processing. To set up Stripe:

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Configure the environment variables as specified above
4. For local development, use the Stripe CLI to forward webhook events:
   ```
   stripe listen --forward-to http://localhost:5000/api/stripe/webhook
   ```
5. The webhook secret will be displayed when you run the above command. Add it to your .env file.

## Features

- Browse books
- Add books to cart and wishlist
- Secure checkout with Stripe
- Order history
- User authentication
>>>>>>> 2c68bbb (Clean repository state with Stripe integration and logout modal)
