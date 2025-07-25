# Work Hours - Time Tracking Application

Work Hours is a modern web application for tracking work hours, managing projects, and monitoring team productivity. It provides an intuitive interface for logging time, managing projects, and generating reports.

## Features

- **Time Tracking**: Log start and end times for your work activities
- **Project Management**: Create and manage projects
- **Team Management**: Add team members and track their time logs
- **Payment Tracking**: Mark time logs as paid for billing purposes
- **Reporting**: Export time logs and project data for reporting
- **AI Assistant**: Chat with AI about your time tracking data using Google Gemini
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **PHP 8.4+**
- **Laravel 12**: PHP web application framework
- **MySQL**: Database for storing application data

### Frontend
- **React 19**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better developer experience
- **Inertia.js**: For building single-page apps with server-side routing
- **TailwindCSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible UI components for React

### Development Tools
- **Vite**: Modern frontend build tool
- **ESLint & Prettier**: Code linting and formatting
- **Laravel Pint**: PHP code style fixer
- **Pest**: PHP testing framework
- **Deployer**: Deployment tool

### AI Integration
- **Google Gemini**: AI model for natural language processing and content generation

## Contributing

We welcome contributions to the Work Hours project! Here's how you can help:

### Reporting Issues

- Use the GitHub issue tracker to report bugs
- Describe the bug or feature request in detail
- Include code examples, screenshots or videos when possible
- Follow the issue template if available

### Development Workflow

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes with descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
6. Push to your branch: `git push origin feature/your-feature-name`
7. Submit a pull request to the main repository

### Pull Request Guidelines

- Fill in the required pull request template
- Include screenshots or videos for UI changes
- Update documentation if needed
- Add tests for new features
- Make sure all tests pass before submitting

### Coding Standards

- Follow the existing code style and conventions
- Use ESLint and Prettier for JavaScript/TypeScript code
- Use Laravel Pint for PHP code
- Write clear, commented, and clean code
- Keep pull requests focused on a single topic

### Development Setup

Follow these steps to set up your development environment:

1. Clone the repository
2. Install PHP dependencies: `composer install`
3. Install JavaScript dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure your database
5. Generate application key: `php artisan key:generate`
6. Run migrations: `php artisan migrate`
7. Start the development server: `php artisan serve`
8. In a separate terminal, start Vite: `npm run dev`

#### AI Integration Setup

To use the AI Assistant feature, you need to configure the Google Gemini API:

1. Get a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the following to your `.env` file:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   VITE_GOOGLE_GEMINI_API_KEY="${GOOGLE_GEMINI_API_KEY}"
   ```

## License

This project is open-sourced software licensed under the MIT license.
