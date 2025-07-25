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
              console.log("Sending item data:", itemData) // Debug log
              
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
    itemName: item?.itemName || "",
    category: item?.category || "",
    unitOfMeasure: item?.unitOfMeasure || "",
    price: Number(item?.price || 0),
    currentStock: Number(item?.currentStock || 0),
    description: item?.description || "",
  })

  const categories = ["Hardware", "Raw Materials", "Electrical", "Components", "Sealing", "Tools", "Chemicals"]
  const units = ["pcs", "kg", "m", "l", "set", "box", "roll", "sheet", "ft", "cm"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.itemCode || !formData.itemName || !formData.category || !formData.unitOfMeasure) {
      alert("Please fill in all required fields")
      return
    }
    
    const itemData = {
      itemCode: formData.itemCode.trim(),
      itemName: formData.itemName.trim(),
      category: formData.category,
      unitOfMeasure: formData.unitOfMeasure,
      price: Number.parseFloat(formData.price) || 0,
      currentStock: Number.parseInt(formData.currentStock) || 0,
      description: formData.description.trim(),
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    
    console.log("Form data being submitted:", itemData) // Debug log
    onSave(itemData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{item ? "Edit Item" : "Create Item"}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Item Code<span className="form-help">A unique identifier for the item.</span></label>
              <input type="text" name="itemCode" value={formData.itemCode} onChange={handleInputChange} className="form-input item-code" required />
            </div>

            <div className="form-group">
              <label className="form-label">Item Name<span className="form-help">The name of the item.</span></label>
              <input type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Category<span className="form-help">The category this item belongs to.</span></label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="form-select" required>
                <option value="">Select a category</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure<span className="form-help">How this item is measured.</span></label>
              <select name="unitOfMeasure" value={formData.unitOfMeasure} onChange={handleInputChange} className="form-select" required>
                <option value="">Select a unit</option>
                {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price<span className="form-help">The standard price of this item.</span></label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-input" placeholder="0" min="0" step="0.01" required />
            </div>

            <div className="form-group">
              <label className="form-label">Current Stock<span className="form-help">The current quantity in stock.</span></label>
              <input type="number" name="currentStock" value={formData.currentStock} onChange={handleInputChange} className="form-input" placeholder="0" min="0" required />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Description<span className="form-help">Additional details about the item.</span></label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-textarea" placeholder="Enter item description" rows="3" required />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{item ? "Update Item" : "Create Item"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ItemMaster