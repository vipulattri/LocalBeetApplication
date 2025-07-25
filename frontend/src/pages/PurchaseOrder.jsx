"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./PurchaseOrder.css"

const API_BASE = `${process.env.REACT_APP_BASE_URL}/api/purchaseOrders`

const PurchaseOrder = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterVendor, setFilterVendor] = useState("")

  const navigate = useNavigate()

  const vendors = Array.from(new Set(purchaseOrders.map(po => po.vendorName))).filter(Boolean)
  const statusOptions = ["Draft", "Approved", "Completed", "Cancelled"]

  useEffect(() => {
    fetchPurchaseOrders()
  }, [])

  async function fetchPurchaseOrders() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/get`) // Adjust endpoint to your actual list API
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.message || "Failed to fetch data")
      // Assuming json.data is an array of purchaseOrders
      setPurchaseOrders(json.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function deletePurchaseOrder(poNumber) {
    if (!window.confirm(`Are you sure you want to delete Purchase Order ${poNumber}?`)) return
    try {
      const res = await fetch(`${API_BASE}/delete/${poNumber}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (!json.success) {
        alert(`Failed to delete: ${json.message}`)
        return
      }
      alert(`Purchase Order ${poNumber} deleted successfully.`)
      // Remove deleted PO from state
      setPurchaseOrders((prev) => prev.filter((po) => po.poNumber !== poNumber))
    } catch (err) {
      alert(`Error deleting purchase order: ${err.message}`)
    }
  }

  const filteredOrders = purchaseOrders.filter((order) => {
    const poNumber = order.poNumber || ""
    const vendorName = order.vendorName || ""

    const matchesSearch =
      poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendorName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "" || order.status === filterStatus
    const matchesVendor = filterVendor === "" || vendorName === filterVendor
    return matchesSearch && matchesStatus && matchesVendor
  })


  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="purchase-order-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Purchase Orders</h1>
            <p className="page-subtitle">Manage and track purchase orders</p>
          </div>
          <Link to="/purchase-order/create" className="btn btn-primary">
            <span className="btn-icon">+</span>
            Create Purchase Order
          </Link>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search purchase orders..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterVendor} onChange={(e) => setFilterVendor(e.target.value)}>
            <option value="">All Vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div>Loading purchase orders...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Vendor</th>
              <th>Order Date</th>
              <th>Expected Delivery</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.ROWID || order.poNumber}>
                  <td className="font-medium">{order.poNumber}</td>
                  <td>{order.vendorName}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>{formatDate(order.expectedDeliveryDate)}</td>
                  <td>{order.itemCount || "-"}</td>
                  <td className="font-medium">{order.totalAmount || "-"}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-view"
                        onClick={() => navigate(`/purchase-order/view/${order.poNumber}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn-action btn-edit"
                        onClick={() => navigate(`/purchase-order/edit/${order.poNumber}`)}
                      >
                        Edit
                      </button>
                      <button className="btn-action btn-delete" onClick={() => deletePurchaseOrder(order.poNumber)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No purchase orders found</h3>
            <p className="empty-state-description">
              {searchTerm || filterStatus || filterVendor
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first purchase order."}
            </p>
            {!searchTerm && !filterStatus && !filterVendor && (
              <Link to="/purchase-order/create" className="btn btn-primary">
                <span className="btn-icon">+</span>
                Create Your First Purchase Order
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrder
