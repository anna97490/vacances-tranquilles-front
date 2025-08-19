# Changelog - Vacances Tranquilles Web App

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]
- 

---
## [0.7.1] - 2025-08-19

### Fixed
- **Front-End Security:** Improved the `AuthGuard` logic to better handle redirections for authenticated users.
- **Interceptor Robustness:** Strengthened error handling in the `HttpInterceptor` to better manage expired or invalid tokens.

## [0.7.0] - 2025-08-18
### Added
- **Review and Rating Page:** Implemented the interface for users to submit a review after a service is completed.
- **Display Reviews:** Reviews and ratings are now visible on provider profiles.

## [0.6.0] - 2025-08-15
### Added
- **Messaging Interface:** Created pages to list conversations and display real-time messages.

## [0.5.0] - 2025-08-11
### Added
- **Payment Integration:** Added the user flow for payment via the Stripe checkout.
- **Success Page:** Created a confirmation page after a successful payment.

## [0.4.0] - 2025-08-08
### Added
- **Booking Flow:** Created the service search page with filters.
- **Provider Display:** Developed the component to display the list of available providers.
- **Bookings Page:** Implemented the page listing the user's booking history.

## [0.3.0] - 2025-08-05
### Added
- **Profile Management:** Created the profile page where users can view their information.

### Changed
- **Security:** Implemented an `HttpInterceptor` to automatically add the JWT to all API requests.

## [0.2.0] - 2025-08-01
### Added
- **User Dashboard:** Created the dashboard and initial pages accessible after login.
- **Access Control:** Set up `AuthGuards` to protect the new application routes.

### Changed
- **Accessibility:** Improved forms with ARIA announcements for errors.

## [0.1.0] - 2025-07-28
### Added
- **Initial Project Setup:** Set up the Angular project structure.
- **Authentication:** Implementation of the registration and login forms.
- **Base Components:** Created the main components (Header, Footer, Homepage).
- **Static Pages:** Added Terms of Service pages (CGU/CGV).
- **CI/CD:** Configured the continuous integration and deployment pipeline on Render.

[Unreleased]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.7.1...HEAD
[0.7.1]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/anna97490/vacances-tranquilles-front/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/anna97490/vacances-tranquilles-front/releases/tag/v0.1.0