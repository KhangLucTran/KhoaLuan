import { useEffect, useState } from "react";
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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import "../../styles/UsersPage.css";
import {
  getAllUsersApi,
  deleteUserApi,
  updateInfoAdmin,
} from "../../features/user/userApi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [editUser, setEditUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch dữ liệu users khi vào trang
  const fetchUsers = async () => {
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
  };

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
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editUser._id ? { ...user, ...response.data } : user
          )
        );
        fetchUsers();
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

  const paginatedUsers = users.slice(
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
          <div className="user-table">
            <div className="table-header">
              <div className="table-cell check"></div>
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
                <div className="table-cell">{user.email}</div>
                <div className="table-cell">{user._id}</div>
                <div className="table-cell">{user.profileId?.username}</div>
                <div className="table-cell">{user.provider}</div>
                <div className="table-cell">
                  {user.role_code?.value || "Không có"}
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
                      {/*Icon button Edit  */}
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(user)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      {/*Icon button Delete  */}
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang khi tối đa 5 dòng dữ liệu */}
          <div className="pagination-container">
            <Pagination
              count={Math.ceil(users.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>

          {/* Dialog chỉnh sửa */}
          <Dialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
          >
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            <DialogContent>
              <TextField
                label="Email"
                fullWidth
                margin="dense"
                value={editUser?.email || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
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
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)}>Hủy</Button>
              <Button onClick={handleSaveEdit}>Lưu</Button>
            </DialogActions>
          </Dialog>

          {/* Dialog xóa người dùng */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
              Bạn có chắc chắn muốn xóa người dùng này không?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
              <Button onClick={handleConfirmDelete}>Xóa</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default UserManagement;
