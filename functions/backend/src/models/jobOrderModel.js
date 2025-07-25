export const jobOrderModel = {
  allowedStatuses: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
  allowedPriorities: ['Low', 'Medium', 'High'],

  // requiredFields: [
  //   'bomReference',
  //   'productName',
  //   'quantity',
  //   'startDate',
  //   'dueDate',
  //   'status',
  //   'priorityJO'
  // ],

  defaultValues: {
    department: null,
    assignedTo: null,
    estimatedHours: 0,
    actualHours: 0,
    description: null,
    notes: null
  }
};
