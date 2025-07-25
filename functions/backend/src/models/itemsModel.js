

export const itemModel = {
  requiredFields: ['itemName', 'category', 'unitOfMeasure', 'price', 'currentStock'],

  allowedCategories: ['Hardware', 'Raw Materials', 'Electrical', 'Components', 'Sealing', 'Tools', 'Chemicals'],

  allowedUnits: ['box' , 'cm' , 'dz' , 'ft' , 'g' , 'in' ,'kg' , 'km' ,'lb' ,'mg' ,'ml','m','pcs'],

  allowedTypes : ['Goods' , 'Service'],

  allowedDimension: ['cm' , 'in'] ,

  allowdWeights : ['kg' , 'g' , 'lv' , 'oz'],

  allowedAccounts : ['Discount' , 'General income' , 'Interest income' , 'Late fee income' , 'Otehr charges' , 'Sales' , 'Shipping charge'],
  defaultValues: {
    description: null,
    price: 0,
    currentStock: 0
  }
};