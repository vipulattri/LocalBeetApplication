"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./CreateGRN.css"

const CreateGRN = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    grnNumber: `GRN${Date.now().toString().slice(-6)}`,
    poReference: "", // changed from purchaseOrder
    vendor: "",
    vendorName: "",
    receiptDate: new Date().toISOString().split("T")[0],
    receivedBy: "",
    notes: "",
  })

  const [items, setItems] = useState([
    {
      id: 1,
      itemCode: "",
      itemName: "",
      unit: "",
      expectedQuantity: "",
      receivedQuantity: "",
      notes: "",
    },
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleItemChange = (id, field, value) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      itemCode: "",
      itemName: "",
      unit: "",
      expectedQuantity: "",
      receivedQuantity: "",
      notes: "",
    }
    setItems((prev) => [...prev, newItem])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare payload matching API structure
    const payload = {
      grnNumber: formData.grnNumber,
      receiptDate: formData.receiptDate,
      receivedBy: formData.receivedBy,
      notes: formData.notes,
      vendor: formData.vendor,
      vendorName: formData.vendorName,
      poReference: formData.poReference,
      items: items.map(({ id, ...rest }) => rest), // Remove frontend-only id
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/goodReceiptNotes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log("GRN created:", result)
        navigate("/goods-receipt-notes")
      } else {
        console.error("Failed to create GRN:", result)
        alert("Failed: " + (result.message || "Unexpected error"))
      }
    } catch (err) {
      console.error("Error submitting GRN:", err)
      alert("An error occurred while submitting the GRN.")
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
    <div className="create-grn-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <Link to="/goods-receipt-notes" className="breadcrumb">
              ← Goods Receipt Notes
            </Link>
            <h1 className="page-title">Create Goods Receipt Note</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grn-form">
        {/* Goods Receipt Information */}
        <div className="form-section">
          <h2 className="section-title">Goods Receipt Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                GRN Number
                <span className="form-help">A unique identifier for this GRN.</span>
              </label>
              <input
                type="text"
                name="grnNumber"
                value={formData.grnNumber}
                onChange={handleInputChange}
                className="form-input"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Purchase Order Reference
                <span className="form-help">Link this GRN to a purchase order.</span>
              </label>
              <select
                name="poReference"
                value={formData.poReference}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select a purchase order</option>
                <option value="PO001 - Steel Materials">PO001 - Steel Materials</option>
                <option value="PO002 - Office Supplies">PO002 - Office Supplies</option>
                <option value="PO003 - Equipment Parts">PO003 - Equipment Parts</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Vendor
                <span className="form-help">The vendor for this receipt.</span>
              </label>
              <select name="vendor" value={formData.vendor} onChange={handleInputChange} className="form-select">
                <option value="">Select a vendor</option>
                <option value="VENDOR001">ABC Corporation</option>
                <option value="VENDOR002">Seattle Supplies Ltd.</option>
                <option value="VENDOR003">Tech Solutions Ltd</option>
                <option value="VENDOR004">Global Manufacturing</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vendor Name</label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter vendor name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Receipt Date</label>
              <div className="date-display">{formatDate(formData.receiptDate)}</div>
              <input
                type="date"
                name="receiptDate"
                value={formData.receiptDate}
                onChange={handleInputChange}
                className="form-input date-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Received By
                <span className="form-help">The person who received the goods.</span>
              </label>
              <input
                type="text"
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter receiver name"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Additional notes about this receipt..."
              rows="3"
            />
          </div>
        </div>

        {/* Items Received */}
        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">Items Received</h2>
            <button type="button" onClick={addItem} className="btn btn-secondary">
              <span className="btn-icon">+</span>
              Add Item
            </button>
          </div>

          <div className="items-container">
            {items.map((item, index) => (
              <div key={item.id} className="item-row">
                <div className="item-header">
                  <span className="item-number">Item {index + 1}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(item.id)} className="btn-remove">
                      Remove item
                    </button>
                  )}
                </div>

                <div className="item-grid">
                  <div className="form-group">
                    <label className="form-label">Item Code</label>
                    <input
                      type="text"
                      value={item.itemCode}
                      onChange={(e) => handleItemChange(item.id, "itemCode", e.target.value)}
                      className="form-input"
                      placeholder="Enter item code"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(item.id, "itemName", e.target.value)}
                      className="form-input"
                      placeholder="Enter item name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select unit</option>
                      <option value="Pack">Pack</option>
                      <option value="Piece">Piece</option>
                      <option value="Box">Box</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expected Quantity</label>
                    <input
                      type="number"
                      value={item.expectedQuantity}
                      onChange={(e) => handleItemChange(item.id, "expectedQuantity", e.target.value)}
                      className="form-input"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Received Quantity</label>
                    <input
                      type="number"
                      value={item.receivedQuantity}
                      onChange={(e) => handleItemChange(item.id, "receivedQuantity", e.target.value)}
                      className="form-input"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Notes</label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => handleItemChange(item.id, "notes", e.target.value)}
                      className="form-input"
                      placeholder="Item-specific notes"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Link to="/goods-receipt-notes" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Create GRN
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateGRN
