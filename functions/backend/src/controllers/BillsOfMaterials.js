import generateBOMNumber from "../utils/generateBOMNumber.js";

export const getAllBOMs = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();

    const bomResult = await zcql.executeZCQLQuery(`
      SELECT * FROM BillOfMaterials
    `);

    const boms = [];

    for (const row of bomResult) {
      const bom = row.BillOfMaterials;
      const bomId = bom.ROWID;

      // Fetch materials for each BOM
      const materialsResult = await zcql.executeZCQLQuery(`
        SELECT * FROM BOMMaterials WHERE bomNumber = '${bomId}'
      `);
      const materials = materialsResult.map(m => m.BOMMaterials);

      boms.push({
        ...bom,
        materials
      });
    }

    return res.status(200).json({
      success: true,
      data: boms
    });
  } catch (error) {
    console.error('Error fetching BOMs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch BOMs',
      error: error.message
    });
  }
};

export const getBOMById = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const { bomId } = req.params;

    if (!bomId) {
      return res.status(400).json({
        success: false,
        message: 'bomId parameter is required'
      });
    }

    // Fetch BOM
    const bomResult = await zcql.executeZCQLQuery(`
      SELECT * FROM BillOfMaterials WHERE bomId = '${bomId}'
    `);

    if (bomResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'BOM not found'
      });
    }

    const bom = bomResult[0].BillOfMaterials;
    const bomRowId = bom.ROWID;

    // Fetch materials linked to BOM
    const materialsResult = await zcql.executeZCQLQuery(`
      SELECT * FROM BOMMaterials WHERE bomId = '${bomRowId}'
    `);
    const materials = materialsResult.map(row => row.BOMMaterials);

    return res.status(200).json({
      success: true,
      data: {
        ...bom,
        materials
      }
    });
  } catch (error) {
    console.error('Error fetching BOM by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch BOM',
      error: error.message
    });
  }
};

export const createBillOfMaterial = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const datastore = catalystApp.datastore();

    const bomTable = datastore.table("BillOfMaterials");
    const materialsTable = datastore.table("BOMMaterials");

    const {
      productName,
      status,
      effectiveDate,
      expiryDate,
      description,
      notes,
      version,
      materials,
    } = req.body;

    if (!productName || !version || !effectiveDate || !materials || materials.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const bomNumber = generateBOMNumber();
    
    const bomRow = await bomTable.insertRow({
      bomNumber,
      productName,
      status,
      effectiveDate,
      expiryDate,
      description,
      notes,
      version
    });

    const bomRowId = bomRow.ROWID;

    const materialInserts = materials.map((m) => ({
      bomNumber: bomRowId,
      itemCode: m.itemCode,
      itemName: m.itemName,
      quantity: m.quantity,
      unit: m.unit,
      unitCost: m.unitCost,
      totalCost: m.totalCost,
      supplier: m.supplier,
      notes: m.notes,
    }));

    await materialsTable.insertRows(materialInserts);

    return res.status(201).json({
      success: true,
      message: "BOM created successfully",
      data: { bom: bomRow, materials: materialInserts }
    });
  } catch (error) {
    console.error("Error creating BOM:", error);
    return res.status(500).json({ success: false, message: "Failed to create BOM", error: error.message });
  }
};

export const updateBillOfMaterial = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const datastore = catalystApp.datastore();

    const bomTable = datastore.table("BillOfMaterials");
    const materialsTable = datastore.table("BOMMaterials");

    const { bomId } = req.params;
    const {
      productName,
      version,
      status,
      effectiveDate,
      expiryDate,
      description,
      notes,
      materials
    } = req.body;

    const bomResult = await zcql.executeZCQLQuery(`SELECT ROWID FROM BillOfMaterials WHERE bomId = '${bomId}'`);

    if (bomResult.length === 0) {
      return res.status(404).json({ success: false, message: "BOM not found" });
    }

    const bomRowId = bomResult[0].BillOfMaterials.ROWID;

    await bomTable.updateRow({
      ROWID: bomRowId,
      productName,
      version,
      status,
      effectiveDate,
      expiryDate,
      description,
      notes
    });

    await zcql.executeZCQLQuery(`DELETE FROM BOMMaterials WHERE bomId = '${bomRowId}'`);

    const materialInserts = materials.map((m) => ({
      itemCode: m.itemCode,
      itemName: m.itemName,
      quantity: m.quantity,
      unit: m.unit,
      unitCost: m.unitCost,
      totalCost: m.totalCost,
      supplier: m.supplier,
      notes: m.notes,
      bomId: bomRowId
    }));

    await materialsTable.insertRows(materialInserts);

    return res.status(200).json({ success: true, message: "BOM updated successfully" });
  } catch (error) {
    console.error("Error updating BOM:", error);
    return res.status(500).json({ success: false, message: "Failed to update BOM", error: error.message });
  }
};

export const deleteBillOfMaterial = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const datastore = catalystApp.datastore();

    const bomTable = datastore.table("BillOfMaterials");
    const materialsTable = datastore.table("BOMMaterials");

    const { bomId } = req.params;

    const bomResult = await zcql.executeZCQLQuery(`SELECT ROWID FROM BillOfMaterials WHERE bomId = '${bomId}'`);

    if (bomResult.length === 0) {
      return res.status(404).json({ success: false, message: "BOM not found" });
    }

    const bomRowId = bomResult[0].BillOfMaterials.ROWID;

    await zcql.executeZCQLQuery(`DELETE FROM BOMMaterials WHERE bomId = '${bomRowId}'`);
    await bomTable.deleteRow(bomRowId);

    return res.status(200).json({ success: true, message: "BOM deleted successfully" });
  } catch (error) {
    console.error("Error deleting BOM:", error);
    return res.status(500).json({ success: false, message: "Failed to delete BOM", error: error.message });
  }
};

export const deleteBOMItem = async (req, res) => {
  try {
    const catalystApp = req.catalystApp;
    const zcql = catalystApp.zcql();
    const materialsTable = catalystApp.datastore().table("BOMMaterials");

    const { bomId, itemCode } = req.params;

    const result = await zcql.executeZCQLQuery(
      `SELECT ROWID FROM BOMMaterials WHERE bomId = (SELECT ROWID FROM BillOfMaterials WHERE bomId = '${bomId}') AND itemCode = '${itemCode}'`
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Item not found in BOM" });
    }

    const rowId = result[0].BOMMaterials.ROWID;
    await materialsTable.deleteRow(rowId);

    return res.status(200).json({ success: true, message: "Item deleted from BOM" });
  } catch (error) {
    console.error("Error deleting BOM item:", error);
    return res.status(500).json({ success: false, message: "Failed to delete BOM item", error: error.message });
  }
};
