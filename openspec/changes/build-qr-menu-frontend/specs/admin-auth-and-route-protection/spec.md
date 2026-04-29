# Capability: Admin Authentication And Route Protection

## Overview

Provide authentication flows and route protection for the admin panel using the backend JWT contract.

## Requirements

### Requirement: Login stores access state for future admin requests

The system SHALL authenticate admin users through the backend login endpoint and persist the returned auth state for later requests.

#### Scenario: Successful login

- **WHEN** a user submits valid credentials on the login page
- **THEN** the frontend calls `POST /auth/login`
- **AND** stores the returned `accessToken`, `refreshToken`, and user payload in local storage and Pinia state
- **AND** redirects the user to the admin area

#### Scenario: Failed login

- **WHEN** a user submits invalid credentials
- **THEN** the frontend surfaces a visible error message
- **AND** does not store auth state

### Requirement: Authenticated requests include the access token

The system SHALL attach the stored access token to protected API requests.

#### Scenario: Protected request is made after login

- **WHEN** an authenticated admin page loads protected data
- **THEN** the Axios client sends an `Authorization: Bearer <token>` header with the request

### Requirement: Admin routes are protected

The system SHALL prevent unauthenticated users from entering admin routes.

#### Scenario: Unauthenticated user opens an admin route

- **WHEN** a visitor navigates directly to an admin URL without a valid stored token
- **THEN** the router redirects the visitor to the login page

#### Scenario: Authenticated user opens an admin route

- **WHEN** a user with a stored token opens an admin URL
- **THEN** the router allows access to the requested admin page

### Requirement: Registration supports the backend's two-step flow

The system SHALL support restaurant-owner registration using the backend's current two-step contract.

#### Scenario: New owner registers a restaurant account

- **WHEN** a user completes the registration form
- **THEN** the frontend first calls `POST /auth/register`
- **AND** then calls `POST /auth/register/restaurant` with the returned `userId` and restaurant data
- **AND** shows a clear failure state if either step fails
