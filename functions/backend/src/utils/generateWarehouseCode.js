let lastWarehouseNumber = 0;

export function generateWarehouseCode() {
  lastWarehouseNumber++;
  return `WH${String(lastWarehouseNumber).padStart(3, '0')}`; // WH001
}