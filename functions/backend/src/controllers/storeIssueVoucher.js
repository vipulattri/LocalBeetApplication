import { generateVONumber } from "../utils/generateVoucherNumber.js";


export const getAllStoreIssueVouchers = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();

    // Step 1: Fetch all vouchers
    const vouchersResult = await zcql.executeZCQLQuery(`
      SELECT * FROM StoreIssueVoucher ORDER BY CREATEDTIME DESC
    `);

    const vouchers = vouchersResult.map(row => row.StoreIssueVoucher);

    if (vouchers.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Step 2: Get all voucher ROWIDs
    const voucherIds = vouchers.map(v => `'${v.ROWID}'`).join(',');

    // Step 3: Fetch all items where voucherNumber IN (voucherIds)
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT * FROM SIVItems WHERE voucherNumber IN (${voucherIds})
    `);
    const items = itemsResult.map(row => row.SIVItems);

    // Step 4: Group items by voucherNumber
    const itemsByVoucher = {};
    items.forEach(item => {
      if (!itemsByVoucher[item.voucherNumber]) {
        itemsByVoucher[item.voucherNumber] = [];
      }
      itemsByVoucher[item.voucherNumber].push(item);
    });

    // Step 5: Attach items to corresponding vouchers
    const vouchersWithItems = vouchers.map(voucher => {
      return {
        ...voucher,
        items: itemsByVoucher[voucher.ROWID] || []
      };
    });

    return res.status(200).json({
      success: true,
      data: vouchersWithItems
    });

  } catch (error) {
    console.error('Error fetching vouchers with items:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vouchers with items',
      error: error.message
    });
  }
};

export const getStoreIssueVoucher = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const { voucherNumber } = req.params;

    // Step 1: Fetch the voucher by voucherNumber
    const voucherResult = await zcql.executeZCQLQuery(`
      SELECT * FROM StoreIssueVoucher WHERE voucherNumber = '${voucherNumber}'
    `);

    if (voucherResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    const voucher = voucherResult[0].StoreIssueVoucher;
    const voucherId = voucher.ROWID;

    // Step 2: Fetch items related to the voucher
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT * FROM SIVItems WHERE voucherNumber = '${voucherId}'
    `);
    const items = itemsResult.map(row => row.SIVItems);

    // Step 3: Attach items to the voucher
    voucher.items = items;

    return res.status(200).json({
      success: true,
      data: voucher
    });

  } catch (error) {
    console.error('Error fetching voucher by voucherNumber:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch voucher',
      error: error.message
    });
  }
};

export const createStoreIssueVoucher = async (req, res) => {
  try {
    const catalystApp = req.catalystApp; // Assuming middleware adds this
    const zcql = catalystApp.zcql();
    const datastore = catalystApp.datastore();

    const table = datastore.table('StoreIssueVoucher');
    const itemsTable = datastore.table('SIVItems');

    const {
      department,
      jobOrderReference,
      issuedBy,
      receivedBy,
      purpose,
      notes,
      items,
      issueDate
    } = req.body;

    // Step 1: Validate required fields
    if (!issueDate || !department || !issuedBy || !receivedBy || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: issueDate, department, issuedBy, receivedBy, or items'
      });
    }

    // Step 2: Generate Voucher Number
    const voucherNumber = generateVONumber(); // Custom function like "SIV-100637"

    // Step 3: Insert voucher master data
    const rowData = {
      voucherNumber,
      department,
      jobOrderReference: jobOrderReference || null,
      issuedBy,
      receivedBy,
      purpose,
      notes,
      issueDate
    };

    const insertedVoucher = await table.insertRow(rowData);
    const voucherId = insertedVoucher.ROWID;

    // Step 4: Insert item entries
    const itemInserts = items.map(item => {
      return {
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
        voucherNumber: voucherId,
      };
    });

    await itemsTable.insertRows(itemInserts);

    // Step 5: Return response
    return res.status(201).json({
      success: true,
      message: 'Store Issue Voucher created successfully',
      data: {
        voucher: insertedVoucher,
        items: itemInserts
      }
    });

  } catch (error) {
    console.error('Error creating Store Issue Voucher:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const updateStoreIssueVoucher = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const zcql = catalystApp.zcql();

    const storeIssueTable = datastore.table('StoreIssueVoucher');
    const itemsTable = datastore.table('SIVItems');

    const { voucherNumber } = req.params;  // get voucherNumber from URL params
    const {
      department,
      jobOrderReference,
      issuedBy,
      receivedBy,
      purpose,
      notes,
      items,
      issueDate
    } = req.body;

    // Validate required fields
    if (!voucherNumber || !issueDate || !department || !issuedBy || !receivedBy || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: voucherNumber (in params), issueDate, department, issuedBy, receivedBy, or items'
      });
    }

    // Step 1: Find existing voucher ROWID by voucherNumber
    const voucherResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM StoreIssueVoucher WHERE voucherNumber = '${voucherNumber}'
    `);

    if (voucherResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    const voucherId = voucherResult[0].StoreIssueVoucher.ROWID;

    // Step 2: Update voucher details using ROWID
    const updatedVoucher = await storeIssueTable.updateRow({
      ROWID: voucherId,
      department,
      jobOrderReference: jobOrderReference || null,
      issuedBy,
      receivedBy,
      purpose,
      notes,
      issueDate
    });

    // Step 3: Delete existing items linked to voucherNumber (using ROWID)
    await zcql.executeZCQLQuery(`
      DELETE FROM SIVItems WHERE voucherNumber = '${voucherId}'
    `);

    // Step 4: Insert new items with voucherNumber = ROWID
    const itemInserts = items.map(item => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes,
      voucherNumber: voucherId
    }));

    await itemsTable.insertRows(itemInserts);

    // Step 5: Respond
    return res.status(200).json({
      success: true,
      message: 'Store Issue Voucher updated successfully',
      data: {
        voucher: updatedVoucher,
        items: itemInserts
      }
    });

  } catch (error) {
    console.error('Error updating Store Issue Voucher:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update voucher',
      error: error.message
    });
  }
};

export const deleteStoreIssueVoucher = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const zcql = catalystApp.zcql();

    const { voucherNumber } = req.params;

    if (!voucherNumber) {
      return res.status(400).json({
        success: false,
        message: 'voucherNumber parameter is required'
      });
    }

    // Step 1: Find voucher ROWID using voucherNumber
    const voucherResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM StoreIssueVoucher WHERE voucherNumber = '${voucherNumber}'
    `);

    if (voucherResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    const voucherId = voucherResult[0].StoreIssueVoucher.ROWID;

    const storeIssueTable = datastore.table('StoreIssueVoucher');
    const itemsTable = datastore.table('SIVItems');

    // Step 2: Delete all items linked to this voucher
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM SIVItems WHERE voucherNumber = '${voucherId}'
    `);
    const itemIds = itemsResult.map(row => row.SIVItems.ROWID);

    for (const itemId of itemIds) {
      await itemsTable.deleteRow(itemId);
    }

    // Step 3: Delete the voucher itself
    await storeIssueTable.deleteRow(voucherId);

    return res.status(200).json({
      success: true,
      message: `Voucher ${voucherNumber} and its items deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting Store Issue Voucher:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete voucher',
      error: error.message
    });
  }
};

export const deleteSIVItem = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const datastore = catalystApp.datastore();

    const { voucherCode, itemCode } = req.params;

    if (!voucherCode || !itemCode) {
      return res.status(400).json({
        success: false,
        message: 'voucherCode and itemCode parameters are required'
      });
    }

    // Step 1: Get the voucher ROWID from voucherCode
    const voucherResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM StoreIssueVoucher WHERE voucherNumber = '${voucherCode}'
    `);

    if (voucherResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voucher not found'
      });
    }

    const voucherId = voucherResult[0].StoreIssueVoucher.ROWID;

    // Step 2: Find the item with the voucherNumber and itemCode
    const itemsResult = await zcql.executeZCQLQuery(`
      SELECT ROWID FROM SIVItems WHERE voucherNumber = '${voucherId}' AND itemCode = '${itemCode}'
    `);

    if (itemsResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found for given voucherCode and itemCode'
      });
    }

    const itemId = itemsResult[0].SIVItems.ROWID;

    // Step 3: Delete the item
    const itemsTable = datastore.table('SIVItems');
    await itemsTable.deleteRow(itemId);

    return res.status(200).json({
      success: true,
      message: `Item with code ${itemCode} from voucher ${voucherCode} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
};

