"use client"

import { Link, useLocation } from "react-router-dom"
import "./Sidebar.css"

const navigation = [
  // { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Metric Creator", href: "/metric-creator", icon: "📊" },
  // { name: "Enquiry", href: "/enquiry", icon: "📄" },
  { name: "Recipe Maker", href: "/bills-of-material", icon: "📋" },
  { name: "Job Order", href: "/job-order", icon: "💼" },
  { name: "Purchase Order", href: "/purchase-order", icon: "🛒" },
  { name: "Goods Receipt Notes", href: "/goods-receipt-notes", icon: "📦" },
  { name: "Warehouse Master", href: "/warehouse-master", icon: "🏭" },
  { name: "Store Issue Voucher", href: "/store-issue-voucher", icon: "📋" },
  { name: "Item Master", href: "/item-master", icon: "📦" },
]

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()

  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">Recipe Management</h1>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href === "/goods-receipt-notes" && location.pathname.startsWith("/goods-receipt-notes")) ||
                (item.href === "/metric-creator" && location.pathname.startsWith("/metric-creator")) ||
                (item.href === "/warehouse-master" && location.pathname.startsWith("/warehouse-master")) ||
                (item.href === "/store-issue-voucher" && location.pathname.startsWith("/store-issue-voucher")) ||
                (item.href === "/purchase-order" && location.pathname.startsWith("/purchase-order")) ||
                (item.href === "/item-master" && location.pathname.startsWith("/item-master"))
              return (
                <li key={item.name} className="nav-item">
                  <Link
                    to={item.href}
                    className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <p className="user-name">John Doe</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
