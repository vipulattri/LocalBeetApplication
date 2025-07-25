import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./CreateStoreIssueVoucher.css"

const CreateStoreIssueVoucher = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    voucherNumber: `SIV-${Date.now().toString().slice(-6)}`,
    issueDate: new Date().toISOString().split("T")[0],
    department: "Production",
    jobOrderReference: "",
    issuedBy: "",
    receivedBy: "",
    purpose: "",
    notes: "",
  })

  const [items, setItems] = useState([
    {
      id: 1,
      itemCode: "",
      itemName: "",
      quantity: 1,
      unit: "",
      notes: "",
    },
  ])

  const departments = [
    "Production",
    "Maintenance",
    "Quality Control",
    "Packaging",
    "Shipping",
    "Research & Development",
  ]
  const jobOrders = [
    "JO001 - Building Construction",
    "JO002 - Equipment Installation",
    "JO003 - Maintenance Work",
    "JO004 - System Upgrade",
  ]
  const itemCodes = [
    { code: "ITM001", name: "Steel Rods", unit: "kg" },
    { code: "ITM002", name: "Aluminum Sheets", unit: "pcs" },
    { code: "ITM003", name: "Copper Wires", unit: "m" },
    { code: "ITM004", name: "Plastic Components", unit: "pcs" },
    { code: "ITM005", name: "Rubber Gaskets", unit: "pcs" },
    { code: "ITM006", name: "Bolts & Nuts", unit: "set" },
    { code: "ITM007", name: "Welding Rods", unit: "kg" },
    { code: "ITM008", name: "Paint", unit: "l" },
  ]
  const units = ["pcs", "kg", "m", "l", "set", "box", "roll", "sheet"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          if (field === "itemCode") {
            const selectedItem = itemCodes.find((ic) => ic.code === value)
            if (selectedItem) {
              updatedItem.itemName = selectedItem.name
              updatedItem.unit = selectedItem.unit
            }
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      itemCode: "",
      itemName: "",
      quantity: 1,
      unit: "",
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

    const payload = {
      ...formData,
      items: items.map(({ id, ...rest }) => rest),
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/storeIssueVoucher/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (result.success) {
        alert("Store Issue Voucher created successfully")
        navigate("/store-issue-voucher")
      } else {
        alert("Failed to create Store Issue Voucher: " + (result.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error creating SIV:", error)
      alert("An error occurred while creating the Store Issue Voucher.")
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
    <div className="create-siv-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <Link to="/store-issue-voucher" className="breadcrumb">
              ← Store Issue Voucher
            </Link>
            <h1 className="page-title">Create Store Issue Voucher</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="siv-form">
        <div className="form-section">
          <h2 className="section-title">Store Issue Voucher</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Voucher Number</label>
              <input
                type="text"
                name="voucherNumber"
                value={formData.voucherNumber}
                onChange={handleInputChange}
                className="form-input voucher-number"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <div className="date-display">{formatDate(formData.issueDate)}</div>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                className="form-input date-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Order Reference</label>
              <select
                name="jobOrderReference"
                value={formData.jobOrderReference}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select job order (if any)</option>
                {jobOrders.map((jo) => (
                  <option key={jo} value={jo.split(" ")[0]}>
                    {jo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Issued By</label>
              <input
                type="text"
                name="issuedBy"
                value={formData.issuedBy}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter issuer name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Received By</label>
              <input
                type="text"
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter receiver name"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Purpose</label>
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Purpose of material issue"
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Additional notes..."
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2 className="section-title">Items</h2>
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
                    <select
                      value={item.itemCode}
                      onChange={(e) => handleItemChange(item.id, "itemCode", e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select code</option>
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
                      value={item.itemName}
                      onChange={(e) => handleItemChange(item.id, "itemName", e.target.value)}
                      className="form-input"
                      placeholder="Item name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                      className="form-input"
                      placeholder="1"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select unit</option>
                      {units.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
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

        <div className="form-actions">
          <Link to="/store-issue-voucher" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Create Store Issue Voucher
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateStoreIssueVoucher
