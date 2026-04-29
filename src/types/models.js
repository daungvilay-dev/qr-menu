/**
 * This file documents shared frontend model shapes for the current backend.
 * It is intentionally lightweight because the project is JavaScript-based.
 */

export const modelNotes = {
  menu: ['id', 'name', 'description', 'img', 'price', 'currency', 'variants', 'addons'],
  variant: ['id', 'name', 'priceDeltaCents', 'isActive'],
  addon: ['id', 'name', 'price', 'currency', 'isActive'],
  category: ['id', 'name', 'description', 'sortOrder', 'isActive'],
}
