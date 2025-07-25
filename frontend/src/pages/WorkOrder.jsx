// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Manufacturing Tracker</title>
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
// </head>

// <body class="body-container">

//   <div class="header">
//     <h1>Manufacturing Tracker</h1>
//   </div>

//   <div class="tabs">
//     <div class="tab" data-tab="createWorkOrder">Create Work Order</div>
//     <div class="tab" data-tab="injection">Injection</div>
//     <div class="tab" data-tab="blow">Blow Moulding</div>
//     <div class="tab" data-tab="mixing">Mixing</div>
//     <div class="tab" data-tab="refills">Refills</div>
//   </div>

//   <div class="progress-container">
//     <div class="progress-bar" id="progressBar"></div>
//   </div>

//   <div class="stage-container">

//     <!-- ✅ Create Work Order Tab -->
// <div class="tab-content" id="createWorkOrder">
//   <h2>BOM Information</h2>
//   <div class="form-divider"></div>

//   <div class="form-grid">
//       <!-- Row 1 -->
//       <div class="form-group">
//         <label for="workOrderId">Work Order ID</label>
//         <input type="text" id="workOrderId" value="WO-INJ-2024-001" readonly />
//       </div>

//       <div class="form-group">
//         <label for="product">Product / SKU</label>
//         <select id="product">
//           <option>Select Product</option>
//           <option>Product A</option>
//           <option>Product B</option>
//         </select>
//       </div>

//       <div class="form-group">
//         <label for="batchNumber">Batch Number</label>
//         <input type="text" id="batchNumber" value="B-INJ-240101-001" readonly />
//       </div>

//       <div class="form-group">
//   <label for="salesOrder">Sales Order No.</label>
//   <input type="text" id="salesOrder" placeholder="SO-2024-0123" />
// </div>



//       <!-- Row 2 -->
//       <div class="form-group">
//         <label for="operator">Operator Name</label>
//         <select id="operator">
//           <option>Select Operator</option>
//           <option>John Doe</option>
//           <option>Jane Smith</option>
//         </select>
//       </div>

//       <div class="form-group">
//         <label for="shift">Shift</label>
//         <select id="shift">
//           <option>Select Shift</option>
//           <option>Morning</option>
//           <option>Evening</option>
//           <option>Night</option>
//         </select>
//       </div>

//       <div class="form-group">
//   <label for="productionQty">Production Quantity</label>
//   <input type="text" id="productionQty" placeholder="Enter Quantity" />
// </div>

// <div class="form-group">
//   <label for="productionQty">BOM Reference No.</label>
//   <input type="text" id="bomReference" placeholder="Enter BOM REF No." />
// </div>

//       <div class="form-group">
//         <label for="date">Date</label>
//         <input type="date" id="date" value="2025-06-26" />
//       </div>
//     </div><br><br>

//   <!-- Inventory Items -->
//   <h3>Inventory Items</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Product</th>
//         <th>SKU</th>
//         <th>Req Qty</th>
//         <th>Unit</th>
//         <th>Cost Price/unit</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-items-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-items-body', ['text','text','number','text','number'])">➕ Add New</div>

//   <hr style="margin-top: 30px;">

//   <!-- Non Inventory Items -->
//   <h3>Non Inventory Items</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Product</th>
//         <th>Req Qty</th>
//         <th>Cost Price/unit</th>
//         <th>Total Cost</th>
//       </tr>
//     </thead>
//     <tbody id="non-inventory-items-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('non-inventory-items-body', ['text','number','number','number'])">➕ Add New</div>

//   <hr style="margin-top: 30px;">

//   <!-- Consumables -->
//   <h3>Consumable</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Consumable Goods</th>
//         <th>Unit Price</th>
//         <th>Quantity</th>
//         <th>Total Price</th>
//       </tr>
//     </thead>
//     <tbody id="consumables-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('consumables-body', ['text','number','number','number'])">➕ Add New</div>

//   <!-- Save & Next -->
//   <div style="text-align: center; margin-top: 20px;">
//     <button id="createWorkOrderNextBtn" class="next-button enabled">Save & Next</button>
//   </div>
// </div>


//     <!-- ✅ Injection Tab -->
// <div class="tab-content" id="injection">
//   <div class="stage-buttons"></div>

//   <!-- Stage 0: QC Raw Materials -->
//   <div class="form-card" data-stage-index="0" style="margin-bottom: 12px;">
//     <h2>Quality Control - Raw Materials</h2>
//     <div class="form-divider"></div>
//     <div class="form-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 12px;">
//       <div class="form-group">
//         <label for="qcWorkOrderId">Work Order ID</label>
//         <input type="text" id="qcWorkOrderId" value="Auto-filled" readonly
//           style="background: linear-gradient(135deg, #e0e7ff, #f5f5ff); color: #555; font-style: italic;" />
//       </div>
//       <div class="form-group">
//         <label for="rawMaterialType">Raw Material Type</label>
//         <select id="rawMaterialType">
//           <option>Select Material</option>
//           <option>HDPE</option>
//           <option>LDPE</option>
//           <option>PP</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="supplier">Supplier</label>
//         <select id="supplier">
//           <option>Select Supplier</option>
//           <option>Supplier A</option>
//           <option>Supplier B</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="lotNumber">Lot Number</label>
//         <input type="text" id="lotNumber" placeholder="LOT-2024-001" />
//       </div>
//       <div class="form-group">
//         <label for="qcTestResult">QC Test Result</label>
//         <select id="qcTestResult">
//           <option>Select Result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcOfficer">QC Officer Name</label>
//         <select id="qcOfficer">
//           <option>Select QC Officer</option>
//           <option>Mr. Raj</option>
//           <option>Ms. Neha</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcDate">Date</label>
//         <input type="date" id="qcDate" value="2025-06-26" />
//       </div>
//       <div class="form-group" style="grid-column: 1 / -1;">
//         <label for="qcNotes">Notes</label>
//         <textarea id="qcNotes" rows="3" placeholder="Enter any additional notes..."></textarea>
//       </div>
//     </div>
//     <br>
//     <br>
//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>


//   <!-- Stage 1: Raw Material Loading -->
//   <div class="form-card" data-stage-index="1" style="margin-bottom: 12px;">
//     <h2>Raw Material Loading</h2>
//     <div class="form-divider"></div>
//     <div class="form-grid">
//       <div class="form-group">
//         <label for="qcWorkOrderId">Work Order ID</label>
//         <input type="text" id="qcWorkOrderId" value="Auto-filled" readonly
//           style="background: linear-gradient(135deg, #e0e7ff, #f5f5ff); color: #555; font-style: italic;" />
//       </div>
//       <div class="form-group">
//         <label for="rawMaterialType">Raw Material Type</label>
//         <select id="rawMaterialType">
//           <option>Select Material</option>
//           <option>HDPE</option>
//           <option>LDPE</option>
//           <option>PP</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="supplier">Supplier</label>
//         <select id="supplier">
//           <option>Select Supplier</option>
//           <option>Supplier A</option>
//           <option>Supplier B</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="lotNumber">Lot Number</label>
//         <input type="text" id="lotNumber" placeholder="LOT-2024-001" />
//       </div>
//       <div class="form-group">
//         <label for="qcTestResult">QC Test Result</label>
//         <select id="qcTestResult">
//           <option>Select Result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcOfficer">QC Officer Name</label>
//         <select id="qcOfficer">
//           <option>Select QC Officer</option>
//           <option>Mr. Raj</option>
//           <option>Ms. Neha</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcDate">Date</label>
//         <input type="date" id="qcDate" value="2025-06-26" />
//       </div>
//       <div class="form-group" style="grid-column: 1 / -1;">
//         <label for="qcNotes">Notes</label>
//         <textarea id="qcNotes" rows="3" placeholder="Enter any additional notes..."></textarea>
//       </div>
//     </div>

//     <br>
//     <br>

//   <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>


//   <!-- Stage 2: Heating and Injection -->
//   <div class="form-card" data-stage-index="2" style="margin-bottom: 12px;">
//     <h2>Heating and Injection</h2>
//     <div class="form-divider"></div>
//     <div class="form-grid">
//       <div class="form-group">
//         <label for="qcWorkOrderId">Work Order ID</label>
//         <input type="text" id="qcWorkOrderId" value="Auto-filled" readonly
//           style="background: linear-gradient(135deg, #e0e7ff, #f5f5ff); color: #555; font-style: italic;" />
//       </div>
//       <div class="form-group">
//         <label for="rawMaterialType">Raw Material Type</label>
//         <select id="rawMaterialType">
//           <option>Select Material</option>
//           <option>HDPE</option>
//           <option>LDPE</option>
//           <option>PP</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="supplier">Supplier</label>
//         <select id="supplier">
//           <option>Select Supplier</option>
//           <option>Supplier A</option>
//           <option>Supplier B</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="lotNumber">Lot Number</label>
//         <input type="text" id="lotNumber" placeholder="LOT-2024-001" />
//       </div>
//       <div class="form-group">
//         <label for="qcTestResult">QC Test Result</label>
//         <select id="qcTestResult">
//           <option>Select Result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcOfficer">QC Officer Name</label>
//         <select id="qcOfficer">
//           <option>Select QC Officer</option>
//           <option>Mr. Raj</option>
//           <option>Ms. Neha</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcDate">Date</label>
//         <input type="date" id="qcDate" value="2025-06-26" />
//       </div>
//       <div class="form-group" style="grid-column: 1 / -1;">
//         <label for="qcNotes">Notes</label>
//         <textarea id="qcNotes" rows="3" placeholder="Enter any additional notes..."></textarea>
//       </div>
//     </div>
//     <br>
//     <br>

//   <h3>Operations</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-heating-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-heating-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>


//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>
    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>

//   <!-- Stage 3: Cooling -->
//   <div class="form-card" data-stage-index="3" style="margin-bottom: 12px;">
//     <h2>Cooling</h2>
//     <div class="form-divider"></div>
//     <div class="form-grid">
//       <div class="form-group">
//         <label for="qcWorkOrderId">Work Order ID</label>
//         <input type="text" id="qcWorkOrderId" value="Auto-filled" readonly
//           style="background: linear-gradient(135deg, #e0e7ff, #f5f5ff); color: #555; font-style: italic;" />
//       </div>
//       <div class="form-group">
//         <label for="rawMaterialType">Raw Material Type</label>
//         <select id="rawMaterialType">
//           <option>Select Material</option>
//           <option>HDPE</option>
//           <option>LDPE</option>
//           <option>PP</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="supplier">Supplier</label>
//         <select id="supplier">
//           <option>Select Supplier</option>
//           <option>Supplier A</option>
//           <option>Supplier B</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="lotNumber">Lot Number</label>
//         <input type="text" id="lotNumber" placeholder="LOT-2024-001" />
//       </div>
//       <div class="form-group">
//         <label for="qcTestResult">QC Test Result</label>
//         <select id="qcTestResult">
//           <option>Select Result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcOfficer">QC Officer Name</label>
//         <select id="qcOfficer">
//           <option>Select QC Officer</option>
//           <option>Mr. Raj</option>
//           <option>Ms. Neha</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcDate">Date</label>
//         <input type="date" id="qcDate" value="2025-06-26" />
//       </div>
//       <div class="form-group" style="grid-column: 1 / -1;">
//         <label for="qcNotes">Notes</label>
//         <textarea id="qcNotes" rows="3" placeholder="Enter any additional notes..."></textarea>
//       </div>
//     </div>
//     <br>
//     <br>

//     <h3>Operations</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-cooling-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-cooling-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>


//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>


//   <!-- Stage 4: Ejection and Trimming -->
//   <div class="form-card" data-stage-index="4" style="margin-bottom: 12px;">
//     <h2>Ejection and Trimming</h2>
//     <div class="form-divider"></div>
//     <div class="form-grid">
//       <div class="form-group">
//         <label for="qcWorkOrderId">Work Order ID</label>
//         <input type="text" id="qcWorkOrderId" value="Auto-filled" readonly
//           style="background: linear-gradient(135deg, #e0e7ff, #f5f5ff); color: #555; font-style: italic;" />
//       </div>
//       <div class="form-group">
//         <label for="rawMaterialType">Raw Material Type</label>
//         <select id="rawMaterialType">
//           <option>Select Material</option>
//           <option>HDPE</option>
//           <option>LDPE</option>
//           <option>PP</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="supplier">Supplier</label>
//         <select id="supplier">
//           <option>Select Supplier</option>
//           <option>Supplier A</option>
//           <option>Supplier B</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="lotNumber">Lot Number</label>
//         <input type="text" id="lotNumber" placeholder="LOT-2024-001" />
//       </div>
//       <div class="form-group">
//         <label for="qcTestResult">QC Test Result</label>
//         <select id="qcTestResult">
//           <option>Select Result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcOfficer">QC Officer Name</label>
//         <select id="qcOfficer">
//           <option>Select QC Officer</option>
//           <option>Mr. Raj</option>
//           <option>Ms. Neha</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcDate">Date</label>
//         <input type="date" id="qcDate" value="2025-06-26" />
//       </div>
//       <div class="form-group" style="grid-column: 1 / -1;">
//         <label for="qcNotes">Notes</label>
//         <textarea id="qcNotes" rows="3" placeholder="Enter any additional notes..."></textarea>
//       </div>
//     </div>
//     <br>
//     <br>

//     <h3>Operations</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-ejection-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-ejection-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>


//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>

//   <!-- Stage 5: QC Inspection -->
//   <div class="form-card" data-stage-index="5" style="margin-bottom: 12px;">
//     <h2>QC Inspection</h2>
//     <div class="form-divider"></div>
//     <div class="form-grid">
//       <div class="form-group">
//         <label for="qcWorkOrderId">Work Order ID</label>
//         <input type="text" id="qcWorkOrderId" value="Auto-filled" readonly
//           style="background: linear-gradient(135deg, #e0e7ff, #f5f5ff); color: #555; font-style: italic;" />
//       </div>
//       <div class="form-group">
//         <label for="rawMaterialType">Raw Material Type</label>
//         <select id="rawMaterialType">
//           <option>Select Material</option>
//           <option>HDPE</option>
//           <option>LDPE</option>
//           <option>PP</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="supplier">Supplier</label>
//         <select id="supplier">
//           <option>Select Supplier</option>
//           <option>Supplier A</option>
//           <option>Supplier B</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="lotNumber">Lot Number</label>
//         <input type="text" id="lotNumber" placeholder="LOT-2024-001" />
//       </div>
//       <div class="form-group">
//         <label for="qcTestResult">QC Test Result</label>
//         <select id="qcTestResult">
//           <option>Select Result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcOfficer">QC Officer Name</label>
//         <select id="qcOfficer">
//           <option>Select QC Officer</option>
//           <option>Mr. Raj</option>
//           <option>Ms. Neha</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="qcDate">Date</label>
//         <input type="date" id="qcDate" value="2025-06-26" />
//       </div>
//       <div class="form-group" style="grid-column: 1 / -1;">
//         <label for="qcNotes">Notes</label>
//         <textarea id="qcNotes" rows="3" placeholder="Enter any additional notes..."></textarea>
//       </div>
//     </div>
//     <br>
//     <br>

//     <h3>Operations</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-qc-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-qc-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>


//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" id="qcfinalnextbtn" disabled>Save & Next</button>
//     </div>
//   </div>


// </div>

//   <!-- blow tab -->

// <div class="tab-content" id="blow">
//   <div class="stage-buttons"></div>
  
//   <div class="form-card" data-stage-index="0">
//     <h2>Blow Process Information</h2>
//   <div class="form-divider"></div>
//     <div class="form-grid">
//       <!-- Row 1 -->
//       <div class="form-group">
//         <label for="workOrderId">Work Order ID</label>
//         <input type="text" id="workOrderId" value="WO-INJ-2024-001" readonly />
//       </div>

//       <div class="form-group">
//         <label for="product">Product / SKU</label>
//         <select id="product">
//           <option>Select Product</option>
//           <option>Product A</option>
//           <option>Product B</option>
//         </select>
//       </div>

//       <div class="form-group">
//         <label for="batchNumber">Batch Number</label>
//         <input type="text" id="batchNumber" value="B-INJ-240101-001" readonly />
//       </div>

//       <div class="form-group">
//   <label for="salesOrder">Sales Order No.</label>
//   <input type="text" id="salesOrder" placeholder="SO-2024-0123" />
//   </div>
  
//   </div>

//   <br><br>
//    <h3>Operations</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-blow1-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-blow1-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>


//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>

// <div class="form-card" data-stage-index="1">
//   <h2>Blow Process - 2 Information</h2>
//   <div class="form-divider"></div>
//     <div class="form-grid">
//       <!-- Row 1 -->
//       <div class="form-group">
//         <label for="workOrderId">Work Order ID</label>
//         <input type="text" id="workOrderId" value="WO-INJ-2024-001" readonly />
//       </div>

//       <div class="form-group">
//         <label for="product">Product / SKU</label>
//         <select id="product">
//           <option>Select Product</option>
//           <option>Product A</option>
//           <option>Product B</option>
//         </select>
//       </div>

//       <div class="form-group">
//         <label for="batchNumber">Batch Number</label>
//         <input type="text" id="batchNumber" value="B-INJ-240101-001" readonly />
//       </div>

//       <div class="form-group">
//   <label for="salesOrder">Sales Order No.</label>
//   <input type="text" id="salesOrder" placeholder="SO-2024-0123" />
//   </div>
  
//   </div>

//   <br><br>
//    <h3>Operations</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-blow2-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-blow2-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>


//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" id="blowFinalnxtbtn" disabled>Save & Next</button>
//     </div>
//   </div>



//   <div class="form-card" data-stage-index="2">
//   <h2>Blow Process - 3 Information</h2>
//   <div class="form-divider"></div>
//     <div class="form-grid">
//       <!-- Row 1 -->
//       <div class="form-group">
//         <label for="workOrderId">Work Order ID</label>
//         <input type="text" id="workOrderId" value="WO-INJ-2024-001" readonly />
//       </div>

//       <div class="form-group">
//         <label for="product">Product / SKU</label>
//         <select id="product">
//           <option>Select Product</option>
//           <option>Product A</option>
//           <option>Product B</option>
//         </select>
//       </div>

//       <div class="form-group">
//         <label for="batchNumber">Batch Number</label>
//         <input type="text" id="batchNumber" value="B-INJ-240101-001" readonly />
//       </div>

//       <div class="form-group">
//   <label for="salesOrder">Sales Order No.</label>
//   <input type="text" id="salesOrder" placeholder="SO-2024-0123" />
//   </div>
  
//   </div>

//   <br><br>
//    <h3>Operations</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-blow3-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-blow3-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>


//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>




// </div>


// <!-- Mixing Tab Content here: -->
//  <div class="tab-content" id="mixing">
//   <div class="stage-buttons"></div>

// <div class="form-card" data-stage-index="0">
//   <h2>Pre Heating Information</h2>
//   <div class="form-divider"></div>
//   <br><br>
//    <h3>Pre Heating</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-preheating-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-preheating-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>

//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>


//   <div class="form-card" data-stage-index="1">
//   <h2>Cooling Information</h2>
//   <div class="form-divider"></div>
//     <div class="form-card">
//       <!-- Row 1 -->
//       <h3>Cooling</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-cooling-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-cooling-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>
  
//   </div>

//   <br><br>

//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" disabled>Save & Next</button>
//     </div>
//   </div>


//   <div class="form-card" data-stage-index="2">
//   <h2>Heating Information</h2>
//   <div class="form-divider"></div>
//     <div class="form-card">
//       <h3>Heating</h3>
//   <table class="styled-table">
//     <thead>
//       <tr>
//         <th>Operation Name</th>
//         <th>Work Center</th>
//         <th>Start Time</th>
//         <th>End Time</th>
//         <th>Time Consumed</th>
//         <th>Production Status</th>
//       </tr>
//     </thead>
//     <tbody id="inventory-heating-body">
//       <!-- Rows will be dynamically added here -->
//     </tbody>
//   </table>
//   <div class="add-new-btn" onclick="addRow('inventory-heating-body', ['text','text','number','text','number','text'])">➕ Add New</div>
//   <br><br>
  
//   </div>

//   <br><br>

//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

    
//     <div class="completion-box">
//       <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//       <button class="next-button" id="mixingFinalnxtbtn" disabled>Save & Next</button>
//     </div>
//   </div>

//   </div>


//   <!-- Refill Tab Content here: -->

//   <div class="tab-content" id="refills">
//   <div class="stage-buttons"></div>

//   <!-- ✅ Stage 0 -->
//   <div class="form-card" data-stage-index="0">
//     <h2>Refill Process Information</h2>
//     <div class="form-divider"></div>
//     <div class="form-grid">
//       <div class="form-group">
//         <label for="workOrderId">Work Order ID</label>
//         <input type="text" id="workOrderId" value="WO-INJ-2024-001" readonly />
//       </div>
//       <div class="form-group">
//         <label for="product">Product / SKU</label>
//         <select id="product">
//           <option>Select Product</option>
//           <option>Product A</option>
//           <option>Product B</option>
//         </select>
//       </div>
//       <div class="form-group">
//         <label for="batchNumber">Batch Number</label>
//         <input type="text" id="batchNumber" value="B-INJ-240101-001" readonly />
//       </div>
//       <div class="form-group">
//         <label for="salesOrder">Sales Order No.</label>
//         <input type="text" id="salesOrder" placeholder="SO-2024-0123" />
//       </div>
//     </div><br><br>
  

//   <!-- ✅ Stage 1 to 10: Tables -->

//   <!-- Repeat the pattern below for stages 1 through 9, just change `data-stage-index` and table ID -->

  
//     <h3>Moulding</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Moulding Status</th>
          
          
          
//         </tr>
//       </thead>
//       <tbody id="inventory-molding-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-molding-body', ['text','text','text','text','text','text','text'])">➕ Add New</div>
//     <br>
//     <br>

//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>



// <div class="form-card" data-stage-index="1">
//     <h3>Preparation</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Preparation Status</th>
          
          
          
//         </tr>
//       </thead>
//       <tbody id="inventory-preparation-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-preparation-body', ['text','text','text','text','text','text','text'])">➕ Add New</div>
//     <br>
//     <br>

// <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>


// <div class="form-card" data-stage-index="2">
//     <h3>Filling</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Filling Status</th>
          
          
          
//         </tr>
//       </thead>
//       <tbody id="inventory-filling-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-filling-body', ['text','text','text','text','text','text','checkbox'])">➕ Add New</div>
//     <br>
//     <br>

// <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>


// <div class="form-card" data-stage-index="3">
//     <h3>Weighing</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Weighing Status</th>
//         </tr>
//       </thead>
//       <tbody id="inventory-weighing-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-weighing-body', ['text','text','text','text','text','text','checkbox'])">➕ Add New</div>
//     <br>
//     <br>

// <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>


// <div class="form-card" data-stage-index="4">
//     <h3>Capping</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Operation Complete</th>
//         </tr>
//       </thead>
//       <tbody id="inventory-capping-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-capping-body', ['text','text','text','text','text','text','checkbox'])">➕ Add New</div>
//     <br>
//     <br>

// <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>


// <div class="form-card" data-stage-index="5">
//     <h3>Labelling</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Operation Complete</th>
          
          
          
//         </tr>
//       </thead>
//       <tbody id="inventory-labelling-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-labelling-body', ['text','text','text','text','text','text','checkbox'])">➕ Add New</div>
//     <br>
//     <br>

//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>

// <div class="form-card" data-stage-index="6">
//     <h3>Crimping</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Operation Complete</th>
          
          
          
//         </tr>
//       </thead>
//       <tbody id="inventory-crimping-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-crimping-body', ['text','text','text','text','text','text','checkbox'])">➕ Add New</div>
//     <br>
//     <br>

// <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>

// <div class="form-card" data-stage-index="7">
//     <h3>Leakage Test</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Test-1</th>
//           <th>Test-2</th>
//           <th>Test-3</th>
//           <th>Test-4</th>
          
          
          
//         </tr>
//       </thead>
//       <tbody id="inventory-leakage-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-leakage-body', ['text','text','text','text','text','text','text'])">➕ Add New</div>
//     <br>
//     <br>

// <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>


// <div class="form-card" data-stage-index="8">
//     <h3>Cartoning</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Cartoning Status</th>
//         </tr>
//       </thead>
//       <tbody id="inventory-cartoning-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-cartoning-body', ['text','text','text','text','text','text','checkbox'])">➕ Add New</div>
//     <br>
//     <br>

// <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>

//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>

// <div class="form-card" data-stage-index="9">
//     <h3>Storage</h3>
//     <table class="styled-table">
//       <thead>
//         <tr>
//           <th>Operation Name</th>
//           <th>Operator Name</th>
//           <th>Work Center</th>
//           <th>Start Time</th>
//           <th>End Time</th>
//           <th>Time Consumed</th>
//           <th>Storage Status</th>
          
          
          
//         </tr>
//       </thead>
//       <tbody id="inventory-storage-body">
//         <!-- Dynamic rows -->
//       </tbody>
//     </table>
//     <div class="add-new-btn" onclick="addRow('inventory-storage-body', ['text','text','text','text','text','text','checkbox'])">➕ Add New</div>
//     <br>
//     <br>

//     <div class="qc-section">
//   <!-- 🔽 Header -->
//   <div class="section-toggle">
//     <div class="section-left">
//       <span class="section-icon"></span>
//       <span class="section-title">Quality Control Check</span>
//     </div>
//     <div class="section-right">
//       <span class="section-arrow">▲</span>
//     </div>
//   </div>

//   <!-- 🔧 Form Body -->
//   <div class="qc-form">
//     <div class="qc-grid">
//       <div class="form-group-qc">
//         <label>Work Order ID</label>
//         <input type="text" value="Auto-populated from Work Order Details" readonly
//                style="background: linear-gradient(to right, #e0e7ff, #f3f3ff); font-style: italic; color: #444;" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check Time</label>
//         <input type="datetime-local" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Officer</label>
//         <input type="text" placeholder="Enter QC officer name" />
//       </div>
//       <div class="form-group-qc">
//         <label>Material Condition</label>
//         <select>
//           <option>Select condition</option>
//           <option>Good</option>
//           <option>Damaged</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 1</label>
//         <input type="text" placeholder="Enter moisture %" />
//       </div>
//       <div class="form-group-qc">
//         <label>QC Check - 2</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//         </select>
//       </div>
//       <div class="form-group-qc">
//         <label>Overall QC Result</label>
//         <select>
//           <option>Select result</option>
//           <option>Pass</option>
//           <option>Fail</option>
//           <option>Conditional Pass</option>
//         </select>
//       </div>
//       <div class="form-group-qc" style="grid-column: 1 / -1;">
//         <label>QC Remarks</label>
//         <textarea rows="3" placeholder="Enter QC remarks"></textarea>
//       </div>
//     </div>
//   </div>
//   </div>
//   <br>
//     <br>
//      <div class="completion-box">
//     <label><input type="checkbox" class="complete-checkbox" /> Mark as Complete</label>
//     <button class="next-button" disabled>Save & Next</button>
//   </div>
// </div>




//   </div>

//   <!-- Continue similar div blocks for stages 2 to 9 -->
//   <!-- Update data-stage-index and tbody id uniquely for each -->

//   <!-- ✅ Completion Box (outside all stage-index divs, shown after last stage) -->
 



// </div>

 



//     <!-- Add Blow, Mixing, Refills tab-content as per your structure -->
//   </div>

//  <script>
//   const tabs = document.querySelectorAll('.tab');
//   const tabContents = document.querySelectorAll('.tab-content');
//   const progressBar = document.getElementById('progressBar');

//   const stagesMap = {
//     injection: ['QC – Raw Materials', 'Raw Material Loading', 'Heating & Injection', 'Cooling', 'Ejection and Trimming', 'QC Inspection'],
//     blow: ['Blow Process 1', 'Blow Process 2', 'Blow Process 3'],
//     mixing: ['Pre Heating', 'Cooling', 'Heating'],
//     refills: ['Molding', 'Preparation', 'Filling', 'Weighing', 'Capping', 'Labelling', 'Crimping', 'Leakage Test', 'Cartoning', 'Storage']
//   };

//   // Section toggle for every stage
//   document.querySelectorAll('.section-toggle').forEach((toggle) => {
//     const qcForm = toggle.nextElementSibling;
//     const sectionArrow = toggle.querySelector('.section-arrow');

//     qcForm.style.display = 'none';
//     sectionArrow.textContent = '▼';
//     sectionArrow.classList.add('rotate');

//     toggle.addEventListener('click', () => {
//       const isOpen = qcForm.style.display === 'block';
//       qcForm.style.display = isOpen ? 'none' : 'block';
//       sectionArrow.textContent = isOpen ? '▼' : '▲';
//       sectionArrow.classList.toggle('rotate', !isOpen);
//     });
//   });

//   // Add row function for all tables
//   function addRow(tableId, types) {
//     const tbody = document.getElementById(tableId);
//     if (!tbody) return;
//     const row = document.createElement('tr');
//     types.forEach(type => {
//       const td = document.createElement('td');
//       const input = document.createElement('input');
//       input.type = type;
//       td.appendChild(input);
//       row.appendChild(td);
//     });
//     tbody.appendChild(row);
//   }

//   let currentTab = localStorage.getItem('activeTab') || 'createWorkOrder';

//   function switchTab(tabId) {
//     tabContents.forEach(t => t.classList.remove('active'));
//     tabs.forEach(t => t.classList.remove('active'));
//     document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
//     document.getElementById(tabId).classList.add('active');
//     localStorage.setItem('activeTab', tabId);
//     if (stagesMap[tabId]) renderStages(tabId);
//   }

//   tabs.forEach(tab => {
//     tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
//   });

//   function renderStages(tabId) {
//     const tab = document.getElementById(tabId);
//     const stageContainer = tab.querySelector('.stage-buttons');
//     const stages = stagesMap[tabId];
//     const formCards = tab.querySelectorAll('[data-stage-index]');

//     let currentStage = 0;
//     stageContainer.innerHTML = '';
//     updateProgressBar(0, stages.length);

//     stages.forEach((stage, i) => {
//       const btn = document.createElement('button');
//       btn.className = 'stage-button';
//       btn.innerText = stage;
//       btn.disabled = true;

//       if (i === 0) {
//         btn.classList.add('active');
//         btn.disabled = false;
//         showStageForm(tab, 0);
//       }

//       btn.addEventListener('click', () => {
//         tab.querySelectorAll('.stage-button').forEach(b => b.classList.remove('active'));
//         btn.classList.add('active');
//         currentStage = i;
//         showStageForm(tab, i);
//       });

//       stageContainer.appendChild(btn);
//     });

//     // Reset Save & Next buttons for all stages
//     formCards.forEach((formCard, index) => {
//       const checkbox = formCard.querySelector('.complete-checkbox');
//       const nextBtn = formCard.querySelector('.next-button');

//       if (checkbox && nextBtn) {
//         checkbox.checked = false;
//         nextBtn.disabled = true;
//         nextBtn.classList.remove('enabled');

//         checkbox.addEventListener('change', () => {
//           nextBtn.disabled = !checkbox.checked;
//           nextBtn.classList.toggle('enabled', checkbox.checked);
//         });

//         nextBtn.addEventListener('click', () => {
//           const buttons = stageContainer.querySelectorAll('.stage-button');
//           buttons[index].classList.remove('active');
//           buttons[index].classList.add('completed');
//           buttons[index].disabled = true;

//           if (index + 1 < stages.length) {
//             buttons[index + 1].classList.add('active');
//             buttons[index + 1].disabled = false;
//             buttons[index + 1].click();
//           }

//           updateProgressBar(index + 1, stages.length);
//         });
//       }
//     });
//   }

//   function showStageForm(tabElement, index) {
//     const formSections = tabElement.querySelectorAll('[data-stage-index]');
//     formSections.forEach(f => f.style.display = 'none');
//     const activeForm = tabElement.querySelector(`[data-stage-index="${index}"]`);
//     if (activeForm) activeForm.style.display = 'block';
//   }

//   function updateProgressBar(current, total) {
//     const percent = (current / total) * 100;
//     progressBar.style.width = percent + '%';
//   }

//   // Switch to Injection tab
//   document.getElementById('createWorkOrderNextBtn').addEventListener('click', () => {
//     switchTab('injection');
//   });

//   // Switch to Blow tab — do NOT mark anything complete
//   document.getElementById('qcfinalnextbtn').addEventListener('click', () => {
//     switchTab('blow');
//   });

//   document.getElementById('blowFinalnxtbtn').addEventListener('click', () => {
//     switchTab('mixing');
//   });

//   document.getElementById('mixingFinalnxtbtn').addEventListener('click', () => {
//     switchTab('refills');
//   });
  

//   // Load last active tab on refresh
//   switchTab(currentTab);
// </script>



// </body>
// </html>
