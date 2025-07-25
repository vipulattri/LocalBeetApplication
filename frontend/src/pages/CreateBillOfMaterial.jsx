import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "./CreateBillOfMaterial.css"

const CreateBillOfMaterial = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    bomId: `BOM${String(Date.now()).slice(-3).padStart(3, "0")}`,
    product: "",
    version: "v1.0",
    description: "",
    status: "Draft",
    effectiveDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    notes: "",
  })

  const [materials, setMaterials] = useState([
    {
      id: 1,
      itemCode: "",
      itemName: "",
      quantity: 1,
      unit: "",
      unitCost: 0,
      totalCost: 0,
      supplier: "",
      notes: "",
    },
  ])

  const statusOptions = ["Draft", "Active", "Under Review", "Archived", "Obsolete"]

  const itemCodes = [
    { code: "ITM001", name: "Steel Bolt", unit: "pcs", cost: 2.5 },
    { code: "ITM002", name: "Aluminum Sheet", unit: "pcs", cost: 45.0 },
    { code: "ITM003", name: "Copper Wire", unit: "m", cost: 3.2 },
    { code: "ITM004", name: "Plastic Component", unit: "pcs", cost: 1.8 },
    { code: "ITM005", name: "Rubber Gasket", unit: "pcs", cost: 0.75 },
    { code: "ITM006", name: "Bolt & Nut Set", unit: "set", cost: 5.5 },
    { code: "ITM007", name: "Welding Rod", unit: "kg", cost: 12.0 },
    { code: "ITM008", name: "Industrial Paint", unit: "l", cost: 25.0 },
  ]

  const suppliers = [
    "ABC Corporation",
    "XYZ Industries",
    "Tech Solutions Ltd",
    "Global Manufacturing",
    "Steel Works Inc",
  ]

  const units = ["pcs", "kg", "m", "l", "set", "box", "roll", "sheet"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleMaterialChange = (id, field, value) => {
    setMaterials((prev) =>
      prev.map((material) => {
        if (material.id === id) {
          const updatedMaterial = { ...material, [field]: value }

          // Auto-fill material details when item code is selected
          if (field === "itemCode") {
            const selectedItem = itemCodes.find((ic) => ic.code === value)
            if (selectedItem) {
              updatedMaterial.itemName = selectedItem.name
              updatedMaterial.unit = selectedItem.unit
              updatedMaterial.unitCost = selectedItem.cost
              updatedMaterial.totalCost = selectedItem.cost * updatedMaterial.quantity
            }
          }

          // Calculate total cost when quantity or unit cost changes
          if (field === "quantity" || field === "unitCost") {
            const quantity = field === "quantity" ? Number.parseFloat(value) || 0 : updatedMaterial.quantity
            const unitCost = field === "unitCost" ? Number.parseFloat(value) || 0 : updatedMaterial.unitCost
            updatedMaterial.totalCost = quantity * unitCost
          }

          return updatedMaterial
        }
        return material
      }),
    )
    // Clear error when user makes changes
    if (error) setError("")
  }

  const addMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      itemCode: "",
      itemName: "",
      quantity: 1,
      unit: "",
      unitCost: 0,
      totalCost: 0,
      supplier: "",
      notes: "",
    }
    setMaterials((prev) => [...prev, newMaterial])
  }

  const removeMaterial = (id) => {
    if (materials.length > 1) {
      setMaterials((prev) => prev.filter((material) => material.id !== id))
    }
  }

  const calculateTotalCost = () => {
    return materials.reduce((total, material) => total + material.totalCost, 0).toFixed(2)
  }

  // Validation function
  const validateForm = () => {
    const errors = []

    // Validate basic form data
    if (!formData.product.trim()) errors.push("Product name is required")
    if (!formData.version.trim()) errors.push("Version is required")
    if (!formData.description.trim()) errors.push("Description is required")
    if (!formData.effectiveDate) errors.push("Effective date is required")

    // Validate materials
    materials.forEach((material, index) => {
      if (!material.itemCode) errors.push(`Material ${index + 1}: Item code is required`)
      if (!material.itemName.trim()) errors.push(`Material ${index + 1}: Item name is required`)
      if (!material.unit) errors.push(`Material ${index + 1}: Unit is required`)
      if (material.quantity <= 0) errors.push(`Material ${index + 1}: Quantity must be greater than 0`)
      if (material.unitCost < 0) errors.push(`Material ${index + 1}: Unit cost cannot be negative`)
    })

    return errors
  }

  // API call function
  const createBOMAPI = async (payload) => {
    try {
      console.log("Sending BOM payload:", JSON.stringify(payload, null, 2))
      
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/BOM/create`, payload, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 10000, // 10 second timeout
      })

      console.log("BOM created successfully:", response.data)
      return response.data
    } catch (error) {
      console.error("API Error Details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      })

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status
        const errorMessage = error.response.data?.message || error.response.data?.error || `Server error (${status})`
        
        switch (status) {
          case 400:
            throw new Error(`Invalid data: ${errorMessage}`)
          case 401:
            throw new Error("Authentication required. Please log in again.")
          case 403:
            throw new Error("You don't have permission to create BOMs.")
          case 404:
            throw new Error("API endpoint not found. Please check the server configuration.")
          case 409:
            throw new Error("BOM with this ID already exists.")
          case 422:
            throw new Error(`Validation error: ${errorMessage}`)
          case 500:
            throw new Error("Server error. Please try again later.")
          default:
            throw new Error(`Unexpected error: ${errorMessage}`)
        }
      } else if (error.request) {
        // Network error
        throw new Error("Network error. Please check your connection and try again.")
      } else {
        // Other error
        throw new Error(`Error: ${error.message}`)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setError(validationErrors.join(", "))
        setLoading(false)
        return
      }

      // Prepare payload
      const payload = {
        bomNumber: formData.bomId,
        productName: formData.product.trim(),
        version: formData.version.trim(),
        description: formData.description.trim(),
        status: formData.status,
        effectiveDate: formData.effectiveDate,
        expiryDate: formData.expiryDate || null,
        notes: formData.notes.trim(),
        materials: materials.map(material => ({
          id: material.id,
          itemCode: material.itemCode,
          itemName: material.itemName.trim(),
          quantity: Number(material.quantity),
          unit: material.unit,
          unitCost: Number(material.unitCost),
          totalCost: Number(material.totalCost),
          supplier: material.supplier || null,
          notes: material.notes.trim() || null
        })),
        itemCount: materials.length,
        totalCost: Number(calculateTotalCost()),
        createdAt: new Date().toISOString(),
        createdBy: "current-user" // Replace with actual user info
      }

      // Make API call
      const result = await createBOMAPI(payload)
      
      // Success - navigate to BOM list
      console.log("BOM created successfully:", result)
      navigate("/bills-of-material", { 
        state: { 
          message: "Bill of Material created successfully!",
          bomId: formData.bomId 
        }
      })

    } catch (error) {
      console.error("Failed to create BOM:", error)
      setError(error.message || "Failed to create BOM. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="create-bom-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <Link to="/bills-of-material" className="breadcrumb">
              ← Bills of Material
            </Link>
            <h1 className="page-title">Create Bill of Material</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bom-form">
        {/* BOM Information */}
        <div className="form-section">
          <h2 className="section-title">Recipe Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Recipe ID
                <span className="form-help">A unique identifier for this bill of material.</span>
              </label>
              <input
                type="text"
                name="bomId"
                value={formData.bomId}
                onChange={handleInputChange}
                className="form-input bom-id"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Product Name
                <span className="form-help">The name of the product this BOM is for.</span>
              </label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Steel Frame Assembly"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Version
                <span className="form-help">Version number of this BOM.</span>
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., v1.0"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
                required
                disabled={loading}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Effective Date</label>
              <div className="date-display">{formatDate(formData.effectiveDate)}</div>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleInputChange}
                className="form-input date-input"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              {formData.expiryDate && <div className="date-display">{formatDate(formData.expiryDate)}</div>}
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="form-input date-input"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Detailed description of the product and its purpose..."
                rows="3"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Additional notes or special instructions..."
                rows="3"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">Raw Materials And Items</h2>
            <button 
              type="button" 
              onClick={addMaterial} 
              className="btn btn-secondary"
              disabled={loading}
            >
              <span className="btn-icon">+</span>
              Add Material
            </button>
          </div>

          <div className="materials-container">
            {materials.map((material, index) => (
              <div key={material.id} className="material-row">
                <div className="material-header">
                  <span className="material-number">Material {index + 1}</span>
                  {materials.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeMaterial(material.id)} 
                      className="btn-remove"
                      disabled={loading}
                    >
                      Remove material
                    </button>
                  )}
                </div>

                <div className="material-grid">
                  <div className="form-group">
                    <label className="form-label">Item Code</label>
                    <select
                      value={material.itemCode}
                      onChange={(e) => handleMaterialChange(material.id, "itemCode", e.target.value)}
                      className="form-select"
                      required
                      disabled={loading}
                    >
                      <option value="">Select an item</option>
                      {itemCodes.map((ic) => (
                        <option key={ic.code} value={ic.code}>
                          {ic.code} - {ic.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      value={material.itemName}
                      onChange={(e) => handleMaterialChange(material.id, "itemName", e.target.value)}
                      className="form-input"
                      placeholder="Material name"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => handleMaterialChange(material.id, "quantity", e.target.value)}
                      className="form-input"
                      placeholder="1"
                      min="0.01"
                      step="0.01"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select
                      value={material.unit}
                      onChange={(e) => handleMaterialChange(material.id, "unit", e.target.value)}
                      className="form-select"
                      required
                      disabled={loading}
                    >
                      <option value="">Select unit</option>
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit Cost</label>
                    <input
                      type="number"
                      value={material.unitCost}
                      onChange={(e) => handleMaterialChange(material.id, "unitCost", e.target.value)}
                      className="form-input"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Cost</label>
                    <input
                      type="number"
                      value={material.totalCost.toFixed(2)}
                      className="form-input total-cost"
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supplier</label>
                    <select
                      value={material.supplier}
                      onChange={(e) => handleMaterialChange(material.id, "supplier", e.target.value)}
                      className="form-select"
                      disabled={loading}
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier} value={supplier}>
                          {supplier}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Notes</label>
                    <input
                      type="text"
                      value={material.notes}
                      onChange={(e) => handleMaterialChange(material.id, "notes", e.target.value)}
                      className="form-input"
                      placeholder="Material-specific notes"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="total-section">
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total Materials</span>
                <span className="stat-value">{materials.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Cost</span>
                <span className="stat-value">${calculateTotalCost()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Link to="/bills-of-material" className="btn btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creating BOM..." : "Create Bill of Material"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateBillOfMaterial