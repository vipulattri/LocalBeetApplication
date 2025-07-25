
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./JobOrder.css"

const JobOrder = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [jobOrders, setJobOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch job orders from backend
    useEffect(() => {
    const fetchJobOrders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/JobOrder/get`)
        const rawRecords = response.data.records || []

        const transformedRecords = rawRecords.map((record) => {
          const jo = record.JobOrders
          return {
            id: jo.orderNumber || jo.ROWID,
            project: jo.productName || "N/A",
            client: jo.assignedTo || "N/A",
            startDate: jo.startDate || "-",
            endDate: jo.dueDate || "-",
            status: jo.status || "Pending",
            priority: jo.priorityJO || "Medium",
          }
        })

        setJobOrders(transformedRecords)
      } catch (error) {
        console.error("Error fetching job orders:", error)
        setJobOrders([]) // fallback
      } finally {
        setLoading(false)
      }
    }

    fetchJobOrders()
  }, [])


  const filteredOrders = jobOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "" || order.status === filterStatus
    const matchesPriority = filterPriority === "" || order.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="job-order-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Job Orders</h1>
            <p className="page-subtitle">Manage and track job orders and projects</p>
          </div>
          <Link to="/job-order/create" className="btn btn-primary">
            <span className="btn-icon">+</span>
            New Job Order
          </Link>
        </div>
      </div>

      <div className="search-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search job orders..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-message">Loading job orders...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Order ID</th>
                <th>Project</th>
                <th>Client</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-medium">{order.id}</td>
                  <td>{order.project}</td>
                  <td>{order.client}</td>
                  <td>{order.startDate}</td>
                  <td>{order.endDate}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase().replace(" ", "-")}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge priority-${order.priority.toLowerCase()}`}>{order.priority}</span>
                  </td>
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
        )}
      </div>

      {!loading && filteredOrders.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">💼</div>
            <h3 className="empty-state-title">No job orders found</h3>
            <p className="empty-state-description">
              {searchTerm || filterStatus || filterPriority
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first job order."}
            </p>
            {!searchTerm && !filterStatus && !filterPriority && (
              <Link to="/job-order/create" className="btn btn-primary">
                <span className="btn-icon">+</span>
                Create Your First Job Order
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default JobOrder
