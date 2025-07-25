export const warehouseModel = {
  // Remove warehouseCode from required fields since it's auto-generated
  // requiredFields: ['warehouseName', 'type', 'location', 'address'],

  // allowedTypes: ['Distribution', 'Storage', 'Cold Storage', 'Temporary', 'Cross-dock'],

  // allowedStatuses: ['Active', 'Inactive', 'Under Maintenance'],

  defaultValues: {
    status: 'Active',
    manager: null,
    phone: null,
    email: null,
    capacity: 0,
    numberOfZones: 0,
    numberOfEmployees: 0
  }
};