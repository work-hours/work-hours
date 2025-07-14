# GitHub Integration Setup Guide

This guide will walk you through the process of setting up GitHub OAuth credentials for the WorkHours application.

## Prerequisites

- A GitHub account
- Access to the WorkHours application codebase
- Basic understanding of OAuth authentication

## Step 1: Create a GitHub OAuth App

1. Log in to your GitHub account
2. Navigate to your account settings by clicking on your profile picture in the top-right corner and selecting "Settings"
3. In the left sidebar, click on "Developer settings" (at the bottom)
4. Select "OAuth Apps" from the left menu
5. Click the "New OAuth App" button

## Step 2: Register Your OAuth Application

Fill in the following information:

- **Application name**: WorkHours (or your preferred name)
- **Homepage URL**: Your application's homepage URL (e.g., `http://localhost:8000` for local development)
- **Application description**: (Optional) A brief description of your application
- **Authorization callback URL**: This must match your application's callback URL. For local development, use `http://localhost:8000/auth/github/callback`

Click "Register application" to create your OAuth app.

## Step 3: Get Your Client ID and Client Secret

After registering your application, you'll be taken to the app's settings page where you can find:

- **Client ID**: A public identifier for your app
- **Client Secret**: A private key that should be kept secure

Click the "Generate a new client secret" button if you need to create a new secret.

## Step 4: Configure Your Environment Variables

Add the following variables to your `.env` file:

```
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_REDIRECT_URI="${APP_URL}/auth/github/callback"
```

Replace `your_client_id_here` and `your_client_secret_here` with the values from Step 3.

## Step 5: Required Permissions (Scopes)

The WorkHours application requires the following GitHub scopes:

- `repo`: Full control of private repositories
- `read:org`: Read organization information
- `user:email`: Access user email addresses

These scopes are automatically requested when a user connects their GitHub account through the application.

## Step 6: Testing the Integration

1. Start your application
2. Navigate to a project page
3. Click on the "Connect GitHub Account" button
4. You should be redirected to GitHub to authorize the application
5. After authorization, you should be redirected back to your application
6. You should now be able to see and select your GitHub repositories

## Troubleshooting

### Common Issues:

1. **Invalid redirect URI**: Ensure that the callback URL in your GitHub OAuth app settings exactly matches the one in your application.

2. **Authentication fails**: Check that your client ID and client secret are correctly set in your `.env` file.

3. **Cannot see private repositories**: Ensure that the user has granted the `repo` scope during authorization.

4. **Cannot see organization repositories**: Ensure that the user has granted the `read:org` scope and has access to the organization repositories.

## Security Considerations

- Never commit your client secret to version control
- Use environment variables to store sensitive information
- Regularly rotate your client secret for enhanced security

## Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)
- [Understanding OAuth Scopes](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)
