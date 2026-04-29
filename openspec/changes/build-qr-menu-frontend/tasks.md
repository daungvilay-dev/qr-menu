# Tasks: Build QR Menu Frontend

- [x] Scaffold the Vue 3 application with Vite and install the required dependencies: Pinia, Vue Router, Tailwind CSS, Ant Design Vue, Axios.
- [x] Set up the application entry points, global styles, Ant Design Vue registration, Tailwind integration, and environment-based API configuration.
- [x] Implement the shared Axios client with auth header interception and common error handling behavior.
- [x] Implement the auth store with local storage persistence, login flow, logout flow, and two-step restaurant-owner registration flow.
- [x] Implement router configuration with public routes, auth routes, admin routes, and admin route guarding.
- [x] Implement the shared layouts for `AdminLayout.vue` and `PublicLayout.vue`.
- [x] Implement reusable UI building blocks needed by the first pages, including loading states, empty states, form wrappers, and menu display components.
- [x] Implement the admin categories page with table, create modal, edit modal, delete action, and API integration.
- [x] Implement the admin menu items page with table, create/edit flows, and embedded management for variants and addons based on the backend's `/variants`, `/addons`, and `/item-addons` endpoints.
- [x] Implement the admin QR code page with QR list, create flow, and rendering of the scan target derived from `qrcodeUuid`.
- [x] Implement the public menu store state for scan payloads, selected item state, variant selection, addon selection, and derived total price.
- [x] Implement the public menu page backed by `GET /qrcodes/scan/:uuid`, including category navigation, mobile-first item cards, and loading/error states.
- [x] Implement the public item detail modal or sheet with radio-based variant selection, checkbox-based addon selection, and live total price updates.
- [x] Verify all major flows against the backend contract and adjust field mapping for `price`, `priceDeltaCents`, restaurant registration, and QR scan responses.
