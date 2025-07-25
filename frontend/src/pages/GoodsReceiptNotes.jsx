import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import "./GoodsReceiptNotes.css"

const GoodsReceiptNotes = () => {
  const [grns, setGrns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchGRNs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/goodReceiptNotes/get`)
        setGrns(response.data.data || [])
      } catch (err) {
        setError("Failed to fetch GRNs")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchGRNs()
  }, []);

  return (
    <div className="grn-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Goods Receipt Notes</h1>
          </div>
          <Link to="/goods-receipt-notes/create" className="btn btn-primary">
            <span className="btn-icon">+</span>
            Create GRN
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : grns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No goods receipt notes found</h3>
            <p className="empty-state-description">Get started by creating a new GRN.</p>
            <Link to="/goods-receipt-notes/create" className="btn btn-primary">
              <span className="btn-icon">+</span>
              Create GRN
            </Link>
          </div>
        </div>
      ) : (
        <div className="grn-list">
          {grns.map((grn) => (
            <div key={grn.grnNumber} className="grn-card">
              <h4>GRN Number: {grn.grnNumber}</h4>
              <p>Vendor: {grn.vendorName}</p>
              <p>Date: {grn.receiptDate}</p>
              <Link to={`/goods-receipt-notes/view/${grn.grnNumber}`} className="btn btn-secondary">
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GoodsReceiptNotes
