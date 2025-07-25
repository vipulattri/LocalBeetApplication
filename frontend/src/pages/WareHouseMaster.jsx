"use client"

import { useState, useEffect } from "react"
import "./WareHouseMaster.css"

const WarehouseMaster = () => {
  const [warehouses, setWarehouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const warehouseTypes = ["Distribution", "Storage", "Cold Storage", "Temporary", "Cross-dock"]
  const statusOptions = ["Active", "Inactive", "Under Maintenance"]

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const fetchWarehouses = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/warehouse/get`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setWarehouses(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch warehouses. Please try again later.")
      console.error("Error fetching warehouses:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWarehouse = async (warehouseData) => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/warehouse/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouseData),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to create warehouse")
      }
      
      const newWarehouse = await response.json()
      setWarehouses(prev => [...prev, newWarehouse])
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to create warehouse. Please try again.")
      console.error("Error creating warehouse:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateWarehouse = async (warehouseId, updates) => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/warehouses/update/${warehouseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to update warehouse")
      }
      
      const updatedWarehouse = await response.json()
      setWarehouses(prev => prev.map(w => w.id === warehouseId ? updatedWarehouse : w))
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to update warehouse. Please try again.")
      console.error("Error updating warehouse:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWarehouse = async (warehouseId) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/warehouses/delete/${warehouseId}`, {
          method: "DELETE",
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || "Failed to delete warehouse")
        }
        
        setWarehouses(prev => prev.filter(w => w.id !== warehouseId))
        setError(null)
      } catch (err) {
        setError(err.message || "Failed to delete warehouse. Please try again.")
        console.error("Error deleting warehouse:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  // Convert single warehouse object into an array (if needed)
  const warehouseList = Array.isArray(warehouses) ? warehouses : [warehouses];

  const filteredWarehouses = warehouseList.filter((warehouse) => {
    const matchesSearch =
      (warehouse.warehouseName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (warehouse.warehouseCode ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (warehouse.location ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "" || warehouse.type === filterType;
    const matchesStatus = filterStatus === "" || warehouse.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading && warehouses.length === 0) {
    return (
      <div className="warehouse-master-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading warehouses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="warehouse-master-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Error Loading Warehouses</h3>
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={fetchWarehouses}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="warehouse-master-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Warehouse Master</h1>
            <p className="page-subtitle">Manage and configure warehouse locations and settings</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
          >
            <span className="btn-icon">+</span>
            Add Warehouse
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="controls-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search warehouses..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
          <select 
            className="filter-select" 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            disabled={loading}
          >
            <option value="">All Types</option>
            {warehouseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select 
            className="filter-select" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            disabled={loading}
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="warehouse-grid">
        {filteredWarehouses.map((warehouse) => (
          <WarehouseCard
            key={warehouse.id}
            warehouse={warehouse}
            onView={() => {
              setSelectedWarehouse(warehouse)
              setShowDetailsModal(true)
            }}
            onEdit={() => {
              setSelectedWarehouse(warehouse)
              setShowCreateForm(true)
            }}
            onDelete={handleDeleteWarehouse}
            loading={loading}
          />
        ))}
      </div>

      {filteredWarehouses.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">🏭</div>
            <h3 className="empty-state-title">No warehouses found</h3>
            <p className="empty-state-description">
              {searchTerm || filterType || filterStatus
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first warehouse."}
            </p>
            {!searchTerm && !filterType && !filterStatus && (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowCreateForm(true)}
                disabled={loading}
              >
                <span className="btn-icon">+</span>
                Add Your First Warehouse
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Warehouse Modal */}
      {showCreateForm && (
        <CreateWarehouseModal
          warehouse={selectedWarehouse}
          onClose={() => {
            setShowCreateForm(false)
            setSelectedWarehouse(null)
          }}
          onSave={async (warehouseData) => {
            if (selectedWarehouse) {
              await handleUpdateWarehouse(selectedWarehouse.id, warehouseData)
            } else {
              await handleCreateWarehouse(warehouseData)
            }
            setShowCreateForm(false)
            setSelectedWarehouse(null)
          }}
          loading={loading}
        />
      )}

      {/* Warehouse Details Modal */}
      {showDetailsModal && selectedWarehouse && (
        <WarehouseDetailsModal
          warehouse={selectedWarehouse}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedWarehouse(null)
          }}
          onEdit={() => {
            setShowDetailsModal(false)
            setShowCreateForm(true)
          }}
        />
      )}
    </div>
  )
}

const WarehouseCard = ({ warehouse, onView, onEdit, onDelete, loading }) => {
  return (
    <div className="warehouse-card">
      <div className="warehouse-header">
        <div className="warehouse-code">{warehouse.code}</div>
        <div className={`warehouse-status status-${warehouse.status.toLowerCase().replace(" ", "-")}`}>
          {warehouse.status}
        </div>
      </div>

      <div className="warehouse-content">
        <h3 className="warehouse-name">{warehouse.name}</h3>
        <div className="warehouse-type">{warehouse.type}</div>
        <div className="warehouse-location">📍 {warehouse.location}</div>
        <div className="warehouse-manager">👤 {warehouse.manager}</div>
        <div className="warehouse-capacity">📦 {warehouse.capacity}</div>
      </div>

      <div className="warehouse-stats">
        <div className="stat-item">
          <span className="stat-label">Zones</span>
          <span className="stat-value">{warehouse.zones}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Employees</span>
          <span className="stat-value">{warehouse.employees}</span>
        </div>
      </div>

      <div className="warehouse-actions">
        <button 
          className="btn-action btn-view" 
          onClick={onView}
          disabled={loading}
        >
          View
        </button>
        <button 
          className="btn-action btn-edit" 
          onClick={onEdit}
          disabled={loading}
        >
          Edit
        </button>
        <button 
          className="btn-action btn-delete" 
          onClick={() => onDelete(warehouse.id)}
          disabled={loading}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

const CreateWarehouseModal = ({ warehouse, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    code: warehouse?.code || `WH${String(Date.now()).slice(-3).padStart(3, "0")}`,
    name: warehouse?.name || "",
    type: warehouse?.type || "Distribution",
    location: warehouse?.location || "",
    address: warehouse?.address || "",
    manager: warehouse?.manager || "",
    phone: warehouse?.phone || "",
    email: warehouse?.email || "",
    capacity: warehouse?.capacity || "",
    status: warehouse?.status || "Active",
    zones: warehouse?.zones || 0,
    employees: warehouse?.employees || 0,
  })

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
    if (!formData.code || !formData.name || !formData.type || !formData.location || !formData.address) {
      alert("Please fill in all required fields")
      return
    }
    
    const warehouseData = {
      ...formData,
      zones: Number.parseInt(formData.zones) || 0,
      employees: Number.parseInt(formData.employees) || 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    }
    
    onSave(warehouseData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{warehouse ? "Edit Warehouse" : "Add New Warehouse"}</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="warehouse-form">
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Warehouse Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., WH001"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Warehouse Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Main Distribution Center"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  className="form-select" 
                  required
                  disabled={loading}
                >
                  <option value="Distribution">Distribution</option>
                  <option value="Storage">Storage</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Cross-dock">Cross-dock</option>
                </select>
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Location Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., New York, NY"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Full address"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Manager</label>
                <input
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Manager name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="manager@company.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Facility Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 50,000 sq ft"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Zones</label>
                <input
                  type="number"
                  name="zones"
                  value={formData.zones}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Employees</label>
                <input
                  type="number"
                  name="employees"
                  value={formData.employees}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Processing..." : (warehouse ? "Update Warehouse" : "Add Warehouse")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const WarehouseDetailsModal = ({ warehouse, onClose, onEdit }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Warehouse Details</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="warehouse-details">
          <div className="details-section">
            <h3 className="section-title">Basic Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Code:</span>
                <span className="detail-value">{warehouse.code}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{warehouse.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{warehouse.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`detail-value status-${warehouse.status.toLowerCase().replace(" ", "-")}`}>
                  {warehouse.status}
                </span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-title">Location</h3>
            <div className="details-grid">
              <div className="detail-item full-width">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{warehouse.location}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{warehouse.address}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Manager:</span>
                <span className="detail-value">{warehouse.manager}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{warehouse.phone}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{warehouse.email}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-title">Facility Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Capacity:</span>
                <span className="detail-value">{warehouse.capacity}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Zones:</span>
                <span className="detail-value">{warehouse.zones}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Employees:</span>
                <span className="detail-value">{warehouse.employees}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{warehouse.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={onEdit} className="btn btn-primary">
            Edit Warehouse
          </button>
        </div>
      </div>
    </div>
  )
}

export default WarehouseMaster