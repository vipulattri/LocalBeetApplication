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
    type: item?.type || "",
    itemName: item?.itemName || "",
    SKU: item?.SKU || "",
    unitOfMeasure: item?.unitOfMeasure || "",
    dimension: item?.dimension || "",
    manufactures: item?.manufactures || "",
    weight: item?.weight || "",
    brand: item?.brand || "",
    UPC: item?.UPC || "",
    MPN: item?.MPN || "",
    EAN: item?.EAN || "",
    ISBN: item?.ISBN || "",
    sellingPrice: Number(item?.sellingPrice || 0),
    saleAccount: item?.saleAccount || "",
    saleDescription: item?.saleDescription || "",
    costPrice: Number(item?.costPrice || 0),
    purchaseAccount: item?.purchaseAccount || "",
    purchaseDescription: item?.purchaseDescription || "",
    preferedVendor: item?.preferedVendor || "",
    inventoryAccount: item?.inventoryAccount || "",
    openingStock: Number(item?.openingStock || 0),
    reorderPoint: Number(item?.reorderPoint || 0),
    inventoryValuationMethod: item?.inventoryValuationMethod || "",
    openingStockRateUnit: Number(item?.openingStockRateUnit || 0),
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
              <input type="text" name="ItemCode " value={formData.itemCode} onChange={handleInputChange} className="form-input item-code" required />
            </div>

            <div className="form-group">
              <label className="form-label">Item Name<span className="form-help">The name of the item.</span></label>
              <input type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">SKU<span className="form-help">The name of the item.</span></label>
              <input type="text" name="SKU" value={formData.SKU} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>
            <div className="form-group" >
              <label className="form-label">Units<span className="form-help">The name of the item.</span></label>
              <select id="units" name="units" className="form-input" style={{ width: "100%", }}>
                <option value="box">box</option>
                <option value="cm">cm</option>
                <option value="dz">dz</option>
                <option value="ft">ft</option>
                <option value="g">g</option>
                <option value="in">in</option>
                <option value="kg">kg</option>
                <option value="km">km</option>
                <option value="lb">lb</option>
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="m">m</option>
                <option value="pcs">pcs</option>
              </select>

            </div>

            <div className="form-group" >
              <label className="form-label">Dimensions<span className="form-help">The name of the item.</span></label>
              <select id="units" name="dimension" className="form-input" style={{ width: "100%", }}>
                <option value="in">in</option>
                <option value="cm">cm</option>

              </select>

            </div>
            <div className="form-group">
              <label className="form-label">Weight<span className="form-help">The name of the item.</span></label>
              <select id="units" name="weight" className="form-input" style={{ width: "100%", }}>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
                </select>
            </div>

            <div className="form-group">
              <label className="form-label">Manufacturer<span className="form-help">The name of the item.</span></label>
              <input type="text" name="manufactures" value={formData.manufactures} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Brand<span className="form-help">The name of the item.</span></label>
              <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>


            <div className="form-group">
              <label className="form-label">UPC<span className="form-help">The name of the item.</span></label>
              <input type="number" name="UPC" value={formData.UPC} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">MPN<span className="form-help">The name of the item.</span></label>
              <input type="number" name="MPN" value={formData.MPN} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">EAN<span className="form-help">The name of the item.</span></label>
              <input type="number" name="EAN" value={formData.EAN} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">ISBN<span className="form-help">The name of the item.</span></label>
              <input type="number" name="ISBN" value={formData.ISBN} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price<span className="form-help">The name of the item.</span></label>
              <input type="text" name="sellingPrice" value={formData.sellingPrice} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Cost Price<span className="form-help">The name of the item.</span></label>
              <input type="text" name="costPrice" value={formData.costPrice} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>
            <div className="form-group">
              <label className="form-label">Account<span className="form-help">The name of the item.</span></label>
              <input type="text" name="saleAccount" value={formData.saleAccount} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Account<span className="form-help">The name of the item.</span></label>
              <input type="text" name="purchaseAccount" value={formData.purchaseAccount} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Description<span className="form-help">The name of the item.</span></label>
              <input type="text" name="saleDescription" value={formData.description} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Vendor<span className="form-help">The name of the item.</span></label>
              <input type="text" name="preferedVendor" value={formData.preferedVendor} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>



            <div className="form-group">
              <label className="form-label">Cost Price<span className="form-help">The name of the item.</span></label>
              <input type="text" name="costPrice" value={formData.costPrice} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>


            <div className="form-group">
              <label className="form-label">Inventory Account<span className="form-help">The name of the item.</span></label>
              <input type="text" name="inventoryAccount" value={formData.inventoryAccount} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Inventory Valuation Method<span className="form-help">The name of the item.</span></label>
              <input type="text" name="inventoryValuationMethod" value={formData.inventoryValuationMethod} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Opening Stock<span className="form-help">The name of the item.</span></label>
              <input type="text" name="openingStock" value={formData.openingStock} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Opening Stock Rate per Unit<span className="form-help">The name of the item.</span></label>
              <input type="text" name="openingStockRateUnit" value={formData.openingStockRateUnit} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
            </div>

            <div className="form-group">
              <label className="form-label">Reorder Point<span className="form-help">The name of the item.</span></label>
              <input type="text" name="reorderPoint" value={formData.reorderPoint} onChange={handleInputChange} className="form-input" placeholder="Steel Bolt" required />
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