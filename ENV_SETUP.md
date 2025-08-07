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

# Database (if needed)
DATABASE_URL=your_database_connection_string

# Email verification
EMAIL_VERIFICATION_TOKEN_SECRET=your_email_verification_token_secret
SITE_URL=http://localhost:3000
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

## Verifying Setup

After setting up your environment variables, restart your development server for the changes to take effect.

```bash
npm run dev
```

The email verification flow should now work correctly with your Infobip account.