# Environment Variables Setup for UnitNode

This document provides instructions for setting up the necessary environment variables for the UnitNode application.

## Creating the .env File

Create a file named `.env` in the root directory of the project. This file is already included in `.gitignore` to ensure it's not committed to the repository.

## Required Environment Variables

Add the following variables to your `.env` file:

```
# Infobip API credentials
INFOBIP_API_KEY=your_infobip_api_key
# Make sure to include the full URL with https:// protocol
INFOBIP_BASE_URL=https://api.infobip.com
INFOBIP_FROM_EMAIL=your-email@example.com

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Database (required)
DATABASE_URL=postgresql://username:password@localhost:5432/unitnode

# Email verification
EMAIL_VERIFICATION_TOKEN_SECRET=your_email_verification_token_secret
SITE_URL=http://localhost:3000

  # Google OAuth
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  # Optional: set explicitly; otherwise falls back to `${SITE_URL}/api/auth/google/callback`
  # GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## Setting Up Infobip

1. Sign up for an Infobip account at [https://www.infobip.com](https://www.infobip.com)
2. Navigate to the API Keys section in your Infobip dashboard
3. Create a new API key with permissions for sending emails
4. Copy the API key and paste it as the value for `INFOBIP_API_KEY` in your `.env` file
5. For `INFOBIP_BASE_URL`, use the base URL provided in your Infobip dashboard. It should include the protocol (https://) and might look like `https://xxxxx.api.infobip.com` where xxxxx is specific to your account
6. Set `INFOBIP_FROM_EMAIL` to the email address you want to use as the sender (this must be a verified sender email in your Infobip account)

## Generating Secret Keys

For security, you should generate random strings for the secret keys:

1. For `NEXTAUTH_SECRET` and `EMAIL_VERIFICATION_TOKEN_SECRET`, you can generate a secure random string using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Copy the output and use it as the value for these variables in your `.env` file

## Local Development

For local development:

1. Set `NEXTAUTH_URL` to `http://localhost:3000` (or your local development URL)
2. Set `SITE_URL` to the same value as `NEXTAUTH_URL`

## Production Deployment

When deploying to production:

1. Update `NEXTAUTH_URL` and `SITE_URL` to your production domain
2. Ensure all other environment variables are properly set in your production environment
3. Never commit the `.env` file to version control

## Database Setup

The application uses PostgreSQL for the database. Follow these steps to set up your database:

1. Install PostgreSQL if you haven't already: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. Create a new database for the application:

```bash
createdb unitnode
```

3. Update the `DATABASE_URL` in your `.env` file with your PostgreSQL connection string:

```
DATABASE_URL=postgresql://username:password@localhost:5432/unitnode
```

Replace `username` and `password` with your PostgreSQL credentials.

4. Run the Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

5. If you need to reset your database during development:

```bash
npx prisma migrate reset
```

## Verifying Setup

After setting up your environment variables and database, restart your development server for the changes to take effect.

```bash
npm run dev
```

The email verification flow should now work correctly with your Infobip account and user accounts will be properly stored in the database.