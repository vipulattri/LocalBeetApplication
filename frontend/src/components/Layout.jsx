"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import Header from "./Header"
import "./Layout.css"

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="main-content">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export default Layout
