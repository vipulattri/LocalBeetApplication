import { warehouseModel } from '../models/warehouseModel.js';
import {generateWarehouseCode } from '../utils/generateWarehouseCode.js';

export const createWarehouse = async (req, res) => {
  console.log('🏗️ createWarehouse called!');
  console.log('📦 Request body:', req.body);
  
  try {
    const catalystApp = req.catalystApp;
    
    if (!catalystApp) {
      console.error('❌ Catalyst app not found in request');
      return res.status(500).json({ error: 'Catalyst app not initialized' });
    }
    
    const datastore = catalystApp.datastore();
    const table = datastore.table('Warehouses');

    const {
      warehouseName,
      type,
      status,
      location,
      address,
      manager,
      phone,
      email,
      capacity,
      numberOfZones,
      numberOfEmployees
    } = req.body;

    console.log('🔍 Parsed fields:', { warehouseName, type, location, address });

    // Validate required fields
    // const missingFields = warehouseModel.requiredFields.filter(field => !req.body[field]);
    // if (missingFields.length > 0) {
    //   console.log('❌ Missing required fields:', missingFields);
    //   return res.status(400).json({ 
    //     error: 'Missing required fields', 
    //     missingFields 
    //   });
    // }

    // // Validate type
    // if (!warehouseModel.allowedTypes.includes(type)) {
    //   console.log('❌ Invalid warehouse type:', type);
    //   return res.status(400).json({ error: 'Invalid warehouse type' });
    // }

    // // Validate status if provided
    // if (status && !warehouseModel.allowedStatuses.includes(status)) {
    //   console.log('❌ Invalid warehouse status:', status);
    //   return res.status(400).json({ error: 'Invalid warehouse status' });
    // }

    // Validate email format if provided
    // if (email && !isValidEmail(email)) {
    //   console.log('❌ Invalid email format:', email);
    //   return res.status(400).json({ error: 'Invalid email format' });
    // }
    
    const finalWarehouseCode = generateWarehouseCode();
    // Prepare row data
    const rowDataWithoutDates = {
      warehouseCode: finalWarehouseCode,
      warehouseName,
      type,
      status: status || warehouseModel.defaultValues.status,
      location,
      address,
      manager: manager || warehouseModel.defaultValues.manager,
      phone: phone || warehouseModel.defaultValues.phone,
      email: email || warehouseModel.defaultValues.email,
      capacity: capacity || warehouseModel.defaultValues.capacity,
      numberOfZones: numberOfZones || warehouseModel.defaultValues.numberOfZones,
      numberOfEmployees: numberOfEmployees || warehouseModel.defaultValues.numberOfEmployees
    };

    console.log('💾 Attempting to save warehouse with code:', finalWarehouseCode);

    // Try to insert without datetime fields first
    try {
      const insertedRow = await table.insertRow(rowDataWithoutDates);
      console.log('✅ Warehouse created successfully:', insertedRow);
      return res.status(201).json(insertedRow);
    } catch (dateError) {
      console.log('❌ Failed without dates, trying with different date formats...');
      
      // If that fails, try different datetime formats
      const now = new Date();
      const dateFormats = [
        now.toISOString(),
        now.toISOString().slice(0, 19).replace('T', ' '),
        Math.floor(now.getTime() / 1000),
        now.getTime(),
        now.toISOString().slice(0, 10),
        now.toISOString().replace('Z', '+00:00')
      ];

      for (let i = 0; i < dateFormats.length; i++) {
        const dateFormat = dateFormats[i];
        console.log(`🔄 Trying date format ${i + 1}:`, dateFormat);
        
        const rowDataWithDates = {
          ...rowDataWithoutDates,
          //createdAt: dateFormat,
          //updatedAt: dateFormat
        };

        try {
          const insertedRow = await table.insertRow(rowDataWithDates);
          console.log(`✅ Warehouse created successfully with date format ${i + 1}:`, insertedRow);
          return res.status(201).json(insertedRow);
        } catch (formatError) {
          console.log(`❌ Date format ${i + 1} failed:`, formatError.message);
          continue;
        }
      }
      
      throw dateError;
    }

  } catch (error) {
    console.error('💥 Error creating warehouse:', error);
    res.status(500).json({ error: 'Failed to create warehouse', details: error.message });
  }
};

export const getWarehouses = async (req, res) => {
  console.log('📋 getWarehouses called');
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const table = datastore.table('Warehouses');

    const rows = await table.getAllRows();
    console.log('✅ Retrieved warehouses:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('💥 Error fetching warehouses:', error);
    res.status(500).json({ error: 'Failed to retrieve warehouses', details: error.message });
  }
};

export const getWarehouseByCode = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const table = datastore.table('Warehouses');

    const { warehouseCode } = req.params;
    if (!warehouseCode) return res.status(400).json({ error: 'warehouseCode is required in params' });

    const rows = await table.getAllRows({
      filter: {
        warehouseCode: warehouseCode
      }
    });
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    res.status(500).json({ error: 'Failed to retrieve warehouse', details: error.message });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const table = datastore.table('Warehouses');

    const { warehouseCode } = req.params;
    if (!warehouseCode) return res.status(400).json({ error: 'warehouseCode is required in params' });

    const rows = await table.getAllRows({
      filter: {
        warehouseCode: warehouseCode
      }
    });
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const rowId = rows[0].ROWID;

    // Validate type if being updated
    if (req.body.type && !warehouseModel.allowedTypes.includes(req.body.type)) {
      return res.status(400).json({ error: 'Invalid warehouse type' });
    }

    // Validate status if being updated
    if (req.body.status && !warehouseModel.allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid warehouse status' });
    }

    // Validate email format if being updated
    if (req.body.email && !isValidEmail(req.body.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Try different update strategies
    let updatedData;
    
    // First try without updatedAt
    try {
      updatedData = { ...req.body };
      delete updatedData.updatedAt;
      
      const updatedRow = await table.updateRow(rowId, updatedData);
      return res.json(updatedRow);
    } catch (updateError) {
      console.log('Update without updatedAt failed, trying with updatedAt...');
      
      updatedData = {
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      
      const updatedRow = await table.updateRow(rowId, updatedData);
      res.json(updatedRow);
    }
  } catch (error) {
    console.error('Error updating warehouse:', error);
    res.status(500).json({ error: 'Failed to update warehouse', details: error.message });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();
    const table = datastore.table('Warehouses');

    const { warehouseCode } = req.params;
    if (!warehouseCode) return res.status(400).json({ error: 'warehouseCode is required in params' });

    const rows = await table.getAllRows({
      filter: {
        warehouseCode: warehouseCode
      }
    });
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    const rowId = rows[0].ROWID;
    await table.deleteRow(rowId);

    res.json({ message: `Warehouse ${warehouseCode} deleted successfully` });
  } catch (error) {
    console.error('Error deleting warehouse:', error);
    res.status(500).json({ error: 'Failed to delete warehouse', details: error.message });
  }
};

// Helper function for email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}