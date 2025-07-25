export const bomModel = {
  allowedStatuses: ['Draft', 'Released', 'Archived'],

  requiredFields: ['productName', 'version', 'status', 'batchSize', 'productionTime'],

  defaultValues: {
    description: null,
    productionNotes: null,
    batchSize: 1,
    productionTime: 0
  }
};
