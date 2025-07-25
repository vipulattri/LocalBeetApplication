import { itemModel } from '../models/itemsModel.js';
import generateItemCode from '../utils/generateItemCode.js';

export const createItem = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('Items');

  const {
    itemName,
    category,
    unitOfMeasure,
    price,
    currentStock,
    description
  } = req.body;

  if (!itemModel.requiredFields.every(field => req.body[field] !== undefined)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!itemModel.allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category value' });
  }

  if (!itemModel.allowedUnits.includes(unitOfMeasure)) {
    return res.status(400).json({ error: 'Invalid unit of measure' });
  }

  const itemCode = generateItemCode();
  const now = new Date();

  const rowData = {
    itemCode,
    itemName,
    category,
    unitOfMeasure,
    price: price || 0,
    currentStock: currentStock || 0,
    description: description || null,
    // createdAt: now,
    // updatedAt: now
  };

  try {
    const insertedRow = await table.insertRow(rowData);
    res.status(201).json(insertedRow);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).send('Failed to create item');
  }
};

export const getItems = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('Items');

  try {
    const rows = await table.getAllRows();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Failed to retrieve items');
  }
};

export const updateItem = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('Items');

  const { itemCode } = req.params;
  if (!itemCode) return res.status(400).json({ error: 'itemCode is required in params' });

  try {
    const rows = await table.getRows({ criteria: { itemCode } });
    if (!rows.length) return res.status(404).json({ error: 'Item not found' });

    const rowId = rows[0].ROWID;

    const updatedData = {
      ...req.body,
      updatedAt: new Date()
    };

    const updatedRow = await table.updateRow(rowId, updatedData);
    res.json(updatedRow);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).send('Failed to update item');
  }
};

export const deleteItem = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('Items');

  const { itemCode } = req.params;
  if (!itemCode) return res.status(400).json({ error: 'itemCode is required in params' });

  try {
    const rows = await table.getRows({ criteria: { itemCode } });
    if (!rows.length) return res.status(404).json({ error: 'Item not found' });

    const rowId = rows[0].ROWID;
    await table.deleteRow(rowId);

    res.json({ message: `Item ${itemCode} deleted successfully` });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Failed to delete item');
  }
};
