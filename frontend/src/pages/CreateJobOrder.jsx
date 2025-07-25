import React, { useState } from 'react';
import axios from 'axios';
import './CreateJobOrder.css';

const JobOrderForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Main form data
  const [formData, setFormData] = useState({
    project: '',
    client: '',
    startDate: '',
    endDate: '',
    status: 'In Progress',
    priorityJO: 'Medium',
    description: '',
    estimatedCost: 0,
    actualCost: 0,
    assignedTo: '',
    department: '',
    notes: '',
    jobCenter: '',
    expectedDuration: 0,
    product: '',
    quantity: 0,
    lotSerialNumber: '',
    manufacturingOrder: '',
    finishedGood: '',
    stage: ''
  });

  // Raw Materials
  const [rawMaterials, setRawMaterials] = useState([
    { itemName: '', quantity: 0, unitPrice: 0, totalCost: 0 }
  ]);

  // Time Tracking
  const [timeTracking, setTimeTracking] = useState([
    { employee: '', duration: 0, startDate: '', endDate: '', productivity: 0 }
  ]);

  // Components
  const [components, setComponents] = useState([
    { product: '', toConsume: 0, quantity: 0, consumed: 0, onHand: 0, forecasted: 0 }
  ]);

  // Process Steps
  const [processSteps, setProcessSteps] = useState({
    stepName: '',
    stepStatus: 'pending'
  });

  // Sub Forms
  const [subForms, setSubForms] = useState([
    { moistureLevel: '', densityCheck: '' }
  ]);

  // Dropdown options
  const statusOptions = ['In Progress', 'Completed', 'On Hold', 'Cancelled'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const departmentOptions = ['Production', 'Quality Control', 'Assembly', 'Packaging', 'Maintenance'];
  const stageOptions = ['Planning', 'Casting', 'Machining', 'Assembly', 'Quality Check', 'Packaging'];
  const stepStatusOptions = ['pending', 'in-progress', 'completed', 'failed'];

  // Handle main form changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    if (error) setError('');
  };

  // Handle process steps changes
  const handleProcessStepsChange = (e) => {
    const { name, value } = e.target;
    setProcessSteps(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Raw Materials handlers
  const handleRawMaterialChange = (index, field, value) => {
    const updatedMaterials = rawMaterials.map((material, i) => {
      if (i === index) {
        const updated = { ...material, [field]: field === 'itemName' ? value : parseFloat(value) || 0 };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalCost = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return material;
    });
    setRawMaterials(updatedMaterials);
  };

  const addRawMaterial = () => {
    setRawMaterials([...rawMaterials, { itemName: '', quantity: 0, unitPrice: 0, totalCost: 0 }]);
  };

  const removeRawMaterial = (index) => {
    if (rawMaterials.length > 1) {
      setRawMaterials(rawMaterials.filter((_, i) => i !== index));
    }
  };

  // Time Tracking handlers
  const handleTimeTrackingChange = (index, field, value) => {
    const updatedTracking = timeTracking.map((track, i) => {
      if (i === index) {
        return { ...track, [field]: field === 'employee' ? value : parseFloat(value) || 0 };
      }
      return track;
    });
    setTimeTracking(updatedTracking);
  };

  const addTimeTracking = () => {
    setTimeTracking([...timeTracking, { employee: '', duration: 0, startDate: '', endDate: '', productivity: 0 }]);
  };

  const removeTimeTracking = (index) => {
    if (timeTracking.length > 1) {
      setTimeTracking(timeTracking.filter((_, i) => i !== index));
    }
  };

  // Components handlers
  const handleComponentChange = (index, field, value) => {
    const updatedComponents = components.map((component, i) => {
      if (i === index) {
        return { ...component, [field]: field === 'product' ? value : parseFloat(value) || 0 };
      }
      return component;
    });
    setComponents(updatedComponents);
  };

  const addComponent = () => {
    setComponents([...components, { product: '', toConsume: 0, quantity: 0, consumed: 0, onHand: 0, forecasted: 0 }]);
  };

  const removeComponent = (index) => {
    if (components.length > 1) {
      setComponents(components.filter((_, i) => i !== index));
    }
  };

  // Sub Forms handlers
  const handleSubFormChange = (index, field, value) => {
    const updatedSubForms = subForms.map((subForm, i) => {
      if (i === index) {
        return { ...subForm, [field]: value };
      }
      return subForm;
    });
    setSubForms(updatedSubForms);
  };

  const addSubForm = () => {
    setSubForms([...subForms, { moistureLevel: '', densityCheck: '' }]);
  };

  const removeSubForm = (index) => {
    if (subForms.length > 1) {
      setSubForms(subForms.filter((_, i) => i !== index));
    }
  };

  // Validation
  const validateForm = () => {
    const errors = [];
    
    if (!formData.project.trim()) errors.push('Project name is required');
    if (!formData.client.trim()) errors.push('Client is required');
    if (!formData.startDate) errors.push('Start date is required');
    if (!formData.product.trim()) errors.push('Product is required');
    if (formData.quantity <= 0) errors.push('Quantity must be greater than 0');
    
    rawMaterials.forEach((material, index) => {
      if (!material.itemName.trim()) errors.push(`Raw material ${index + 1}: Item name is required`);
    });

    return errors;
  };

  // API call
  const createJobOrderAPI = async (payload) => {
    try {
      console.log('Sending Job Order payload:', JSON.stringify(payload, null, 2));
      
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/JobOrder/create`, payload, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${token}`
        },
        timeout: 15000
      });

      console.log('Job Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || error.response.statusText;
        
        switch (status) {
          case 400:
            throw new Error(`Invalid data: ${errorMessage}`);
          case 401:
            throw new Error('Authentication required');
          case 403:
            throw new Error('Access denied');
          case 404:
            throw new Error('API endpoint not found');
          case 500:
            throw new Error('Server error. Please try again later');
          default:
            throw new Error(`Error ${status}: ${errorMessage}`);
        }
      } else if (error.request) {
        throw new Error('Network error. Please check your connection');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setLoading(false);
        return;
      }

      // Prepare payload
      const payload = {
        ...formData,
        rawMaterials,
        timeTracking,
        components,
        processSteps,
        subForms,
        createdAt: new Date().toISOString()
      };

      // Make API call
      await createJobOrderAPI(payload);
      
      setSuccess('Job Order created successfully!');
      
      // Reset form after successful submission
      setTimeout(() => {
        window.location.reload(); // Or navigate to another page
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-order-form-container">
      <div className="form-header">
        <h1>Create Job Order</h1>
        <p>Fill in the details to create a new job order</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <strong>Success:</strong> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="job-order-form">
        {/* Basic Information */}
        <section className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Project *</label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Client *</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={loading}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                name="priorityJO"
                value={formData.priorityJO}
                onChange={handleInputChange}
                disabled={loading}
              >
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Cost Information */}
        <section className="form-section">
          <h2>Cost Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Estimated Cost</label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Actual Cost</label>
              <input
                type="number"
                name="actualCost"
                value={formData.actualCost}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Assignment Information */}
        <section className="form-section">
          <h2>Assignment Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Select Department</option>
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Job Center</label>
              <input
                type="text"
                name="jobCenter"
                value={formData.jobCenter}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Expected Duration (hours)</label>
              <input
                type="number"
                name="expectedDuration"
                value={formData.expectedDuration}
                onChange={handleInputChange}
                min="0"
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Product Information */}
        <section className="form-section">
          <h2>Product Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Product *</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Lot/Serial Number</label>
              <input
                type="text"
                name="lotSerialNumber"
                value={formData.lotSerialNumber}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Manufacturing Order</label>
              <input
                type="text"
                name="manufacturingOrder"
                value={formData.manufacturingOrder}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Finished Good</label>
              <input
                type="text"
                name="finishedGood"
                value={formData.finishedGood}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Select Stage</option>
                {stageOptions.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                disabled={loading}
              />
            </div>
          </div>
        </section>

        {/* Raw Materials */}
        <section className="form-section">
          <div className="section-header">
            <h2>Raw Materials</h2>
            <button
              type="button"
              onClick={addRawMaterial}
              className="btn btn-secondary"
              disabled={loading}
            >
              Add Material
            </button>
          </div>
          
          {rawMaterials.map((material, index) => (
            <div key={index} className="dynamic-section">
              <div className="section-title">
                <span>Material {index + 1}</span>
                {rawMaterials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRawMaterial(index)}
                    className="btn btn-danger btn-sm"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    value={material.itemName}
                    onChange={(e) => handleRawMaterialChange(index, 'itemName', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={material.quantity}
                    onChange={(e) => handleRawMaterialChange(index, 'quantity', e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Unit Price</label>
                  <input
                    type="number"
                    value={material.unitPrice}
                    onChange={(e) => handleRawMaterialChange(index, 'unitPrice', e.target.value)}
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Total Cost</label>
                  <input
                    type="number"
                    value={material.totalCost.toFixed(2)}
                    readOnly
                    className="readonly"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Time Tracking */}
        <section className="form-section">
          <div className="section-header">
            <h2>Time Tracking</h2>
            <button
              type="button"
              onClick={addTimeTracking}
              className="btn btn-secondary"
              disabled={loading}
            >
              Add Time Entry
            </button>
          </div>
          
          {timeTracking.map((track, index) => (
            <div key={index} className="dynamic-section">
              <div className="section-title">
                <span>Time Entry {index + 1}</span>
                {timeTracking.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeTracking(index)}
                    className="btn btn-danger btn-sm"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee</label>
                  <input
                    type="text"
                    value={track.employee}
                    onChange={(e) => handleTimeTrackingChange(index, 'employee', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Duration (hours)</label>
                  <input
                    type="number"
                    value={track.duration}
                    onChange={(e) => handleTimeTrackingChange(index, 'duration', e.target.value)}
                    min="0"
                    step="0.1"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={track.startDate}
                    onChange={(e) => handleTimeTrackingChange(index, 'startDate', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={track.endDate}
                    onChange={(e) => handleTimeTrackingChange(index, 'endDate', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Productivity (%)</label>
                  <input
                    type="number"
                    value={track.productivity}
                    onChange={(e) => handleTimeTrackingChange(index, 'productivity', e.target.value)}
                    min="0"
                    max="100"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Components */}
        <section className="form-section">
          <div className="section-header">
            <h2>Components</h2>
            <button
              type="button"
              onClick={addComponent}
              className="btn btn-secondary"
              disabled={loading}
            >
              Add Component
            </button>
          </div>
          
          {components.map((component, index) => (
            <div key={index} className="dynamic-section">
              <div className="section-title">
                <span>Component {index + 1}</span>
                {components.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeComponent(index)}
                    className="btn btn-danger btn-sm"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Product</label>
                  <input
                    type="text"
                    value={component.product}
                    onChange={(e) => handleComponentChange(index, 'product', e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>To Consume</label>
                  <input
                    type="number"
                    value={component.toConsume}
                    onChange={(e) => handleComponentChange(index, 'toConsume', e.target.value)}
                    min="0"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={component.quantity}
                    onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)}
                    min="0"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Consumed</label>
                  <input
                    type="number"
                    value={component.consumed}
                    onChange={(e) => handleComponentChange(index, 'consumed', e.target.value)}
                    min="0"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>On Hand</label>
                  <input
                    type="number"
                    value={component.onHand}
                    onChange={(e) => handleComponentChange(index, 'onHand', e.target.value)}
                    min="0"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Forecasted</label>
                  <input
                    type="number"
                    value={component.forecasted}
                    onChange={(e) => handleComponentChange(index, 'forecasted', e.target.value)}
                    min="0"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Process Steps */}
        <section className="form-section">
          <h2>Process Steps</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Step Name</label>
              <input
                type="text"
                name="stepName"
                value={processSteps.stepName}
                onChange={handleProcessStepsChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>Step Status</label>
              <select
                name="stepStatus"
                value={processSteps.stepStatus}
                onChange={handleProcessStepsChange}
                disabled={loading}
              >
                {stepStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Sub Forms */}
        <section className="form-section">
          <div className="section-header">
            <h2>Quality Control Data</h2>
            <button
              type="button"
              onClick={addSubForm}
              className="btn btn-secondary"
              disabled={loading}
            >
              Add Quality Check
            </button>
          </div>
          
          {subForms.map((subForm, index) => (
            <div key={index} className="dynamic-section">
              <div className="section-title">
                <span>Quality Check {index + 1}</span>
                {subForms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubForm(index)}
                    className="btn btn-danger btn-sm"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Moisture Level</label>
                  <input
                    type="text"
                    value={subForm.moistureLevel}
                    onChange={(e) => handleSubFormChange(index, 'moistureLevel', e.target.value)}
                    placeholder="e.g., 12%"
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label>Density Check</label>
                  <input
                    type="text"
                    value={subForm.densityCheck}
                    onChange={(e) => handleSubFormChange(index, 'densityCheck', e.target.value)}
                    placeholder="e.g., 1.1 g/cm3"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Job Order...' : 'Create Job Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobOrderForm;