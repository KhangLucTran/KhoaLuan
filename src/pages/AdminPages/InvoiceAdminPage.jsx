import { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  getAllInvoicesApi,
  updateStatusInvoiceApi,
} from "../../features/invoice/invoiceApi";
import "../../styles/AdminInvoicePage.css";

const AdminInvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const statusMap = {
    Pending: "Chờ xử lý",
    Paid: "Đã thanh toán",
    Shipped: "Đã giao hàng",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
    All: "Tất cả",
  };

  // Láy giá trị tất cả hóa đơn từ Invoice
  useEffect(() => {
    getAllInvoicesApi()
      .then((data) => {
        setInvoices(data.invoices);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Xử lí khi bấm qua Tab mới
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Xử lí update trạng thái sản phẩm
  const handleUpdateStatus = async (invoiceId, newStatus) => {
    try {
      await updateStatusInvoiceApi(invoiceId, { status: newStatus });
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice._id === invoiceId
            ? { ...invoice, status: newStatus }
            : invoice
        )
      );
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Có lỗi xảy ra: {error.message}</p>;

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (activeTab === "All" || invoice.status === activeTab) &&
      (invoice.user.email.toLowerCase().includes(search.toLowerCase()) ||
        invoice.vnp_TxnRef.includes(search))
  );

  // Tính số lượng hóa đơn theo trạng thái
  const statusCounts = Object.keys(statusMap).reduce((counts, status) => {
    counts[status] = invoices.filter(
      (invoice) => invoice.status === status
    ).length;
    return counts;
  }, {});

  return (
    <>
      <h2>HÓA ĐƠN</h2>
      <div className="admin-invoice-container">
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "1rem" }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.keys(statusMap).map((status) => (
              <Tab
                key={status}
                label={`${statusMap[status]} (${statusCounts[status] || 0})`}
                value={status}
              />
            ))}
          </Tabs>
        </Box>
        <TextField
          label="Tìm kiếm hóa đơn"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã hóa đơn</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thanh toán</TableCell>
                <TableCell>Ngân hàng</TableCell>
                <TableCell>Tổng cộng</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Không có hóa đơn nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice._id}>
                    <TableCell>{invoice.vnp_TxnRef || "N/A"}</TableCell>
                    <TableCell>
                      {invoice.user.profileId?.username || "Không xác định"}
                    </TableCell>
                    <TableCell>
                      {invoice.user.email || "Không xác định"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={invoice.status}
                        onChange={(e) =>
                          handleUpdateStatus(invoice._id, e.target.value)
                        }
                      >
                        {Object.keys(statusMap)
                          .filter((s) => s !== "All")
                          .map((status) => (
                            <MenuItem key={status} value={status}>
                              {statusMap[status]}
                            </MenuItem>
                          ))}
                      </Select>
                    </TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>{invoice.vnp_BankCode}</TableCell>
                    <TableCell>
                      {invoice.totalAmount.toLocaleString()} VND
                    </TableCell>
                    <TableCell>
                      {invoice.status === "Pending" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(invoice._id, "Cancelled")
                          }
                          color="error"
                          variant="contained"
                        >
                          Hủy
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default AdminInvoicePage;
