"use client"

import { useEffect, useState } from "react"
import "./Enquiry.css"

const Enquiry = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch("http://localhost:3002/server/backend/api/enquiry/get")
        const data = await response.json()
        setEnquiries(data.records.map(record => record.Enquiry))
      } catch (error) {
        console.error("Failed to fetch enquiries:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiries()
  }, []);

  return (
    <div className="enquiry-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Enquiries</h1>
            <p className="page-subtitle">Manage and track customer enquiries</p>
          </div>
          <button className="btn btn-primary">
            <span className="btn-icon">+</span>
            New Enquiry
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search enquiries..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Under Review</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Enquiry ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id}>
                <td className="font-medium">{enquiry.id}</td>
                <td>{enquiry.customer}</td>
                <td>{enquiry.product}</td>
                <td>{enquiry.quantity}</td>
                <td>
                  <span className={`status-badge status-${enquiry.status.toLowerCase().replace(" ", "-")}`}>
                    {enquiry.status}
                  </span>
                </td>
                <td>{enquiry.date}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-edit">Edit</button>
                    <button className="btn-action btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Enquiry
