
export const createMetric = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('MetricCreator');
 
  const {
    // metricName,
    // type,
    // category,
    // unit,
    // targetValue,
    // description,
    // formulaCalculation,
       itemName,
      itemCode,
      category,
      description,
      unitOfMeasure,
      price,
      currentStock
  } = req.body;
 
  // if (!metricName || !type || !category || !unit || targetValue == null) {
  //   return res.status(400).json({ error: 'Missing required fields' });
  // }
 
  const now = new Date();
 
  const rowData = {
    metricName : itemName,
    type : itemCode,
    category : category,
    unit : String(currentStock),
    // targetValue,
    description: description || null,
    // formulaCalculation: formulaCalculation || null,
    //createdAt: now,
    //updatedAt: now,
  };
 
  try {
    const insertedRow = await table.insertRow(rowData);
    res.status(201).json(insertedRow);
  } catch (error) {
    console.error("Error creating metric:", error);
    res.status(500).send("Failed to create metric");
  }
};
 
export const getMetrics = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('Items');
 
  try {
    const rows = await table.getAllRows();
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).send("Failed to retrieve metrics");
  }
};
 
export const updateMetric = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('Items');
 
  const { metricName } = req.params;
  if (!metricName) return res.status(400).json({ error: 'metricName is required in params' });
 
  try {
    const rows = await table.getRows({ criteria: { metricName } });
    if (!rows.length) return res.status(404).json({ error: 'Metric not found' });
 
    const rowId = rows[0].ROWID;
 
    const updatedData = {
      ...req.body,
      updatedAt: new Date()
    };
 
    const updatedRow = await table.updateRow(rowId, updatedData);
    res.status(200).json(updatedRow);
  } catch (error) {
    console.error("Error updating metric:", error);
    res.status(500).send("Failed to update metric");
  }
};
 
export const deleteMetric = async (req, res) => {
  const catalystApp = req.catalystApp;
  const datastore = catalystApp.datastore();
  const table = datastore.table('Items');
 
  const { metricName } = req.params;
  if (!metricName) return res.status(400).json({ error: 'metricName is required in params' });
 
  try {
    const rows = await table.getRows({ criteria: { metricName } });
    if (!rows.length) return res.status(404).json({ error: 'Metric not found' });
 
    const rowId = rows[0].ROWID;
    await table.deleteRow(rowId);
 
    res.json({ message: `Metric '${metricName}' deleted successfully` });
  } catch (error) {
    console.error("Error deleting metric:", error);
    res.status(500).send("Failed to delete metric");
  }
};