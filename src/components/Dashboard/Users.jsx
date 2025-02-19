import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import RecentHistoryDialog from '../RecentHistoryDialog';
import { useUser } from '../../services/userService';
import LoadingPage from '../../pages/LoadingPage';
import { ErrorCode } from '../../constant';

export default function Users() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    listUser,
    isLoadingListUser,
    createUserMutation,
    deleteUserMutation,
    changePasswordMutation,
  } = useUser({
    limit: 8,
    page,
    q: searchTerm,
    order: 'DESC',
  });

  const filteredUsers = listUser.filter((user) =>
    searchTerm
      ? user?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        user?.phone?.includes(searchTerm)
      : true
  );

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    wallet: { money: '' },
    phone: '',
    password: '',
    code: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (listUser) {
      console.log('listUser', listUser);
      setUsers(listUser);
    }
  }, [listUser]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    if (searchTerm && listUser.length === 0) {
      setUsers([]);
    }
  }, [searchTerm, listUser]);

  const handleAddUser = () => {
    setIsEditMode(false);
    setNewUser({
      fullName: '',
      wallet: { money: '' },
      phone: '',
      password: '',
      code: '',
    });
    setPasswordError('');
    setIsDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditMode(true);
    setNewUser(user);
    setPasswordError('');
    setIsDialogOpen(true);
  };

  const handleOpenDeleteConfirm = (user) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = () => {
    deleteUserMutation(userToDelete.id, {
      onSuccess: () => {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setIsDeleteConfirmOpen(false);
        setUserToDelete(null);
      },
      onError: (error) => {
        setError('Xóa người dùng thất bại');
        console.error('Delete user failed:', error);
      },
    });
  };

  const handleSaveUser = () => {
    if (newUser.password.length < 6) {
      setPasswordError('Mật khẩu phải lớn hơn hoặc bằng 6 ký tự');
      return;
    }
    if (isEditMode) {
      setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
    } else {
      handleCreateUser(newUser);
    }
    setIsDialogOpen(false);
  };

  const getErrorMessage = (errorCode) => {
    console.log('errorCode', errorCode);
    switch (errorCode) {
      case ErrorCode.U002:
        return 'Người dùng đã tồn tại';
      case ErrorCode.S002:
        return 'Mã sale đã tồn tại';
      case ErrorCode.S003:
        return 'Số điện thoại đã tồn tại';
      default:
        return 'Đã xảy ra lỗi';
    }
  };

  const handleCreateUser = (user) => {
    createUserMutation(user, {
      onSuccess: (data) => {
        setUsers([...users, data]);
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error?.data?.errorCode);
        setError(errorMessage);
        // console.error('Create user failed:', error);
      },
    });
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleDeposit = () => {
    // Implement deposit logic here
  };

  const handleWithdraw = () => {
    // Implement withdraw logic here
  };

  const handleChangePassword = () => {
    setIsChangePasswordDialogOpen(true);
  };

  const handleSaveNewPassword = () => {
    changePasswordMutation(
      { userId: selectedUser.id, password: newPassword },
      {
        onSuccess: () => {
          setSuccessMessage('Thay đổi mật khẩu thành công');
          setIsChangePasswordDialogOpen(false);
        },
        onError: (error) => {
          setError('Thay đổi mật khẩu thất bại');
          console.error('Change password failed:', error);
        },
      }
    );
  };

  const handleViewHistory = (history) => {
    setHistory(history);
    setIsHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (listUser.length === 0 && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [listUser, page]);

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      <div className="mb-4 flex">
        <div className="flex-1 mr-5">
          <TextField
            label="Tìm kiếm theo tên hoặc số điện thoại"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Thêm người dùng
        </Button>
      </div>
      {isLoadingListUser ? (
        <LoadingPage />
      ) : (
        <>
          {users.length === 0 && searchTerm ? (
            <p>Người dùng không tồn tại</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">Tên</th>
                    <th className="border border-gray-300 p-2">Điểm</th>
                    <th className="border border-gray-300 p-2">
                      Số điện thoại
                    </th>
                    <th className="border border-gray-300 p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers?.map((user) => (
                    <tr key={user?.id}>
                      <td className="border border-gray-300 p-2 text-center">
                        {user?.fullName}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {user?.wallet?.money}
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {user?.phone}
                      </td>
                      <td className="border border-gray-300 p-2 text-center flex justify-around">
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handleViewDetails(user)}
                        >
                          Chi tiết
                        </Button>
                        {/* <Button
                          variant="text"
                          color="secondary"
                          onClick={() => handleEditUser(user)}
                        >
                          Sửa
                        </Button> */}
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => handleOpenDeleteConfirm(user)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Trang trước
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextPage}
                >
                  Trang sau
                </Button>
              </div>
            </>
          )}
        </>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {isEditMode ? 'Sửa người dùng' : 'Thêm người dùng'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                password: e.target.value,
              })
            }
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            label="Mã giới thiệu"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newUser.code}
            onChange={(e) => setNewUser({ ...newUser, code: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveUser} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {selectedUser && (
        <Dialog open={Boolean(selectedUser)} onClose={handleCloseDetails}>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogContent
            style={{
              minWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <p>Tên: {selectedUser.fullName}</p>
            <p>Điểm: {selectedUser.wallet.money}</p>
            <p>Số điện thoại: {selectedUser.phone}</p>
            <p>Lịch sử chơi gần đây:</p>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleViewHistory(selectedUser.recentHistory)}
            >
              Xem lịch sử
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeposit} color="primary">
              Nạp
            </Button>
            <Button onClick={handleWithdraw} color="primary">
              Rút
            </Button>
            <Button onClick={handleChangePassword} color="primary">
              Đổi mật khẩu
            </Button>
            <Button onClick={handleCloseDetails} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <RecentHistoryDialog
        open={isHistoryDialogOpen}
        onClose={handleCloseHistoryDialog}
        history={history}
      />

      <Dialog open={isDeleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isChangePasswordDialogOpen}
        onClose={() => setIsChangePasswordDialogOpen(false)}
      >
        <DialogTitle>Nhập mật khẩu mới</DialogTitle>
        <DialogContent sx={{ minWidth: '400px' }}>
          <TextField
            label="Mật khẩu mới"
            variant="outlined"
            fullWidth
            type="text"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsChangePasswordDialogOpen(false)}
            color="primary"
          >
            Hủy
          </Button>
          <Button onClick={handleSaveNewPassword} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
