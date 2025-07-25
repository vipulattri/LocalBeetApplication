import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./BillsOfMaterial.css"

const BillsOfMaterial = () => {
  const [billsOfMaterial, setBillsOfMaterial] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBOMs = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/BOM/get`)
        setBillsOfMaterial(res.data.data) // 🔥 Fix here
      } catch (err) {
        console.error("Failed to fetch BOMs:", err)
      } finally {
        setLoading(false)
      }
    }
  
    fetchBOMs()
  }, [])
  

  const filteredBOMs = billsOfMaterial.filter((bom) => {
    const matchesSearch =
      bom.bomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bom.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "" || bom.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="bom-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Bills of Material</h1>
            <p className="page-subtitle">Manage product components and material lists</p>
          </div>
          <Link to="/bills-of-material/create" className="btn btn-primary">
            <span className="btn-icon">+</span> New Recipe Maker
          </Link>
        </div>
      </div>

      <div className="search-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search bills of material..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Released">Released</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>BOM Number</th>
              <th>Product</th>
              <th>Version</th>
              <th>Status</th>
              <th>Batch Size</th>
              <th>Production Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBOMs.map((bom) => (
              <tr key={bom.bomNumber}>
                <td className="font-medium">{bom.bomNumber}</td>
                <td>{bom.productName}</td>
                <td>{bom.version}</td>
                <td>
                  <span className={`status-badge status-${bom.status.toLowerCase().replace(" ", "-")}`}>
                    {bom.status}
                  </span>
                </td>
                <td>{bom.batchSize}</td>
                <td>{bom.productionTime}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-edit">Edit</button>
                    <button className="btn-action btn-view">View</button>
                    <button className="btn-action btn-delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBOMs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No bills of material found</h3>
            <p className="empty-state-description">
              {searchTerm || filterStatus
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first bill of material."}
            </p>
            {!searchTerm && !filterStatus && (
              <Link to="/bills-of-material/create" className="btn btn-primary">
                <span className="btn-icon">+</span> Create Your First BOM
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BillsOfMaterial
