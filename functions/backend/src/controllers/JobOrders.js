

// Helper function to generate order number (assuming you have this)
const generateOrderNumber = () => {
  return `JO${Date.now().toString().slice(-6)}`;
};

export const getJobOrder = async (req, res) => {
  const catalystApp = req.catalystApp;
  try {
    const zcql = catalystApp.zcql();
    
    // Get main job orders
    const jobOrderQuery = `SELECT * FROM JobOrders`;
    const jobOrders = await zcql.executeZCQLQuery(jobOrderQuery);
    
    // Get all related subform data
    const rawMaterialsQuery = `SELECT * FROM JobOrderRawMaterials`;
    const timeTrackingQuery = `SELECT * FROM JobOrderTimeTracking`;
    const componentsQuery = `SELECT * FROM JobOrderComponents`;
    const processStepsQuery = `SELECT * FROM JobOrderProcessSteps`;
    const subFormsQuery = `SELECT * FROM JobOrderSubForms`;
    
    const [rawMaterials, timeTracking, components, processSteps, subForms] = await Promise.all([
      zcql.executeZCQLQuery(rawMaterialsQuery),
      zcql.executeZCQLQuery(timeTrackingQuery),
      zcql.executeZCQLQuery(componentsQuery),
      zcql.executeZCQLQuery(processStepsQuery),
      zcql.executeZCQLQuery(subFormsQuery)
    ]);
    
    // Combine data
    const enrichedJobOrders = jobOrders.map(jobOrder => ({
      ...jobOrder,
      rawMaterials: rawMaterials.filter(rm => rm.jobOrderId === jobOrder.ROWID),
      timeTracking: timeTracking.filter(tt => tt.jobOrderId === jobOrder.ROWID),
      components: components.filter(c => c.jobOrderId === jobOrder.ROWID),
      processSteps: processSteps.filter(ps => ps.jobOrderId === jobOrder.ROWID),
      subForms: subForms.filter(sf => sf.jobOrderId === jobOrder.ROWID)
    }));
    
    return res.status(200).json({
      message: "Job Orders fetched successfully!",
      records: enrichedJobOrders
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch Job Orders.",
      error: error.message
    });
  }
};

export const createJobOrder = async (req, res) => {
  const catalystApp = req.catalystApp;

  try {
    const datastore = catalystApp.datastore();
    const jobOrderTable = datastore.table('JobOrders');
    const rawMaterialsTable = datastore.table('JobOrderRawMaterials');
    const timeTrackingTable = datastore.table('JobOrderTimeTracking');
    const componentsTable = datastore.table('JobOrderComponents');
    const processStepsTable = datastore.table('JobOrderProcessSteps');
    const subFormsTable = datastore.table('JobOrderSubForms');

    const {
      // Main job order fields
      project,
      client,
      startDate,
      endDate,
      status,
      priorityJO,
      description,
      estimatedCost,
      actualCost,
      assignedTo,
      department,
      notes,
      jobCenter,
      expectedDuration,
      product,
      quantity,
      lotSerialNumber,
      manufacturingOrder,
      finishedGood,
      stage,
      // Subform data
      rawMaterials = [],
      timeTracking = [],
      components = [],
      processSteps = {},
      subForms = []
    } = req.body;

    const jobOrderId = generateOrderNumber();

    // Validation
    if (!jobOrderId || !project || !client || !startDate || !endDate || !status || !priorityJO) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const allowedStatuses = ['Pending', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
    const allowedPriorities = ['Low', 'Medium', 'High', 'Critical'];

    if (!allowedStatuses.includes(status) || !allowedPriorities.includes(priorityJO)) {
      return res.status(400).json({ error: 'Invalid status or priority value' });
    }


    // Create main job order
    const jobOrderData = {
      jobOrderId,
      project,
      client,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      priorityJO,
      description: description || null,
      estimatedCost: estimatedCost || 0,
      actualCost: actualCost || 0,
      assignedTo: assignedTo || null,
      department: department || null,
      notes: notes || null,
      jobCenter: jobCenter || null,
      expectedDuration: expectedDuration || 0,
      product: product || null,
      quantity: quantity || 0,
      lotSerialNumber: lotSerialNumber || null,
      manufacturingOrder: manufacturingOrder || null,
      finishedGood: finishedGood || null,
      stage: stage || null,
      //createdAt: now,
      //updatedAt: now
    };

    const insertedJobOrder = await jobOrderTable.insertRow(jobOrderData);
    const jobOrderRowId = insertedJobOrder.ROWID;

    // Insert Raw Materials
    const rawMaterialPromises = rawMaterials.map(material => {
      return rawMaterialsTable.insertRow({
        jobOrderId: jobOrderRowId,
        itemName: material.itemName,
        quantity: material.quantity || 0,
        unitPrice: material.unitPrice || 0,
        totalCost: material.totalCost || 0,
        //createdAt: now
      });
    });

    // Insert Time Tracking
    const timeTrackingPromises = timeTracking.map(track => {
      return timeTrackingTable.insertRow({
        jobOrderId: jobOrderRowId,
        employee: track.employee,
        duration: track.duration || 0,
        startDate: track.startDate ? new Date(track.startDate) : null,
        endDate: track.endDate ? new Date(track.endDate) : null,
        productivity: track.productivity || 0,
        //createdAt: now
      });
    });

    // Insert Components
    const componentPromises = components.map(component => {
      return componentsTable.insertRow({
        jobOrderId: jobOrderRowId,
        product: component.product,
        toConsume: component.toConsume || 0,
        quantity: component.quantity || 0,
        consumed: component.consumed || 0,
        onHand: component.onHand || 0,
        forecasted: component.forecasted || 0,
        //createdAt: now
      });
    });

    // Insert Process Steps
    const processStepPromises = Object.entries(processSteps).map(([stepName, stepStatus]) => {
      return processStepsTable.insertRow({
        jobOrderId: jobOrderRowId,
        stepName,
        stepStatus,
        //createdAt: now
      });
    });

    // Insert SubForms
    const subFormPromises = subForms.map(subForm => {
      return subFormsTable.insertRow({
        jobOrderId: jobOrderRowId,
        moistureLevel: subForm.moistureLevel || null,
        densityCheck: subForm.densityCheck || null,
        //createdAt: now
      });
    });

    // Execute all insertions
    await Promise.all([
      ...rawMaterialPromises,
      ...timeTrackingPromises,
      ...componentPromises,
      ...processStepPromises,
      ...subFormPromises
    ]);

    res.status(201).json({
      message: "Job Order created successfully with all subforms",
      jobOrder: insertedJobOrder,
      jobOrderId
    });

  } catch (error) {
    console.error("Error creating job order:", error);
    res.status(500).json({
      message: "Failed to create job order",
      error: error.message
    });
  }
};

export const updateJobOrder = async (req, res) => {
  const catalystApp = req.catalystApp;

  try {
    const { orderNumber } = req.params;
    const {
      // Main job order fields
      jobOrderId,
      project,
      client,
      startDate,
      endDate,
      status,
      priority,
      description,
      estimatedCost,
      actualCost,
      assignedTo,
      department,
      notes,
      jobCenter,
      expectedDuration,
      product,
      quantity,
      lotSerialNumber,
      manufacturingOrder,
      finishedGood,
      stage,
      // Subform data
      rawMaterials = [],
      timeTracking = [],
      components = [],
      processSteps = {},
      subForms = []
    } = req.body;

    if (!orderNumber) {
      return res.status(400).json({ error: 'orderNumber is required in URL' });
    }

    const datastore = catalystApp.datastore();
    const jobOrderTable = datastore.table('JobOrders');
    const rawMaterialsTable = datastore.table('JobOrderRawMaterials');
    const timeTrackingTable = datastore.table('JobOrderTimeTracking');
    const componentsTable = datastore.table('JobOrderComponents');
    const processStepsTable = datastore.table('JobOrderProcessSteps');
    const subFormsTable = datastore.table('JobOrderSubForms');

    // Find the job order
    const rows = await jobOrderTable.getRows({ criteria: { orderNumber } });
    if (!rows.length) return res.status(404).json({ error: 'Job Order not found' });

    const jobOrderRowId = rows[0].ROWID;
    const now = new Date();

    // Update main job order
    const updatedJobOrderData = {
      jobOrderId,
      project,
      client,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      priority,
      description: description || null,
      estimatedCost: estimatedCost || 0,
      actualCost: actualCost || 0,
      assignedTo: assignedTo || null,
      department: department || null,
      notes: notes || null,
      jobCenter: jobCenter || null,
      expectedDuration: expectedDuration || 0,
      product: product || null,
      quantity: quantity || 0,
      lotSerialNumber: lotSerialNumber || null,
      manufacturingOrder: manufacturingOrder || null,
      finishedGood: finishedGood || null,
      stage: stage || null,
      updatedAt: now
    };

    const updatedJobOrder = await jobOrderTable.updateRow(jobOrderRowId, updatedJobOrderData);

    // Delete existing subform data
    const zcql = catalystApp.zcql();
    await Promise.all([
      zcql.executeZCQLQuery(`DELETE FROM JobOrderRawMaterials WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderTimeTracking WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderComponents WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderProcessSteps WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderSubForms WHERE jobOrderId = ${jobOrderRowId}`)
    ]);

    // Insert updated subform data (same logic as create)
    const rawMaterialPromises = rawMaterials.map(material => {
      return rawMaterialsTable.insertRow({
        jobOrderId: jobOrderRowId,
        itemName: material.itemName,
        quantity: material.quantity || 0,
        unitPrice: material.unitPrice || 0,
        totalCost: material.totalCost || 0,
        createdAt: now
      });
    });

    const timeTrackingPromises = timeTracking.map(track => {
      return timeTrackingTable.insertRow({
        jobOrderId: jobOrderRowId,
        employee: track.employee,
        duration: track.duration || 0,
        startDate: track.startDate ? new Date(track.startDate) : null,
        endDate: track.endDate ? new Date(track.endDate) : null,
        productivity: track.productivity || 0,
        createdAt: now
      });
    });

    const componentPromises = components.map(component => {
      return componentsTable.insertRow({
        jobOrderId: jobOrderRowId,
        product: component.product,
        toConsume: component.toConsume || 0,
        quantity: component.quantity || 0,
        consumed: component.consumed || 0,
        onHand: component.onHand || 0,
        forecasted: component.forecasted || 0,
        createdAt: now
      });
    });

    const processStepPromises = Object.entries(processSteps).map(([stepName, stepStatus]) => {
      return processStepsTable.insertRow({
        jobOrderId: jobOrderRowId,
        stepName,
        stepStatus,
        createdAt: now
      });
    });

    const subFormPromises = subForms.map(subForm => {
      return subFormsTable.insertRow({
        jobOrderId: jobOrderRowId,
        moistureLevel: subForm.moistureLevel || null,
        densityCheck: subForm.densityCheck || null,
        createdAt: now
      });
    });

    await Promise.all([
      ...rawMaterialPromises,
      ...timeTrackingPromises,
      ...componentPromises,
      ...processStepPromises,
      ...subFormPromises
    ]);

    res.json({
      message: "Job Order updated successfully with all subforms",
      jobOrder: updatedJobOrder
    });

  } catch (error) {
    console.error("Error updating job order:", error);
    res.status(500).json({
      message: "Failed to update job order",
      error: error.message
    });
  }
};

export const deleteJobOrder = async (req, res) => {
  const catalystApp = req.catalystApp;

  try {
    const { orderNumber } = req.params;

    if (!orderNumber) return res.status(400).json({ error: 'orderNumber is required in URL' });

    const datastore = catalystApp.datastore();
    const jobOrderTable = datastore.table('JobOrders');

    const rows = await jobOrderTable.getRows({ criteria: { orderNumber } });
    if (!rows.length) return res.status(404).json({ error: 'Job Order not found' });

    const jobOrderRowId = rows[0].ROWID;

    // Delete all related subform data first
    const zcql = catalystApp.zcql();
    await Promise.all([
      zcql.executeZCQLQuery(`DELETE FROM JobOrderRawMaterials WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderTimeTracking WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderComponents WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderProcessSteps WHERE jobOrderId = ${jobOrderRowId}`),
      zcql.executeZCQLQuery(`DELETE FROM JobOrderSubForms WHERE jobOrderId = ${jobOrderRowId}`)
    ]);

    // Delete the main job order
    await jobOrderTable.deleteRow(jobOrderRowId);

    res.json({ 
      message: `Job Order ${orderNumber} and all related data deleted successfully` 
    });

  } catch (error) {
    console.error("Error deleting job order:", error);
    res.status(500).json({
      message: "Failed to delete job order",
      error: error.message
    });
  }
};

// Additional helper endpoints for individual subform management

export const getJobOrderWithSubforms = async (req, res) => {
  const catalystApp = req.catalystApp;
  const { orderNumber } = req.params;

  try {
    const zcql = catalystApp.zcql();
    
    // Get main job order
    const jobOrderQuery = `SELECT * FROM JobOrders WHERE orderNumber = '${orderNumber}'`;
    const jobOrders = await zcql.executeZCQLQuery(jobOrderQuery);
    
    if (!jobOrders.length) {
      return res.status(404).json({ error: 'Job Order not found' });
    }
    
    const jobOrder = jobOrders[0];
    const jobOrderId = jobOrder.ROWID;
    
    // Get all subform data
    const [rawMaterials, timeTracking, components, processSteps, subForms] = await Promise.all([
      zcql.executeZCQLQuery(`SELECT * FROM JobOrderRawMaterials WHERE jobOrderId = ${jobOrderId}`),
      zcql.executeZCQLQuery(`SELECT * FROM JobOrderTimeTracking WHERE jobOrderId = ${jobOrderId}`),
      zcql.executeZCQLQuery(`SELECT * FROM JobOrderComponents WHERE jobOrderId = ${jobOrderId}`),
      zcql.executeZCQLQuery(`SELECT * FROM JobOrderProcessSteps WHERE jobOrderId = ${jobOrderId}`),
      zcql.executeZCQLQuery(`SELECT * FROM JobOrderSubForms WHERE jobOrderId = ${jobOrderId}`)
    ]);
    
    const enrichedJobOrder = {
      ...jobOrder,
      rawMaterials,
      timeTracking,
      components,
      processSteps,
      subForms
    };
    
    res.json({
      message: "Job Order with subforms fetched successfully",
      jobOrder: enrichedJobOrder
    });
    
  } catch (error) {
    console.error("Error fetching job order with subforms:", error);
    res.status(500).json({
      message: "Failed to fetch job order with subforms",
      error: error.message
    });
  }
};