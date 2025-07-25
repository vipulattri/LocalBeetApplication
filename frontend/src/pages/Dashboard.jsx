import "./Dashboard.css"

const Dashboard = () => {
  const stats = [
    { name: "Total Enquiries", value: "24", icon: "📄", color: "blue" },
    { name: "Active Job Orders", value: "12", icon: "💼", color: "green" },
    { name: "Bills of Material", value: "8", icon: "📋", color: "purple" },
    { name: "Completed Orders", value: "156", icon: "📊", color: "orange" },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your business today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.name} className="stat-card">
            <div className="stat-content">
              <div className={`stat-icon stat-icon-${stat.color}`}>
                <span>{stat.icon}</span>
              </div>
              <div className="stat-info">
                <p className="stat-name">{stat.name}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="activity-grid">
        <div className="activity-card">
          <h3 className="activity-title">Recent Enquiries</h3>
          <div className="activity-list">
            {[1, 2, 3].map((item) => (
              <div key={item} className="activity-item">
                <div className="activity-info">
                  <p className="activity-primary">Enquiry #{item}001</p>
                  <p className="activity-secondary">Customer Name {item}</p>
                </div>
                <span className="status-badge status-pending">Pending</span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-card">
          <h3 className="activity-title">Active Job Orders</h3>
          <div className="activity-list">
            {[1, 2, 3].map((item) => (
              <div key={item} className="activity-item">
                <div className="activity-info">
                  <p className="activity-primary">Job Order #{item}001</p>
                  <p className="activity-secondary">Project {item}</p>
                </div>
                <span className="status-badge status-progress">In Progress</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
