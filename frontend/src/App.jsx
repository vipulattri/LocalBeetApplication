import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import JobOrder from "./pages/JobOrder";
import CreateJobOrder from "./pages/CreateJobOrder";
import BillsOfMaterial from "./pages/BillsOfMaterial";
import CreateBillOfMaterial from "./pages/CreateBillOfMaterial";
import GoodsReceiptNotes from "./pages/GoodsReceiptNotes";
import CreateGRN from "./pages/CreateGRN";
import MetricCreator from "./pages/MetricCreator";
import WarehouseMaster from "./pages/WareHouseMaster";
import StoreIssueVoucher from "./pages/StoreIssueVoucher";
import CreateStoreIssueVoucher from "./pages/CreateStoreIssueVoucher";
import PurchaseOrder from "./pages/PurchaseOrder";
import CreatePurchaseOrder from "./pages/CreatePurchaseOrder";
import ItemMaster from "./pages/ItemMaster";
import EditStoreIssueVoucher from "./pages/EditStoreIssueVoucher";
import EditPurchaseOrder from "./pages/EditPurchaseOrder";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/job-order" element={<JobOrder />} />
        <Route path="/job-order/create" element={<CreateJobOrder />} />
        <Route path="/bills-of-material" element={<BillsOfMaterial />} />
        <Route path="/bills-of-material/create" element={<CreateBillOfMaterial />} />
        <Route path="/goods-receipt-notes" element={<GoodsReceiptNotes />} />
        <Route path="/goods-receipt-notes/create" element={<CreateGRN />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        <Route path="/purchase-order/create" element={<CreatePurchaseOrder />} />
        <Route path="/purchase-order/edit/:poNumber" element={<EditPurchaseOrder />} />
        <Route path="/metric-creator" element={<MetricCreator />} />
        <Route path="/warehouse-master" element={<WarehouseMaster />} />
        <Route path="/store-issue-voucher" element={<StoreIssueVoucher />} />
        <Route path="/store-issue-voucher/create" element={<CreateStoreIssueVoucher />} />
        <Route path="/store-issue-voucher/edit/:voucherNumber" element={<EditStoreIssueVoucher />} />
        <Route path="/item-master" element={<ItemMaster />} />
      </Routes>
    </Layout>
  );
}

export default App;