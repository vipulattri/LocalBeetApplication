"use client"

import "./Header.css"

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-button" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h2 className="header-title">Welcome to Recipe Management System</h2>
        </div>

        <div className="header-right">
          <button className="notification-button">🔔</button>
          <div className="user-avatar-header">JD</div>
        </div>
      </div>
    </header>
  )
}

export default Header
