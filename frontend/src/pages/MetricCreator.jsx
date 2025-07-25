import { useState, useEffect } from "react";
import axios from "axios";
import "./MetricCreator.css";

const MetricCreator = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const categories = ["Raw Material", "Consumable", "Sealing", "Hardware"]; // Extracted from your data

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/metric/get`);
        setItems(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load items. Please try again later.");
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      (item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Create a new item
  const handleCreateItem = async (newItem) => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/metric/create`, newItem);
      setItems([...items, response.data]);
      setShowCreateForm(false);
    } catch (err) {
      setError("Failed to create item. Please try again.");
      console.error("Error creating item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing item
  const handleUpdateItem = async (updatedItem) => {
    try {
      setLoading(true);
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/metric/update/${updatedItem.ROWID}`, updatedItem);
      setItems(items.map(item => 
        item.ROWID === updatedItem.ROWID ? response.data : item
      ));
      setEditingItem(null);
    } catch (err) {
      setError("Failed to update item. Please try again.");
      console.error("Error updating item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const handleDeleteItem = async (rowId) => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/metric/delete/${rowId}`);
      setItems(items.filter(item => item.ROWID !== rowId));
    } catch (err) {
      setError("Failed to delete item. Please try again.");
      console.error("Error deleting item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="metric-creator-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Inventory Manager</h1>
            <p className="page-subtitle">Manage your inventory items</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              setEditingItem(null);
              setShowCreateForm(true);
            }}
          >
            <span className="btn-icon">+</span>
            Add New Item
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-close">
            ×
          </button>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading items...</p>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="controls-section">
        <div className="search-filters">
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="metrics-grid">
        {filteredItems.map((item) => (
          <div key={item.ROWID} className="metric-card">
            <div className="metric-header">
              <div className="metric-category">{item.category}</div>
              <div className="metric-actions">
                <button 
                  className="action-btn"
                  onClick={() => {
                    setEditingItem(item);
                    setShowCreateForm(true);
                  }}
                >
                  ⚙️
                </button>
                <button 
                  className="action-btn"
                  onClick={() => handleDeleteItem(item.ROWID)}
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="metric-content">
              <h3 className="metric-name">{item.itemName}</h3>
              <div className="metric-value">
                <div>Code: {item.itemCode}</div>
                <div>Stock: {item.currentStock} {item.unitOfMeasure}</div>
                {item.price && <div>Price: ${item.price}</div>}
              </div>
            </div>
            <div className="metric-footer">
              <span className="last-updated">
                {new Date(item.MODIFIEDTIME).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredItems.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No items found</h3>
            <p className="empty-state-description">
              {searchTerm || filterCategory
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first inventory item."}
            </p>
            {!searchTerm && !filterCategory && (
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setEditingItem(null);
                  setShowCreateForm(true);
                }}
              >
                <span className="btn-icon">+</span>
                Add First Item
              </button>
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Item Modal */}
      {showCreateForm && (
        <ItemFormModal
          item={editingItem}
          onClose={() => {
            setShowCreateForm(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? handleUpdateItem : handleCreateItem}
          categories={categories}
        />
      )}
    </div>
  );
};

const ItemFormModal = ({ item, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState(
    item || {
      itemName: "",
      itemCode: "",
      category: "Raw Material",
      description: "",
      unitOfMeasure: "Pieces",
      price: 0,
      currentStock: 0
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{item ? "Edit Item" : "Add New Item"}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="metric-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Steel Rod"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Item Code</label>
              <input
                type="text"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., ITM331"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <input
                type="text"
                name="unitOfMeasure"
                value={formData.unitOfMeasure}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., Pieces, Meters"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberInputChange}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Stock</label>
              <input
                type="number"
                name="currentStock"
                value={formData.currentStock}
                onChange={handleNumberInputChange}
                className="form-input"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Item description..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MetricCreator;