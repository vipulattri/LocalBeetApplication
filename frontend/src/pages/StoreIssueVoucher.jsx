"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./StoreIssueVoucher.css"

const StoreIssueVoucher = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [selectedVoucher, setSelectedVoucher] = useState(null)

  const navigate = useNavigate()

  const departments = ["Production", "Maintenance", "Quality Control", "Packaging", "Shipping"]
  const statusOptions = ["Pending", "Completed", "Cancelled"]

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/storeIssueVoucher/get`)
        const data = await res.json()
        if (data.success) {
          setVouchers(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch vouchers")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVouchers()
  }, [])

  const handleDelete = async (voucherNumber) => {
    if (!window.confirm("Are you sure you want to delete this voucher?")) return

    try {
      const res = await fetch(`http://localhost:3002/server/backend/api/storeIssueVoucher/delete/${voucherNumber}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success) {
        setVouchers((prev) => prev.filter((v) => v.voucherNumber !== voucherNumber))
      } else {
        alert(data.message || "Failed to delete voucher")
      }
    } catch (err) {
      alert("Error deleting voucher: " + err.message)
    }
  }

  const handleEdit = (voucherNumber) => {
    navigate(`/store-issue-voucher/edit/${voucherNumber}`)
  }

  const handleView = (voucher) => {
    setSelectedVoucher(voucher)
  }

  const closeDialog = () => {
    setSelectedVoucher(null)
  }

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.issuedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.receivedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "" || voucher.status === filterStatus
    const matchesDepartment = filterDepartment === "" || voucher.department === filterDepartment
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="store-issue-voucher-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Store Issue Voucher</h1>
            <p className="page-subtitle">Manage and track store issue vouchers</p>
          </div>
          <Link to="/store-issue-voucher/create" className="btn btn-primary">
            <span className="btn-icon">+</span>
            Create Store Issue Voucher
          </Link>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search vouchers..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading vouchers...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && filteredVouchers.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Voucher Number</th>
                <th>Issue Date</th>
                <th>Department</th>
                <th>Job Order</th>
                <th>Issued By</th>
                <th>Received By</th>
                <th>Items</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.map((voucher) => (
                <tr key={voucher.voucherNumber}>
                  <td className="font-medium">{voucher.voucherNumber}</td>
                  <td>{formatDate(voucher.issueDate)}</td>
                  <td>{voucher.department}</td>
                  <td>{voucher.jobOrderReference || "-"}</td>
                  <td>{voucher.issuedBy}</td>
                  <td>{voucher.receivedBy}</td>
                  <td>{voucher.totalItems || 0}</td>
                  <td>
                    <span className={`status-badge status-${voucher.status?.toLowerCase()}`}>{voucher.status || "-"}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-view" onClick={() => handleView(voucher)}>View</button>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(voucher.voucherNumber)}>Edit</button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(voucher.voucherNumber)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredVouchers.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No store issue vouchers found</h3>
            <p className="empty-state-description">
              {searchTerm || filterStatus || filterDepartment
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first store issue voucher."}
            </p>
            {!searchTerm && !filterStatus && !filterDepartment && (
              <Link to="/store-issue-voucher/create" className="btn btn-primary">
                <span className="btn-icon">+</span>
                Create Your First Voucher
              </Link>
            )}
          </div>
        </div>
      )}

      {/* View Dialog */}
      {selectedVoucher && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <h2>Voucher Details</h2>
            <div className="dialog-content">
              <p><strong>Voucher Number:</strong> {selectedVoucher.voucherNumber}</p>
              <p><strong>Issue Date:</strong> {formatDate(selectedVoucher.issueDate)}</p>
              <p><strong>Department:</strong> {selectedVoucher.department}</p>
              <p><strong>Job Order:</strong> {selectedVoucher.jobOrderReference || "-"}</p>
              <p><strong>Issued By:</strong> {selectedVoucher.issuedBy}</p>
              <p><strong>Received By:</strong> {selectedVoucher.receivedBy}</p>
              <p><strong>Status:</strong> {selectedVoucher.status}</p>
              <p><strong>Items:</strong> {selectedVoucher.totalItems || 0}</p>
            </div>
            <button className="dialog-close" onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StoreIssueVoucher
