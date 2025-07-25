// models/purchaseOrderModel.js
export const purchaseOrderModel = {
  requiredFields: ['vendor', 'orderDate', 'expectedDeliveryDate', 'status', 'paymentTerms', 'shippingMethod'],

  allowedStatus: ['Draft', 'Sent', 'Received', 'Cancelled'],

  allowedPaymentTerms: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Immediate'],

  allowedShippingMethods: ['Standard', 'Express', 'Overnight', 'Pickup'],

  defaultValues: {
    vendorName: null,
    notes: null
  }
};
