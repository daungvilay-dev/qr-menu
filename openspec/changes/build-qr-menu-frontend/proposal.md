# Proposal: Build QR Menu Frontend

## Why

The project has a backend for restaurant, menu, variant, addon, branch, and QR code management, but the frontend repository is currently empty. The product needs a Vue 3 application that serves two distinct user journeys:

- an authenticated admin panel for restaurant owners and managers
- a public QR-driven menu experience for customers

The frontend should be beginner-friendly to extend, but structured well enough to support production use, including authentication, reusable API access, mobile-responsive public screens, and stable admin CRUD flows.

## What Changes

Build a new Vue 3 frontend application with Vite, Pinia, Vue Router, Tailwind CSS, Ant Design Vue, and Axios.

The application will:

- provide login and registration flows for restaurant owners
- provide protected admin routes with a shared admin layout
- support CRUD-style admin management for categories, menus, variants, addons, item-addon links, and QR codes
- support a public mobile-first customer menu loaded from QR scan data
- calculate item totals from base price, selected variant delta, and selected addons
- align with the backend API that exists today rather than an assumed slug-based public endpoint

## Capabilities

### 1. Admin Authentication And Route Protection

The frontend must authenticate admins with JWT, persist auth state locally, attach tokens to API requests, and protect admin routes through router guards.

### 2. Admin Menu Management Workspace

The admin area must let restaurant users manage categories, menu items, variants, addons, and item-addon relationships using reusable tables, forms, and dialogs.

### 3. Admin QR Code Management

The admin area must let restaurant users create and view QR codes tied to restaurant and optional branch/table context.

### 4. Public QR Menu Experience

Customers must be able to open a QR-driven public menu without login, browse categories and menu items, choose variants and addons, and see live total pricing.

## Impact

### Affected Code

- new Vue application scaffold in the frontend repository
- routing, state, UI components, layouts, and API integration layers
- no backend changes are required for the first implementation

### Backend Contract Alignment

The frontend will target the current backend endpoints and models, including:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/register/restaurant`
- `GET/POST/PUT/DELETE /menu-categories`
- `GET/POST/PUT/DELETE /menus`
- `GET/POST/PUT/DELETE /variants`
- `GET/POST/PUT/DELETE /addons`
- `GET/POST/PUT/DELETE /item-addons`
- `GET/POST/PUT/DELETE /qrcodes`
- `GET /qrcodes/scan/:uuid`

This means the public customer flow will be QR UUID based, and registration will be a two-step orchestration in the frontend.
