import generateGRNNumber from '../utils/generateGRNnumber.js'

export const getAllGoodsReceiptNotes = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();

    // Fetch all GRNs
    const grnResult = await zcql.executeZCQLQuery(`
      SELECT * FROM GoodReceiptNotes ORDER BY CREATEDTIME DESC
    `);
    const grns = grnResult.map(row => row.GoodReceiptNotes);

    if (grns.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Collect all GRN ROWIDs
    const grnIds = grns.map(g => `'${g.ROWID}'`).join(',');

    // Fetch all items linked to these GRNs
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT * FROM GRNItems WHERE grnNumber IN (${grnIds})
    `);
    const items = itemsResult.map(row => row.GRNItems);

    // Group items by grnNumber
    const itemsByGrn = {};
    items.forEach(item => {
      if (!itemsByGrn[item.grnNumber]) {
        itemsByGrn[item.grnNumber] = [];
      }
      itemsByGrn[item.grnNumber].push(item);
    });

    // Attach items to respective GRNs
    const grnsWithItems = grns.map(grn => ({
      ...grn,
      items: itemsByGrn[grn.ROWID] || []
    }));

    return res.status(200).json({
      success: true,
      data: grnsWithItems
    });

  } catch (error) {
    console.error('Error fetching GRNs with items:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch GRNs with items',
      error: error.message
    });
  }
};

export const getGoodsReceiptNoteByNumber = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();

    const { grnNumber } = req.params;
    if (!grnNumber) {
      return res.status(400).json({
        success: false,
        message: 'grnNumber param is required'
      });
    }

    // Get GRN master record
    const grnResult = await zcql.executeZCQLQuery(`
      SELECT * FROM GoodReceiptNotes WHERE grnNumber = '${grnNumber}'
    `);

    if (grnResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goods Receipt Note not found'
      });
    }

    const grn = grnResult[0].GoodReceiptNotes;
    const grnId = grn.ROWID;

    // Get related items
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT * FROM GRNItems WHERE grnNumber = '${grnId}'
    `);
    const items = itemsResult.map(row => row.GRNItems);

    return res.status(200).json({
      success: true,
      data: {
        grn,
        items
      }
    });

  } catch (error) {
    console.error('Error fetching GRN by number:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch GRN',
      error: error.message
    });
  }
};

export const createGoodsReceiptNote = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();

    const grnTable = datastore.table('GoodReceiptNotes');
    const itemsTable = datastore.table('GRNItems');

    const {
      poReference,
      vendor,
      vendorName,
      receiptDate,
      receivedBy,
      notes,
      items
    } = req.body;

    if (
      !receiptDate || !receivedBy || !items || items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: grnNumber, receiptDate, receivedBy, or items'
      });
    }

    const grnNumber = generateGRNNumber();

    const rowData = {
      grnNumber,
      poReference: poReference || null,
      vendor: vendor || null,
      vendorName: vendorName || null,
      receiptDate,
      receivedBy,
      notes
    };

    // Insert GRN master record
    const insertedGRN = await grnTable.insertRow(rowData);

    // Insert GRN items
    const grnId = insertedGRN.ROWID;
    const itemsToInsert = items.map(item => ({
      grnNumber: grnId,
      itemCode: item.itemCode,
      itemName: item.itemName,
      unit: item.unit,
      expectedQuantity: item.expectedQuantity || 0,
      receivedQuantity: item.receivedQuantity || 0,
      notes: item.notes || ''
    }));

    await itemsTable.insertRows(itemsToInsert);

    return res.status(201).json({
      success: true,
      message: 'Goods Receipt Note created successfully',
      data: {
        grn: insertedGRN,
        items: itemsToInsert
      }
    });

  } catch (error) {
    console.error('Error creating GRN:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updateGoodsReceiptNote = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const datastore = catalystApp.datastore();

    const grnTable = datastore.table('GoodReceiptNotes');
    const itemsTable = datastore.table('GRNItems');

    const { grnNumber } = req.params;
    const {
      poReference,
      vendor,
      vendorName,
      receiptDate,
      receivedBy,
      notes,
      items
    } = req.body;

    // Validate required fields
    if (!grnNumber || !receiptDate || !receivedBy || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: grnNumber (in params), receiptDate, receivedBy, or items'
      });
    }

    // Step 1: Fetch ROWID of GRN
    const grnResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM GoodReceiptNotes WHERE grnNumber = '${grnNumber}'
    `);

    if (grnResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goods Receipt Note not found'
      });
    }

    const grnId = grnResult[0].GoodReceiptNotes.ROWID;

    // Step 2: Update the GRN master row using ROWID inside the object
    const updatedGRN = await grnTable.updateRow({
      ROWID: grnId,
      poReference: poReference || null,
      vendor: vendor || null,
      vendorName: vendorName || null,
      receiptDate,
      receivedBy,
      notes
    });

    // Step 3: Delete all existing items linked to this GRN
    await zcql.executeZCQLQuery(`
      DELETE FROM GRNItems WHERE grnNumber = '${grnId}'
    `);

    // Step 4: Insert new item records
    const itemInserts = items.map(item => ({
      grnNumber: grnId,
      itemCode: item.itemCode,
      itemName: item.itemName,
      unit: item.unit,
      expectedQuantity: item.expectedQuantity || 0,
      receivedQuantity: item.receivedQuantity || 0,
      notes: item.notes || ''
    }));

    await itemsTable.insertRows(itemInserts);

    // Step 5: Respond with success
    return res.status(200).json({
      success: true,
      message: 'Goods Receipt Note updated successfully',
      data: {
        grn: updatedGRN,
        items: itemInserts
      }
    });

  } catch (error) {
    console.error('Error updating GRN:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update Goods Receipt Note',
      error: error.message
    });
  }
};

export const deleteGoodsReceiptNote = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const datastore = catalystApp.datastore();

    const { grnNumber } = req.params;
    if (!grnNumber) {
      return res.status(400).json({
        success: false,
        message: 'grnNumber param is required'
      });
    }

    // Fetch GRN ROWID
    const grnResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM GoodReceiptNotes WHERE grnNumber = '${grnNumber}'
    `);

    if (grnResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goods Receipt Note not found'
      });
    }

    const grnId = grnResult[0].GoodReceiptNotes.ROWID;

    // Delete GRN items
    const itemsTable = datastore.table('GRNItems');
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM GRNItems WHERE grnNumber = '${grnId}'
    `);
    for (const row of itemsResult) {
      await itemsTable.deleteRow(row.GRNItems.ROWID);
    }

    // Delete GRN master
    const grnTable = datastore.table('GoodReceiptNotes');
    await grnTable.deleteRow(grnId);

    return res.status(200).json({
      success: true,
      message: 'Goods Receipt Note and its items deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting GRN:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete Goods Receipt Note',
      error: error.message
    });
  }
};

export const deleteGRNItem = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const datastore = catalystApp.datastore();

    const { grnNumber, itemCode } = req.params;

    if (!grnNumber || !itemCode) {
      return res.status(400).json({
        success: false,
        message: 'grnNumber and itemCode params are required'
      });
    }

    // Get GRN ROWID
    const grnResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM GoodReceiptNotes WHERE grnNumber = '${grnNumber}'
    `);

    if (grnResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Goods Receipt Note not found'
      });
    }

    const grnId = grnResult[0].GoodReceiptNotes.ROWID;

    // Find the item ROWID with matching grnNumber and itemCode
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM GRNItems WHERE grnNumber = '${grnId}' AND itemCode = '${itemCode}'
    `);

    if (itemsResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found for the given GRN and item code'
      });
    }

    const itemId = itemsResult[0].GRNItems.ROWID;

    const itemsTable = datastore.table('GRNItems');
    await itemsTable.deleteRow(itemId);

    return res.status(200).json({
      success: true,
      message: `Item with code ${itemCode} deleted from GRN ${grnNumber}`
    });

  } catch (error) {
    console.error('Error deleting GRN item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete GRN item',
      error: error.message
    });
  }
};

