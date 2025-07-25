
export const getEnquiry = async (req, res) => {
  const catalystApp = req.catalystApp;
  try {
    const zcql = catalystApp.zcql();

    const query = `SELECT * 
      FROM Enquiries`
    const records = await zcql.executeZCQLQuery(query);
    
    return res.status(200).json({
      message: "Enquiries fetched successfully!",
      records
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch enquiries.",
      error: error.message
    });
  }
};

export const createEnquiry = async (req, res) => {
  const catalystApp = req.catalystApp;

  try {
    const datastore = catalystApp.datastore();
    const table = datastore.table('Enquiries');

    const {
      customer,
      contactPerson,
      phone,
      email,
      address,
      city,
      state,
      zipCode,
      industry,
      product,
      quantity,
      specs,
      drawings,
      expectedDelivery,
      projectTimeline,
      budget,
      preferredMaterial,
      additionalServices,
      referenceSource,
      notes
    } = req.body;

    const rowData = {
      customer: customer,
      contactPerson: contactPerson,
      phone: phone,
      email: email,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      industry: industry,
      product: product,
      quantity: quantity,
      specs: specs,
      drawings: drawings,
      expectedDelivery: expectedDelivery,
      projectTimeline: projectTimeline,
      budget: budget,
      preferredMaterial: preferredMaterial,
      additionalServices: additionalServices,
      referenceSource: referenceSource,
      notes: notes
    }

    const insertedRow = await table.insertRow(rowData);
    res.json(insertedRow);

    
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Failed to insert data");
  }
};

export const updateEnquiry = async (req, res) => {
  const catalystApp = req.catalystApp;
  try {
    const datastore = catalystApp.datastore();
    const table = datastore.table('Enquiries');

    const { rowId } = req.params;

    if (!rowId) {
      return res.status(400).json({ error: 'Missing rowId in params' });
    }

    const {
      customer,
      contactPerson,
      phone,
      email,
      address,
      city,
      state,
      zipCode,
      industry,
      product,
      quantity,
      specs,
      drawings,
      expectedDelivery,
      projectTimeline,
      budget,
      preferredMaterial,
      additionalServices,
      referenceSource,
      notes
    } = req.body;

    const rowData = {
      ROWID: rowId,
      customer: customer,
      contactPerson: contactPerson,
      phone: phone,
      email: email,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      industry: industry,
      product: product,
      quantity: quantity,
      specs: specs,
      drawings: drawings,
      expectedDelivery: expectedDelivery,
      projectTimeline: projectTimeline,
      budget: budget,
      preferredMaterial: preferredMaterial,
      additionalServices: additionalServices,
      referenceSource: referenceSource,
      notes: notes
    }

    const updatedRow = await table.updateRow(rowData);
    res.json(updatedRow);

    
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Failed to update data");
  }
};

export const deleteEnquiry = async(req, res) => {
  const catalystApp = req.catalystApp;

  try {
    const datastore = catalystApp.datastore();
    const table = datastore.table('Enquiries');

    const { rowId } = req.params;
    
    if(!rowId) {
      return res.status(400).json({error: "Missing rowId in params"})
    }

    await table.deleteRow(rowId);

    res.status(200).json({message: `Enquiry with rowId : ${rowId} deleted successfully`})
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).send("Failed to delete enquiry");
  }
}