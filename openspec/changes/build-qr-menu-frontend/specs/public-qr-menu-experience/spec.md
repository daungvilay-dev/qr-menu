# Capability: Public QR Menu Experience

## Overview

Provide a mobile-first customer menu experience loaded from QR scan data without requiring authentication.

## Requirements

### Requirement: Public menu loads from QR scan data

The system SHALL load customer menu content using the backend QR scan endpoint.

#### Scenario: Customer opens a valid QR menu URL

- **WHEN** a customer opens a public route containing a QR UUID
- **THEN** the frontend requests `GET /qrcodes/scan/:uuid`
- **AND** renders restaurant, branch, category, and menu item data from the response

#### Scenario: QR lookup fails

- **WHEN** the QR UUID is invalid or unavailable
- **THEN** the frontend shows a clear empty or error state for the customer

### Requirement: Customers can browse categories and menu items on mobile

The system SHALL present the public menu in a mobile-first layout with category navigation and item cards.

#### Scenario: Public menu renders categories

- **WHEN** menu data is available
- **THEN** the UI renders category tabs or anchors
- **AND** groups menu cards under their categories

### Requirement: Customers can configure an item with variants and addons

The system SHALL let customers select one variant and multiple addons for a menu item.

#### Scenario: Customer opens item detail

- **WHEN** a customer opens a menu item's detail view
- **THEN** the UI shows image, name, description, base price, variants, and addons
- **AND** variants are presented as a single-choice control
- **AND** addons are presented as a multi-choice control

### Requirement: Public item total updates in real time

The system SHALL compute the displayed item total from the selected configuration.

#### Scenario: Variant and addon selections change

- **WHEN** a customer selects a variant or toggles addons
- **THEN** the displayed total is recalculated as `menu.price + selectedVariant.priceDeltaCents + sum(selectedAddons.price)`
- **AND** the total updates immediately in the UI

### Requirement: Public menu handles loading and unavailable content gracefully

The system SHALL show appropriate loading, empty, and unavailable states in the customer view.

#### Scenario: Public menu data is loading

- **WHEN** the QR menu request is pending
- **THEN** the UI shows mobile-friendly loading placeholders

#### Scenario: Menu item is unavailable from scan response

- **WHEN** an item is omitted because the backend only returns available items
- **THEN** the frontend does not show unavailable items in the public list
