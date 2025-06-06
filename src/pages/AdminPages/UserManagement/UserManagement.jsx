import { useEffect, useState, useCallback } from "react";
import {
  CircularProgress,
  IconButton,
  Checkbox,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  getAllUsersApi,
  deleteUserApi,
  updateInfoAdmin,
} from "../../../features/user/userApi";
import defaultAvatar from "../../../assets/default_human.png";
import { getInvoiceByUserIdAdminApi } from "../../../features/invoice/invoiceApi";
import CustomTooltip from "../../../components/CustomTooltip/CustomTooltip";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const [activeTab, setActiveTab] = useState(0);
  const [editUser, setEditUser] = useState(null);
  const [userInvoices, setUserInvoices] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch dữ liệu users khi vào trang
  const fetchUsers = useCallback(async () => {
    try {
      const response = await getAllUsersApi();
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        throw new Error("API không trả về danh sách người dùng hợp lệ.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!editUser?._id || activeTab !== 1) return;

      try {
        setLoadingInvoices(true);
        const data = await getInvoiceByUserIdAdminApi(editUser._id);
        setUserInvoices(data.invoice);
        console.log("API invoice:", data.invoice);
      } catch (err) {
        console.error("Lỗi lấy hóa đơn:", err);
      } finally {
        setLoadingInvoices(false);
      }
    };

    fetchInvoices();
  }, [editUser, activeTab]);
  // Hàm xử lí mở Dialog Chỉnh sửa
  const handleEditClick = (user) => {
    setEditUser({ ...user, profileId: { ...user.profileId } });
    setOpenEditDialog(true);
  };

  // Hàm xử lí lưu dữ liệu người dùng mới được cập nhật
  const handleSaveEdit = async () => {
    try {
      const response = await updateInfoAdmin({
        userId: editUser._id,
        updateData: editUser,
      });

      if (response.error === 0) {
        // Cập nhật trực tiếp trong state mà không gọi lại fetchUsers
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editUser._id ? { ...user, ...response.data } : user
          )
        );
        console.log("API invoice:", response.data);
        setOpenEditDialog(false);
      } else {
        console.error("Lỗi từ API:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
    }
  };

  // Hàm xử lí mở Dialog Delete
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  // Hàm xử lí xóa dữ liệu người dùng
  const handleConfirmDelete = async () => {
    try {
      await deleteUserApi(userToDelete._id);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userToDelete._id)
      );
      setSelectedUsers((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(userToDelete._id);
        return newSelected;
      });
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  // Hàm xử lí khi Page có sự thay đổi dữ liệu
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Hàm xử lí khi checkbox được chọn
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(userId)) {
        newSelected.delete(userId);
      } else {
        newSelected.add(userId);
      }
      return newSelected;
    });
  };

  const mappingUser = (provider) => {
    const providerMapping = {
      system: "Hệ thống",
      google: "Google",
      facebook: "Facebook",
      User: "Người dùng",
      Admin: "Quản trị viên",
    };
    return providerMapping[provider] || provider;
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.profileId?.username?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="user-management-container">
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <h2 className="user-table-header">TÀI KHOẢN</h2>
          <p className="user-table-header-detail">
            Tại khu vực này, <span>Admin</span> có thể theo dõi và quản lý toàn
            bộ tài khoản khách hàng trên{" "}
            <span className="user-table-header-logo">Levents</span>, bao gồm xem
            danh sách người dùng, tìm kiếm nhanh theo tên hoặc email, phân quyền
            truy cập <span>(Admin/User)</span>, khóa hoặc mở khóa tài khoản, và
            xem lịch sử hoạt động mua sắm. Mục tiêu là đảm bảo trải nghiệm mua
            sắm an toàn, mượt mà và cá nhân hóa cho từng khách hàng.
          </p>
          <div className="user-table-header-search">
            <TextField
              label="Tìm kiếm theo Email hoặc Tên"
              variant="outlined"
              size="small"
              fullWidth
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon style={{ color: "#111111" }} />,
              }}
            />
          </div>
          <div className="user-table">
            <div className="table-header">
              <div className="table-cell check"></div>
              <div className="table-cell">Avatar</div>
              <div className="table-cell">Email</div>
              <div className="table-cell">ID</div>
              <div className="table-cell">Tên tài khoản</div>
              <div className="table-cell">Provider</div>
              <div className="table-cell">Vai trò</div>
              <div className="table-cell">Xác thực</div>
              <div className="table-cell">Ngày tạo</div>
              <div className="table-cell">Cập nhật</div>
              <div className="table-cell action">Hành động</div>
            </div>
            {paginatedUsers.map((user, index) => (
              <div
                className={`table-row ${index % 2 === 0 ? "even" : "odd"}`}
                key={user._id}
              >
                <div className="table-cell check">
                  <Checkbox
                    checked={selectedUsers.has(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                  />
                </div>
                <div className="table-cell">
                  <Avatar
                    src={user.profileId?.avatar || defaultAvatar}
                    alt="Avatar"
                    variant="square"
                    sx={{ width: 50, height: 50, borderRadius: 1 }}
                    className="avatar"
                  />
                </div>
                <div className="table-cell">{user.email}</div>
                <div className="table-cell">{user._id}</div>
                <div className="table-cell">{user.profileId?.username}</div>
                <div className="table-cell">{mappingUser(user.provider)}</div>
                <div className="table-cell">
                  {mappingUser(user.role_code?.value) || "Không có"}
                </div>
                <div className="table-cell">
                  {user.verifyState === "true"
                    ? "Đã xác thực"
                    : "Chưa xác thực"}
                </div>
                <div className="table-cell">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "Không có dữ liệu"}
                </div>
                <div className="table-cell">
                  {user.updatedAt
                    ? new Date(user.updatedAt).toLocaleString()
                    : "Không có dữ liệu"}
                </div>

                {/* Khi user được chọn: Hiện 2 button {edit, delete} */}
                <div className="table-cell action">
                  {selectedUsers.has(user._id) && (
                    <>
                      <CustomTooltip title="Xem và Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </CustomTooltip>
                      {/*Icon button Delete  */}
                      <CustomTooltip title="Xóa tài khoản">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </CustomTooltip>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang khi tối đa 5 dòng dữ liệu */}
          <div className="pagination-container">
            <Pagination
              count={Math.ceil(filteredUsers.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              size="large"
            />
          </div>

          {/* Dialog xóa người dùng */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>XÁC NHẬN XÓA</DialogTitle>
            <DialogContent>
              Bạn có chắc chắn muốn xóa người dùng này không?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
              <Button onClick={handleConfirmDelete}>Xóa</Button>
            </DialogActions>
          </Dialog>

          {/* Dialog chỉnh sửa, xem chi tiết lịch sử mua sắm */}
          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: "20px",
                backgroundColor: "#ffffff",
              }}
            >
              CHI TIẾT NGƯỜI DÙNG
            </DialogTitle>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              centered
              textColor="primary"
            >
              <Tab label="THÔNG TIN" />
              <Tab label="LỊCH SỬ MUA SẮM" />
            </Tabs>
            <DialogContent sx={{ backgroundColor: "#ffffff" }}>
              {activeTab === 0 && (
                <div className="edit-user-form">
                  {/* --- Form chỉnh sửa thông tin --- */}
                  <div
                    style={{
                      width: "40%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <CustomTooltip title="Ảnh đại diện">
                      <Avatar
                        src={editUser?.profileId?.avatar || defaultAvatar}
                        alt="Avatar"
                        variant="square"
                        className="edit-user-form-info-avatar"
                        sx={{
                          width: 200,
                          height: 200,
                          borderRadius: 2,
                          border: "1px solid #ccc",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </CustomTooltip>

                    {/* Vai trò của người dùng */}
                    <div className="edit-user-role-container">
                      <p
                        className={`edit-user-role-text ${editUser?.role_code?.value?.toLowerCase()}`}
                      >
                        {mappingUser(editUser?.role_code?.value) ||
                          "Không có vai trò"}
                      </p>
                    </div>
                  </div>
                  <div style={{ width: "60%" }}>
                    <Stack spacing={2}>
                      <CustomTooltip title="Tên hiển thị của người dùng">
                        <TextField
                          label="Tên tài khoản"
                          fullWidth
                          margin="dense"
                          value={editUser?.profileId?.username || ""}
                          onChange={(e) =>
                            setEditUser((prevUser) => ({
                              ...prevUser,
                              profileId: {
                                ...prevUser.profileId,
                                username: e.target.value,
                              },
                            }))
                          }
                        />
                      </CustomTooltip>

                      <CustomTooltip title="Số điện thoại của người dùng">
                        <TextField
                          label="Số điện thoại"
                          fullWidth
                          margin="dense"
                          value={editUser?.profileId?.numberphone || ""}
                          onChange={(e) =>
                            setEditUser((prevUser) => ({
                              ...prevUser,
                              profileId: {
                                ...prevUser.profileId,
                                numberphone: e.target.value,
                              },
                            }))
                          }
                        />
                      </CustomTooltip>

                      <CustomTooltip title="Ngày sinh của người dùng">
                        <TextField
                          label="Ngày sinh"
                          fullWidth
                          margin="dense"
                          value={
                            editUser?.profileId?.dob
                              ? new Date(
                                  editUser.profileId.dob
                                ).toLocaleDateString()
                              : ""
                          }
                          onChange={(e) =>
                            setEditUser((prevUser) => ({
                              ...prevUser,
                              profileId: {
                                ...prevUser.profileId,
                                dob: e.target.value,
                              },
                            }))
                          }
                        />
                      </CustomTooltip>

                      <CustomTooltip title="Email không thể thay đổi">
                        <TextField
                          label="Email"
                          fullWidth
                          margin="dense"
                          value={editUser?.email || ""}
                          disabled
                        />
                      </CustomTooltip>

                      <CustomTooltip title="Ngày tạo tài khoản không thể thay đổi">
                        <TextField
                          label="Ngày tạo tài khoản"
                          fullWidth
                          margin="dense"
                          value={
                            editUser?.createdAt
                              ? new Date(editUser.createdAt).toLocaleString()
                              : ""
                          }
                          disabled
                        />
                      </CustomTooltip>

                      <CustomTooltip title="Ngày cập nhật tài khoản không thể thay đổi">
                        <TextField
                          label="Ngày cập nhật tài khoản"
                          fullWidth
                          margin="dense"
                          value={
                            editUser?.updatedAt
                              ? new Date(editUser.updatedAt).toLocaleString()
                              : ""
                          }
                          disabled
                        />
                      </CustomTooltip>
                    </Stack>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <>
                  {loadingInvoices ? (
                    <div className="loading-container">
                      <CircularProgress />
                    </div>
                  ) : userInvoices?.length > 0 ? (
                    userInvoices.map((invoice) => (
                      <div key={invoice._id} className="invoice-card">
                        <p>
                          <strong>ID hóa đơn:</strong> {invoice._id}
                        </p>
                        <p>
                          <strong>Ngày tạo:</strong>{" "}
                          {new Date(invoice.createdAt).toLocaleString()}
                        </p>
                        <p>
                          <strong>Tổng tiền:</strong>{" "}
                          {invoice.total?.toLocaleString()} VND
                        </p>
                        <p>
                          <strong>Trạng thái:</strong> {invoice.status}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>Không có hóa đơn nào cho người dùng này.</p>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "space-between",
                px: 3,
                pb: 2,
                backgroundColor: "#ffffff",
              }}
            >
              <Button onClick={() => setOpenEditDialog(false)}>Đóng</Button>
              {activeTab === 0 && (
                <Button variant="contained" onClick={handleSaveEdit}>
                  Lưu thay đổi
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default UserManagement;
