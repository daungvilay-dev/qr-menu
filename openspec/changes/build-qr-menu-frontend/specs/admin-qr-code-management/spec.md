# Capability: Admin QR Code Management

## Overview

Provide admin tools for creating and reviewing QR codes that drive the public menu experience.

## Requirements

### Requirement: QR codes are listable in the admin panel

The system SHALL let authenticated restaurant admins view existing QR codes.

#### Scenario: QR code list loads

- **WHEN** the QR code page opens
- **THEN** the frontend requests `GET /qrcodes`
- **AND** renders a table containing QR metadata such as UUID, table number, scan count, and branch context when available

### Requirement: QR codes are creatable from the admin panel

The system SHALL let authenticated restaurant admins create QR codes tied to restaurant and optional branch/table data.

#### Scenario: QR code is created

- **WHEN** an admin submits a valid QR code form
- **THEN** the frontend calls `POST /qrcodes`
- **AND** stores or renders the returned `qrcodeId` and `qrcodeUuid`
- **AND** refreshes the QR code list after success

### Requirement: QR output is usable for customer access

The system SHALL present the generated QR target in a form that can be copied or rendered for restaurant use.

#### Scenario: Admin views a generated QR target

- **WHEN** a QR code exists in the admin UI
- **THEN** the page shows the scan URL or UUID-derived target needed to reach the public menu
- **AND** the value matches the backend's `GET /qrcodes/scan/:uuid` flow
