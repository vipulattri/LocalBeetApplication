"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import "./CreatePurchaseOrder.css" // Reuse same CSS

const EditPurchaseOrder = () => {
  const navigate = useNavigate()
  const { poNumber } = useParams()

  const [formData, setFormData] = useState({
    poNumber: "",
    vendor: "",
    vendorName: "",
    orderDate: "",
    expectedDeliveryDate: "",
    status: "Draft",
    paymentTerms: "Net 30",
    shippingMethod: "Standard",
    notes: "",
  })

  const [items, setItems] = useState([])

  // Dummy vendors, items, units, etc - reuse from CreatePurchaseOrder
  const vendors = [
    "ABC Corporation",
    "XYZ Industries",
    "Tech Solutions Ltd",
    "Global Manufacturing",
    "Steel Works Inc",
    "Aluminum Suppliers Co",
  ]

  const itemCodes = [
    { code: "ITM001", name: "Steel Bolt", unit: "pcs", price: 2.5 },
    { code: "ITM002", name: "Aluminum Sheet", unit: "pcs", price: 45.0 },
    { code: "ITM003", name: "Copper Wire", unit: "m", price: 3.2 },
    { code: "ITM004", name: "Plastic Component", unit: "pcs", price: 1.8 },
    { code: "ITM005", name: "Rubber Gasket", unit: "pcs", price: 0.75 },
    { code: "ITM006", name: "Bolt & Nut Set", unit: "set", price: 5.5 },
    { code: "ITM007", name: "Welding Rod", unit: "kg", price: 12.0 },
    { code: "ITM008", name: "Industrial Paint", unit: "l", price: 25.0 },
  ]

  const units = ["pcs", "kg", "m", "l", "set", "box", "roll", "sheet"]
  const statusOptions = ["Draft", "Pending Approval", "Approved", "Sent to Vendor"]
  const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "COD", "Prepaid"]
  const shippingMethods = ["Standard", "Express", "Overnight", "Ground", "Air Freight", "Sea Freight"]

  // Fetch existing PO data from API or storage based on poNumber param
  useEffect(() => {
    // Simulate API call:
    async function fetchPurchaseOrder() {
      // Replace with actual API call like:
      // const res = await fetch(`/api/purchaseOrders/${poNumber}`)
      // const data = await res.json()

      // Dummy data simulation:
      const data = {
        poNumber: poNumber,
        vendor: "XYZ Industries",
        vendorName: "XYZ Industries Pvt Ltd",
        orderDate: "2025-05-25",
        expectedDeliveryDate: "2025-06-01",
        status: "Pending Approval",
        paymentTerms: "Net 30",
        shippingMethod: "Express",
        notes: "Urgent delivery required.",
        items: [
          {
            id: 101,
            itemCode: "ITM002",
            itemName: "Aluminum Sheet",
            quantity: 20,
            unit: "pcs",
            unitPrice: 45,
            totalPrice: 900,
          },
          {
            id: 102,
            itemCode: "ITM005",
            itemName: "Rubber Gasket",
            quantity: 100,
            unit: "pcs",
            unitPrice: 0.75,
            totalPrice: 75,
          },
        ],
      }

      setFormData({
        poNumber: data.poNumber,
        vendor: data.vendor,
        vendorName: data.vendorName,
        orderDate: data.orderDate,
        expectedDeliveryDate: data.expectedDeliveryDate,
        status: data.status,
        paymentTerms: data.paymentTerms,
        shippingMethod: data.shippingMethod,
        notes: data.notes,
      })

      setItems(data.items)
    }

    fetchPurchaseOrder()
  }, [poNumber])

  // The same handleInputChange, handleItemChange, addItem, removeItem, calculateTotalAmount as CreatePurchaseOrder:

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
              updatedItem.unitPrice = selectedItem.price
              updatedItem.totalPrice = selectedItem.price * updatedItem.quantity
            }
          }

          if (field === "quantity" || field === "unitPrice") {
            const quantity = field === "quantity" ? Number.parseFloat(value) || 0 : updatedItem.quantity
            const unitPrice = field === "unitPrice" ? Number.parseFloat(value) || 0 : updatedItem.unitPrice
            updatedItem.totalPrice = quantity * unitPrice
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
      unitPrice: 0,
      totalPrice: 0,
    }
    setItems((prev) => [...prev, newItem])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Send updated data to API:
    console.log("Updated Purchase Order Data:", { ...formData, items, totalAmount: calculateTotalAmount() })

    // Example API call for update:
    // await fetch(`/api/purchaseOrders/${poNumber}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ ...formData, items }),
    // })

    navigate("/purchase-order")
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="create-po-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <Link to="/purchase-order" className="breadcrumb">
              ← Purchase Orders
            </Link>
            <h1 className="page-title">Edit Purchase Order</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="po-form">
        {/* Same form sections and inputs as CreatePurchaseOrder, just populated by formData and items */}

        {/* Purchase Order Information */}
        <div className="form-section">
          <h2 className="section-title">Purchase Order Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                PO Number
                <span className="form-help">A unique identifier for this purchase order.</span>
              </label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleInputChange}
                className="form-input po-number"
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Vendor
                <span className="form-help">The vendor for this purchase order.</span>
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor} value={vendor}>
                    {vendor}
                  </option>
                ))}
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
              <label className="form-label">Order Date</label>
              <div className="date-display">{formatDate(formData.orderDate)}</div>
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleInputChange}
                className="form-input date-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Delivery Date</label>
              <div className="date-display">{formatDate(formData.expectedDeliveryDate)}</div>
              <input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleInputChange}
                className="form-input date-input"
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
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Terms</label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {paymentTermsOptions.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Shipping Method</label>
              <select
                name="shippingMethod"
                value={formData.shippingMethod}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {shippingMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Enter additional notes"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
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
                      step="0.01"
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

                  <div className="form-group">
                    <label className="form-label">Unit Price</label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                      className="form-input"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Price</label>
                    <input
                      type="number"
                      value={item.totalPrice.toFixed(2)}
                      className="form-input total-price"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="total-section">
            <div className="total-amount">
              <span className="total-label">Total Amount</span>
              <span className="total-value">${calculateTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Link to="/purchase-order" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Update Purchase Order
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPurchaseOrder
