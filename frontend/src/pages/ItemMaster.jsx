"use client"

import { useState, useEffect } from "react"
import "./ItemMaster.css"

const ItemMaster = () => {
  const [items, setItems] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  const categories = ["Hardware", "Raw Materials", "Electrical", "Components", "Sealing", "Tools", "Chemicals"]

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/items/get`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Failed to fetch items:", err))
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.itemCode ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.itemName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      filterCategory === "" || item.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const handleEdit = (item) => {
    setSelectedItem(item)
    setShowCreateForm(true)
  }

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await fetch(`${process.env.REACT_APP_BASE_URL}/api/items/delete/${itemId}`, { method: "DELETE" })
        setItems((prev) => prev.filter((item) => item.id !== itemId))
      } catch (error) {
        console.error("Failed to delete item:", error)
      }
    }
  }

  const getStockStatus = (stock) => {
    const stockValue = Number(stock || 0)
    if (stockValue === 0) return "out-of-stock"
    if (stockValue < 100) return "low-stock"
    return "in-stock"
  }

  const getStockStatusText = (stock) => {
    const stockValue = Number(stock || 0)
    if (stockValue === 0) return "Out of Stock"
    if (stockValue < 100) return "Low Stock"
    return "In Stock"
  }

  return (
    <div className="item-master-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Item Master</h1>
            <p className="page-subtitle">Manage and configure inventory items</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
            <span className="btn-icon">+</span>
            Create Item
          </button>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-header">
              <div className="item-code">{item.itemCode}</div>
              <div className={`stock-status status-${getStockStatus(item.currentStock)}`}>
                {getStockStatusText(item.currentStock)}
              </div>
            </div>

            <div className="item-content">
              <h3 className="item-name">{item.itemName}</h3>
              <div className="item-category">{item.category}</div>
              <div className="item-description">{item.description}</div>
            </div>

            <div className="item-details">
              <div className="detail-row">
                <span className="detail-label">Price:</span>
                <span className="detail-value">${Number(item.price || 0).toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stock:</span>
                <span className="detail-value">
                  {item.currentStock || 0} {item.unitOfMeasure || 'units'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Unit:</span>
                <span className="detail-value">{item.unitOfMeasure || 'N/A'}</span>
              </div>
            </div>

            <div className="item-actions">
              <button className="btn-action btn-edit" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button className="btn-action btn-delete" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No items found</h3>
            <p className="empty-state-description">
              {searchTerm || filterCategory
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first item."}
            </p>
            {!searchTerm && !filterCategory && (
              <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}>
                <span className="btn-icon">+</span>
                Create Your First Item
              </button>
            )}
          </div>
        </div>
      )}

      {showCreateForm && (
        <CreateItemModal
          item={selectedItem}
          onClose={() => {
            setShowCreateForm(false)
            setSelectedItem(null)
          }}
          onSave={async (itemData) => {
            try {
              console.log("Sending item data:", itemData)

              if (selectedItem) {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/items/update/${selectedItem.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(itemData),
                })

                if (!res.ok) {
                  const errorText = await res.text()
                  console.error("Update failed:", res.status, errorText)
                  alert(`Failed to update item: ${errorText}`)
                  return
                }

                const updatedItem = await res.json()
                setItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)))
              } else {
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/items/create`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(itemData),
                })

                if (!res.ok) {
                  const errorText = await res.text()
                  console.error("Create failed:", res.status, errorText)
                  alert(`Failed to create item: ${errorText}`)
                  return
                }

                const newItem = await res.json()
                setItems((prev) => [...prev, newItem])
              }
              setShowCreateForm(false)
              setSelectedItem(null)
            } catch (error) {
              console.error("Error saving item:", error)
              alert(`Error: ${error.message}`)
            }
          }}
        />
      )}
    </div>
  )
}

const CreateItemModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    itemCode: item?.itemCode || `ITM${String(Date.now()).slice(-3).padStart(3, "0")}`,
    type: item?.type || "Goods",
    itemName: item?.itemName || "",
    SKU: item?.SKU || "",
    unitOfMeasure: item?.unitOfMeasure || "",
    dimensions: item?.dimensions || { length: "", width: "", height: "" },
    dimensionUnit: item?.dimensionUnit || "cm",
    weight: item?.weight || "",
    weightUnit: item?.weightUnit || "kg",
    manufacturer: item?.manufacturer || "",
    brand: item?.brand || "",
    UPC: item?.UPC || "",
    MPN: item?.MPN || "",
    EAN: item?.EAN || "",
    ISBN: item?.ISBN || "",
    returnableItem: item?.returnableItem || true,
    // Sales Information
    salesEnabled: item?.salesEnabled || false,
    sellingPrice: item?.sellingPrice || "",
    saleAccount: item?.saleAccount || "Sales",
    saleDescription: item?.saleDescription || "",
    // Purchase Information
    purchaseEnabled: item?.purchaseEnabled || false,
    costPrice: item?.costPrice || "",
    purchaseAccount: item?.purchaseAccount || "Cost of Goods Sold",
    purchaseDescription: item?.purchaseDescription || "",
    preferredVendor: item?.preferredVendor || "",
    // Inventory Tracking
    trackInventory: item?.trackInventory || false,
    inventoryAccount: item?.inventoryAccount || "",
    inventoryValuationMethod: item?.inventoryValuationMethod || "",
    openingStock: item?.openingStock || "",
    openingStockRateUnit: item?.openingStockRateUnit || "",
    reorderPoint: item?.reorderPoint || "",
  })

  const units = ["box", "cm", "dz", "ft", "g", "in", "kg", "km", "lb", "mg", "ml", "m", "pcs"]
  const dimensionUnits = ["in", "cm"]
  const weightUnits = ["kg", "g", "lb", "oz"]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('dimension-')) {
      const dimensionType = name.split('-')[1]
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionType]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.itemName || !formData.unitOfMeasure) {
      alert("Please fill in all required fields")
      return
    }

    const itemData = {
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    console.log("Form data being submitted:", itemData)
    onSave(itemData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modern-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{item ? "Edit Item" : "New Item"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="item-form modern-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Type
                  <span className="help-icon" title="Select item type">?</span>
                </label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="type"
                      value="Goods"
                      checked={formData.type === "Goods"}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    Goods
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="type"
                      value="Service"
                      checked={formData.type === "Service"}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    Service
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  SKU
                  <span className="help-icon" title="Stock Keeping Unit">?</span>
                </label>
                <input
                  type="text"
                  name="SKU"
                  value={formData.SKU}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label required">
                  Unit
                  <span className="help-icon" title="Unit of measurement">?</span>
                </label>
                <select
                  name="unitOfMeasure"
                  value={formData.unitOfMeasure}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select or type to add</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="returnableItem"
                    checked={formData.returnableItem}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  <span className="checkbox-custom"></span>
                  Returnable Item
                  <span className="help-icon" title="Can this item be returned?">?</span>
                </label>
              </div>
            </div>
          </div>

          {/* Dimensions and Weight Section */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group dimensions-group">
                <label className="form-label">
                  Dimensions
                  <span className="form-help">(Length X Width X Height)</span>
                </label>
                <div className="dimensions-input">
                  <input
                    type="text"
                    name="dimension-length"
                    value={formData.dimensions.length}
                    onChange={handleInputChange}
                    className="form-input dimension-field"
                    placeholder="x"
                  />
                  <span className="dimension-separator">×</span>
                  <input
                    type="text"
                    name="dimension-width"
                    value={formData.dimensions.width}
                    onChange={handleInputChange}
                    className="form-input dimension-field"
                    placeholder="x"
                  />
                  <span className="dimension-separator">×</span>
                  <input
                    type="text"
                    name="dimension-height"
                    value={formData.dimensions.height}
                    onChange={handleInputChange}
                    className="form-input dimension-field"
                    placeholder="x"
                  />
                  <select
                    name="dimensionUnit"
                    value={formData.dimensionUnit}
                    onChange={handleInputChange}
                    className="form-select dimension-unit"
                  >
                    {dimensionUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Weight</label>
                <div className="weight-input">
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="form-input weight-field"
                  />
                  <select
                    name="weightUnit"
                    value={formData.weightUnit}
                    onChange={handleInputChange}
                    className="form-select weight-unit"
                  >
                    {weightUnits.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Manufacturer</label>
                <select
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select or Add Manufacturer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select or Add Brand</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  UPC
                  <span className="help-icon" title="Universal Product Code">?</span>
                </label>
                <input
                  type="text"
                  name="UPC"
                  value={formData.UPC}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  MPN
                  <span className="help-icon" title="Manufacturer Part Number">?</span>
                </label>
                <input
                  type="text"
                  name="MPN"
                  value={formData.MPN}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  EAN
                  <span className="help-icon" title="European Article Number">?</span>
                </label>
                <input
                  type="text"
                  name="EAN"
                  value={formData.EAN}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  ISBN
                  <span className="help-icon" title="International Standard Book Number">?</span>
                </label>
                <input
                  type="text"
                  name="ISBN"
                  value={formData.ISBN}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Sales Information Section */}
          <div className="form-section">
            <div className="section-header">
              <label className="checkbox-label section-toggle">
                <input
                  type="checkbox"
                  name="salesEnabled"
                  checked={formData.salesEnabled}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="checkbox-custom"></span>
                Sales Information
              </label>
            </div>

            {formData.salesEnabled && (
              <div className="subsection">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Selling Price</label>
                    <div className="price-input">
                      <span className="currency-symbol">KWD</span>
                      <input
                        type="number"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={handleInputChange}
                        className="form-input price-field"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Account</label>
                    <select
                      name="saleAccount"
                      value={formData.saleAccount}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      name="saleDescription"
                      value={formData.saleDescription}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Purchase Information Section */}
          <div className="form-section">
            <div className="section-header">
              <label className="checkbox-label section-toggle">
                <input
                  type="checkbox"
                  name="purchaseEnabled"
                  checked={formData.purchaseEnabled}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="checkbox-custom"></span>
                Purchase Information
              </label>
            </div>

            {formData.purchaseEnabled && (
              <div className="subsection">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cost Price</label>
                    <div className="price-input">
                      <span className="currency-symbol">KWD</span>
                      <input
                        type="number"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleInputChange}
                        className="form-input price-field"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">Account</label>
                    <select
                      name="purchaseAccount"
                      value={formData.purchaseAccount}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      name="purchaseDescription"
                      value={formData.purchaseDescription}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Preferred Vendor</label>
                    <select
                      name="preferredVendor"
                      value={formData.preferredVendor}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select vendor</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Track Inventory Section */}
          {(formData.salesEnabled || formData.purchaseEnabled) && (
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="trackInventory"
                      checked={formData.trackInventory}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span className="checkbox-custom"></span>
                    Track Inventory for this item
                    <span className="help-icon" title="Enable inventory tracking">?</span>
                  </label>
                  <p className="form-help-text">
                    You cannot enable/disable inventory tracking once you've created transactions for this item
                  </p>
                </div>
              </div>

              {formData.trackInventory && (
                <div className="subsection">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label required">Inventory Account</label>
                      <select
                        name="inventoryAccount"
                        value={formData.inventoryAccount}
                        onChange={handleInputChange}
                        className="form-select"
                        required={formData.trackInventory}
                      >
                        <option value="">Select an account</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label required">Inventory Valuation Method</label>
                      <select
                        name="inventoryValuationMethod"
                        value={formData.inventoryValuationMethod}
                        onChange={handleInputChange}
                        className="form-select"
                        required={formData.trackInventory}
                      >
                        <option value="">Select the valuation method</option>
                        <option value="FIFO">FIFO (First In, First Out)</option>
                        <option value="LIFO">LIFO (Last In, First Out)</option>
                        <option value="Average">Average Cost</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Opening Stock</label>
                      <input
                        type="number"
                        name="openingStock"
                        value={formData.openingStock}
                        onChange={handleInputChange}
                        className="form-input"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Opening Stock Rate per Unit</label>
                      <input
                        type="number"
                        name="openingStockRateUnit"
                        value={formData.openingStockRateUnit}
                        onChange={handleInputChange}
                        className="form-input"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Reorder Point</label>
                      <input
                        type="number"
                        name="reorderPoint"
                        value={formData.reorderPoint}
                        onChange={handleInputChange}
                        className="form-input"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? "Update Item" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ItemMaster