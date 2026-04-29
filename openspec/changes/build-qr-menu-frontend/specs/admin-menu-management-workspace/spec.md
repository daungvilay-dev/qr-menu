# Capability: Admin Menu Management Workspace

## Overview

Provide an admin workspace for managing restaurant menu content through tables, forms, and dialogs.

## Requirements

### Requirement: Categories are manageable from the admin panel

The system SHALL let authenticated restaurant admins list, create, update, and delete menu categories.

#### Scenario: Category list loads

- **WHEN** the categories page opens
- **THEN** the frontend requests `GET /menu-categories`
- **AND** renders the returned category list in an admin table

#### Scenario: Category is created or edited

- **WHEN** an admin submits a valid category form
- **THEN** the frontend calls the corresponding create or update category endpoint
- **AND** refreshes the category list after success

### Requirement: Menu items are manageable from the admin panel

The system SHALL let authenticated restaurant admins list, create, update, and delete menu items.

#### Scenario: Menu list loads

- **WHEN** the menu items page opens
- **THEN** the frontend requests `GET /menus`
- **AND** displays item data including price, availability, and category context

#### Scenario: Menu item is created or edited

- **WHEN** an admin submits a valid menu form
- **THEN** the frontend calls the corresponding create or update menu endpoint
- **AND** refreshes the menu list after success

### Requirement: Variants are manageable from the admin panel

The system SHALL let authenticated restaurant admins manage menu item variants.

#### Scenario: Variant list is filtered by menu item

- **WHEN** an admin selects a menu item context for variant management
- **THEN** the frontend requests `GET /variants` with the relevant `menuId`
- **AND** displays variant names, active state, sort order, and `priceDeltaCents`

### Requirement: Addons and item-addon links are manageable from the admin panel

The system SHALL let authenticated restaurant admins manage addon definitions and map addons to menu items.

#### Scenario: Addon definitions are listed

- **WHEN** the addon management view opens
- **THEN** the frontend requests `GET /addons`
- **AND** renders addon name, price, active state, and sort order

#### Scenario: Menu item addons are linked

- **WHEN** an admin updates addon selections for a specific menu item
- **THEN** the frontend uses the `/item-addons` endpoints to create or remove relationships
- **AND** reflects the linked addons in the menu management UI

### Requirement: Admin CRUD surfaces loading and error states

The system SHALL show clear loading and failure states during admin data operations.

#### Scenario: Admin data is loading

- **WHEN** a table or form-backed request is in flight
- **THEN** the UI shows a spinner, skeleton, or disabled submit state appropriate to the context

#### Scenario: Admin mutation fails

- **WHEN** a create, update, or delete request fails
- **THEN** the UI shows a visible error notification
- **AND** preserves form state when practical
