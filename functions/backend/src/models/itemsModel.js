

export const itemModel = {
  requiredFields: ['itemName', 'category', 'unitOfMeasure', 'price', 'currentStock'],

  allowedCategories: ['Hardware', 'Raw Materials', 'Electrical', 'Components', 'Sealing', 'Tools', 'Chemicals'],

  allowedUnits: ['pcs', 'kg', 'm', 'l', 'box', 'set', 'roll', 'sheet', 'ft', 'cm'],

  defaultValues: {
    description: null,
    price: 0,
    currentStock: 0
  }
};