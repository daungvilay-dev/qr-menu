# Design: Build QR Menu Frontend

## Summary

Build a Vue 3 single-page application that serves both the admin panel and the public QR menu within one codebase. The design prioritizes:

- alignment with the current Nest backend contract
- a clear separation between admin and public layouts
- a small number of centralized stores
- reusable API and UI patterns that stay approachable for beginners

## Backend Alignment

The implementation will target the backend that exists in `/Users/daungvilay/coding/courses/qrmenu/qr-menu-backend`.

Important contract decisions:

- use `/menu-categories` rather than `/categories`
- use `/menus` rather than `/menu-items`
- use `/qrcodes/scan/:uuid` for the public customer route
- support the two-step registration flow with `/auth/register` followed by `/auth/register/restaurant`
- treat addons as both standalone entities and separate `/item-addons` relationships
- use `priceDeltaCents` as the variant field name in pricing logic

## Application Structure

The frontend will use the folder structure requested by the user with a few supporting folders added for clarity.

```text
src/
  assets/
  components/
    common/
    menu/
    ui/
  layouts/
    AdminLayout.vue
    PublicLayout.vue
  pages/
    auth/
      Login.vue
      Register.vue
    admin/
      Dashboard.vue
      Categories.vue
      MenuItems.vue
      QRCode.vue
    public/
      Menu.vue
      ItemDetail.vue
  router/
    index.js
  services/
    api.js
  store/
    auth.js
    menu.js
  types/
  utils/
  App.vue
  main.js
```

`types/` and `utils/` are added because the backend contract is non-trivial and benefits from explicit mapping and shared formatting helpers.

## Routing Model

Use two top-level route groups.

```text
/
  public menu route, QR-driven

/auth/*
  login
  register

/admin/*
  dashboard
  categories
  menu-items
  qr-codes
```

Recommended public route:

```text
/scan/:uuid
```

This route maps directly to `GET /qrcodes/scan/:uuid`. It avoids inventing a slug-based frontend contract that the backend does not currently support.

Admin routes will use a router guard that checks local auth state before navigation.

## State Design

### Auth Store

Responsibilities:

- hold `accessToken`, `refreshToken`, and `user`
- hydrate from local storage on startup
- expose `login`, `logout`, and `registerRestaurantOwner` actions
- answer whether the user is authenticated

### Menu Store

Responsibilities:

- hold admin category and menu lists
- hold public menu scan payload
- hold selected public item state
- hold selected variant and addon choices
- expose a derived total for the current public item

For simplicity, one `menu` store can serve both admin and public data in the first version, but public item-selection state should stay clearly separated from admin table state.

## API Layer

Create one Axios instance in `services/api.js`.

Responsibilities:

- set the backend base URL from environment variables
- attach `Authorization` headers from local storage or the auth store
- normalize API errors into a predictable UI message shape

Service wrappers should stay thin. The project is still small enough that a single API file with grouped helper methods is sufficient for the first pass.

## Admin UI Design

The admin side will use Ant Design Vue for tables, forms, modals, notifications, and layout primitives.

### Admin Layout

- sidebar navigation
- top header with user actions
- scrollable content area

### CRUD Pattern

Each admin page will follow the same pattern:

1. page-level table backed by store state
2. create/edit modal using Ant Design form components
3. loading state per table and per form submission
4. optimistic refresh by refetching after successful mutation

### Menu Management Scope

The initial admin pages should keep complexity controlled:

- `Categories.vue`: full CRUD for categories
- `MenuItems.vue`: full CRUD for menus, plus variant and addon management within item-focused dialogs or sections
- `QRCode.vue`: list and create QR codes

Variants and addon links can be managed inside the menu item workflow rather than forcing the user through many separate pages in v1.

## Public UI Design

The public side should be mobile-first and lighter than the admin panel.

### Public Layout

- restaurant header
- branch and table metadata when present
- horizontal category navigation
- stacked menu cards
- item detail modal or bottom sheet

### Item Detail Interaction

The item detail should show:

- item image
- item name and description
- base price
- variant selection as radios
- addon selection as checkboxes
- live total price

The default selection behavior should be:

- if active variants exist, preselect the first active variant only if business rules accept a default
- otherwise allow no variant selection and treat the delta as zero
- start with no addons selected

## Price Handling

All prices from the backend are in minor units.

Computation:

```text
displayTotal = menu.price + selectedVariant.priceDeltaCents + sum(selectedAddons.price)
```

The frontend should use one formatting utility for displaying `LAK` and other currencies to avoid inconsistent price rendering.

## Error And Loading Handling

Use a consistent pattern across the app:

- page loads: skeletons or spinners
- form submissions: disabled submit button with spinner
- request failures: Ant Design notifications or inline alerts
- empty datasets: explicit empty states rather than blank screens

This matters especially for:

- expired or missing tokens on admin routes
- invalid QR UUIDs on public routes
- partial registration failures in the two-step register flow

## Implementation Notes

Implementation should proceed in this order:

1. project scaffold and dependencies
2. router, layouts, and auth store
3. API client and route guard
4. admin categories and menu items
5. admin QR code management
6. public scan menu page and item detail interactions
7. UX polish, loading states, and error handling

This sequence gets a working backbone in place before spending time on refinements.
