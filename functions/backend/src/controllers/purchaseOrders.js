import generatePONumber from '../utils/generatePONumber.js';

export const createPurchaseOrder = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();

    const poTable = datastore.table('PurchaseOrders');
    const itemsTable = datastore.table('POItems');

    const {
      vendor,
      vendorName,
      orderDate,
      expectedDeliveryDate,
      status,
      paymentTerms,
      shippingMethod,
      notes,
      items
    } = req.body;

    if (!vendor || !vendorName || !orderDate || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const poNumber = generatePONumber();

    const newPO = await poTable.insertRow({
      poNumber,
      vendor,
      vendorName,
      orderDate,
      expectedDeliveryDate,
      status: status || 'Draft',
      paymentTerms,
      shippingMethod,
      notes
    });

    const poId = newPO.ROWID;

    const itemInserts = items.map(item => ({
      poNumber: poId,
      itemCode: item.itemCode,
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    }));

    await itemsTable.insertRows(itemInserts);

    return res.status(201).json({
      success: true,
      message: 'Purchase Order created successfully',
      data: {
        purchaseOrder: newPO,
        items: itemInserts
      }
    });

  } catch (error) {
    console.error('Error creating PO:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getAllPurchaseOrders = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();

    const poResult = await zcql.executeZCQLQuery(`
      SELECT * FROM PurchaseOrders ORDER BY CREATEDTIME DESC
    `);

    const purchaseOrders = poResult.map(row => row.PurchaseOrders);
    if (purchaseOrders.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const poIds = purchaseOrders.map(p => `'${p.ROWID}'`).join(',');
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT * FROM POItems WHERE poNumber IN (${poIds})
    `);
    const items = itemsResult.map(row => row.POItems);

    const itemsByPO = {};
    items.forEach(item => {
      if (!itemsByPO[item.poNumber]) itemsByPO[item.poNumber] = [];
      itemsByPO[item.poNumber].push(item);
    });

    const data = purchaseOrders.map(po => ({
      ...po,
      items: itemsByPO[po.ROWID] || []
    }));

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Error fetching POs:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch POs', error: error.message });
  }
};

export const getPurchaseOrderByNumber = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const { poNumber } = req.params;

    if (!poNumber) {
      return res.status(400).json({ success: false, message: 'Missing poNumber in params' });
    }

    // Fetch PO by poNumber
    const poResult = await zcql.executeZCQLQuery(`
      SELECT * FROM PurchaseOrders WHERE poNumber = '${poNumber}'
    `);

    if (poResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Purchase Order not found' });
    }

    const po = poResult[0].PurchaseOrders;
    const poId = po.ROWID;

    // Fetch items linked to this PO
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT * FROM POItems WHERE poNumber = '${poId}'
    `);

    const items = itemsResult.map(row => row.POItems);

    return res.status(200).json({
      success: true,
      data: { ...po, items }
    });

  } catch (error) {
    console.error('Error fetching PO by number:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Purchase Order',
      error: error.message
    });
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const zcql = catalystApp.zcql();

    const { poNumber } = req.params;
    const poTable = datastore.table('PurchaseOrders');
    const itemsTable = datastore.table('POItems');

    const {
      vendor,
      vendorName,
      orderDate,
      expectedDeliveryDate,
      status,
      paymentTerms,
      shippingMethod,
      notes,
      items
    } = req.body;

    const poResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM PurchaseOrders WHERE poNumber = '${poNumber}'
    `);
    if (poResult.length === 0) {
      return res.status(404).json({ success: false, message: 'PO not found' });
    }

    const poId = poResult[0].PurchaseOrders.ROWID;

    await poTable.updateRow({
      ROWID: poId,
      vendor,
      vendorName,
      orderDate,
      expectedDeliveryDate,
      status,
      paymentTerms,
      shippingMethod,
      notes
    });

    // Delete existing items
    await zcql.executeZCQLQuery(`
      DELETE FROM POItems WHERE poNumber = '${poId}'
    `);

    const itemInserts = items.map(item => ({
      poNumber: poId,
      itemCode: item.itemCode,
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice
    }));

    await itemsTable.insertRows(itemInserts);

    return res.status(200).json({ success: true, message: 'Purchase Order updated successfully' });

  } catch (error) {
    console.error('Error updating PO:', error);
    return res.status(500).json({ success: false, message: 'Failed to update PO', error: error.message });
  }
};

export const deletePurchaseOrder = async (req, res) => {
  try {
    const { poNumber } = req.params;
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const zcql = catalystApp.zcql();

    const poTable = datastore.table('PurchaseOrders');
    const itemsTable = datastore.table('POItems');

    const result = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM PurchaseOrders WHERE poNumber = '${poNumber}'
    `);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'PO not found' });
    }

    const poId = result[0].PurchaseOrders.ROWID;

    await zcql.executeZCQLQuery(`
      DELETE FROM POItems WHERE poNumber = '${poId}'
    `);

    await poTable.deleteRow(poId);

    return res.status(200).json({ success: true, message: 'Purchase Order deleted successfully' });

  } catch (error) {
    console.error('Error deleting PO:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete PO', error: error.message });
  }
};


