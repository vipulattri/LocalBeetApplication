"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditStoreIssueVoucher.css";

const EditStoreIssueVoucher = () => {
  const { voucherNumber } = useParams();
  const navigate = useNavigate();

  const [voucherData, setVoucherData] = useState({
    issueDate: "",
    department: "",
    issuedBy: "",
    receivedBy: "",
    items: [{ itemName: "", qty: 1 }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const departments = ["Production", "Maintenance", "Quality Control", "Packaging", "Shipping"];

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const res = await fetch(
          `http://localhost:3002/server/backend/api/storeIssueVoucher/get/${voucherNumber}`
        );
        const data = await res.json();
        if (data.success) {
          setVoucherData({
            issueDate: data.data.issueDate ? data.data.issueDate.slice(0, 10) : "",
            department: data.data.department || "",
            issuedBy: data.data.issuedBy || "",
            receivedBy: data.data.receivedBy || "",
            items: data.data.items && data.data.items.length > 0 ? data.data.items : [{ itemName: "", qty: 1 }],
          });
        } else {
          throw new Error(data.message || "Failed to fetch voucher");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [voucherNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...voucherData.items];
    if (field === "qty") {
      const qtyValue = Number(value);
      newItems[index][field] = qtyValue >= 0 ? qtyValue : 0;
    } else {
      newItems[index][field] = value;
    }
    setVoucherData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setVoucherData((prev) => ({
      ...prev,
      items: [...prev.items, { itemName: "", qty: 1 }],
    }));
  };

  const removeItem = (index) => {
    if (voucherData.items.length === 1) return; // at least one item required
    const newItems = voucherData.items.filter((_, i) => i !== index);
    setVoucherData((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!voucherData.issueDate || !voucherData.department || !voucherData.issuedBy || !voucherData.receivedBy) {
      setError("Please fill all required fields.");
      return;
    }
    // Validate items
    if (
      !voucherData.items.length ||
      voucherData.items.some((item) => !item.itemName.trim() || item.qty <= 0)
    ) {
      setError("Please fill valid item names and quantities (qty > 0).");
      return;
    }

    const payload = {
      issueDate: voucherData.issueDate,
      department: voucherData.department,
      issuedBy: voucherData.issuedBy,
      receivedBy: voucherData.receivedBy,
      items: voucherData.items,
    };

    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:3002/server/backend/api/storeIssueVoucher/update/${voucherNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Voucher updated successfully.");
        navigate("/store-issue-voucher");
      } else {
        throw new Error(data.message || "Failed to update voucher");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading voucher data...</p>;

  return (
    <div className="edit-voucher-page">
      <h1>Edit Store Issue Voucher - {voucherNumber}</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="voucher-form">
        <label>
          Issue Date *
          <input
            type="date"
            name="issueDate"
            value={voucherData.issueDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Department *
          <select
            name="department"
            value={voucherData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </label>

        <label>
          Issued By *
          <input
            type="text"
            name="issuedBy"
            value={voucherData.issuedBy}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Received By *
          <input
            type="text"
            name="receivedBy"
            value={voucherData.receivedBy}
            onChange={handleChange}
            required
          />
        </label>

        <fieldset className="items-section">
          <legend>Items *</legend>
          {voucherData.items.map((item, index) => (
            <div key={index} className="item-row">
              <input
                type="text"
                placeholder="Item Name"
                value={item.itemName}
                onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                required
              />
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={item.qty}
                onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                required
              />
              <button type="button" className="btn-remove" onClick={() => removeItem(index)} title="Remove Item">
                &times;
              </button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={addItem}>
            + Add Item
          </button>
        </fieldset>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditStoreIssueVoucher;
