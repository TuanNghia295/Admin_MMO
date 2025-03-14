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
  Grid2,
  Box,
  Typography,
} from '@mui/material';
import RecentHistoryDialog from '../RecentHistoryDialog';
import { useUser } from '../../services/userService';
import { ErrorCode } from '../../constant';
import InOutHistory from '../InOutHistory';
import InOutDialogComponent from '../InOutDialogComponent';
import { useDepositManually } from '../../services/depositService';
import { useWidthdrawManually } from '../../services/withdrawService';
import SnackBarComponent from '../SnackBar';
import BankEditCompoent from '../BankComponent';
import { useBank } from '../../services/bankService';

export default function Users() {
  const [page, setPage] = useState(1);
  const [desiredPage, setDesiredPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    listUser,
    totalPage,
    isLoadingListUser,
    createUserMutation,
    deleteUserMutation,
    changePasswordMutation,
    lockUserMutation,
  } = useUser({
    limit: 8,
    page: desiredPage,
    q: searchTerm,
    order: 'DESC',
  });

  const { depositManuallyMutation } = useDepositManually();
  const { widthdrawManuallyMutation } = useWidthdrawManually();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    username: '',
    wallet: { money: '' },
    phone: '',
    password: '',
    code: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isHistoryInOutOpen, setIsHistoryInOutOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [newDeposit, setNewDeposit] = useState('');
  const [newWithdraw, setNewWithdraw] = useState('');
  const [isBankAccountDialogOpen, setIsBankAccountDialogOpen] = useState(false);
  const formatNumber = (value) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return '';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    if (!isLoadingListUser) {
      setUsers(listUser);
      setPage(desiredPage);
    }
  }, [listUser, desiredPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setDesiredPage(1); // Reset to first page when searching
  };

  const handleAddUser = () => {
    setIsEditMode(false);
    setNewUser({
      fullName: '',
      username: '',
      wallet: { money: '' },
      phone: '',
      password: '',
      code: '',
    });
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
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(newUser.phone)) {
      setError(
        'Số điện thoại phải bắt đầu bằng số 0 và có độ dài từ 10 đến 11 số'
      );
      return;
    }
    if (
      /\s/.test(newUser.phone) ||
      /\s/.test(newUser.password) ||
      /\s/.test(newUser.code)
    ) {
      setError(
        'Số điện thoại, mật khẩu và mã giới thiệu không được có khoảng trắng'
      );
      return;
    }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('name', name);
    console.log('value', value);
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const getErrorMessage = (errorCode) => {
    console.log('errorCode', errorCode);
    switch (errorCode) {
      case ErrorCode.U002:
        return 'Người dùng đã tồn tại';
      case ErrorCode.S001:
        return 'Mã giới thiệu không tồn tại';
      case ErrorCode.S002:
        return 'Mã giới thiệu đã tồn tại';
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
        setSuccessMessage('Thêm người dùng thành công');
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error?.response?.data?.errorCode);
        setError(errorMessage);
      },
    });
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  const handleOpenDepositDialog = (user) => {
    setSelectedUser(user);
    setIsDepositDialogOpen(true);
  };

  const handleOpenWidthdrawDialog = (user) => {
    setSelectedUser(user);
    setIsWithdrawDialogOpen(true);
  };

  const handleDeposit = () => {
    if (selectedUser && newDeposit) {
      depositManuallyMutation(
        { userId: selectedUser.id, amount: newDeposit },
        {
          onSuccess: () => {
            setSuccessMessage('Nạp điểm thành công');
            setIsDepositDialogOpen(false);
          },
          onError: (error) => {
            setError('Nạp điểm thất bại');
            console.error('Deposit failed:', error);
          },
        }
      );
    }
  };

  const handleWithdraw = () => {
    if (selectedUser && newWithdraw) {
      widthdrawManuallyMutation(
        { userId: selectedUser.id, amount: newWithdraw },
        {
          onSuccess: () => {
            setSuccessMessage('Rút điểm thành công');
            setIsWithdrawDialogOpen(false);
          },
          onError: (error) => {
            switch (error?.data?.errorCode) {
              case ErrorCode.W003:
                setError('Số dư không đủ');
                break;
              default:
                setError('Rút điểm thất bại');
              // console.error('Deposit failed:', error?.data?.errorCode);
            }
          },
        }
      );
    }
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

  const handleViewInOutHistory = (history) => {
    console.log('history', history);
    setHistory(history);
    setIsHistoryInOutOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false);
  };

  const handleCloseInOutHistory = () => {
    setIsHistoryInOutOpen(false);
  };

  const handleNextPage = () => {
    setDesiredPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setDesiredPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleOpenBankAccountDialog = (user) => {
    // console.log('user', user);
    setSelectedUser(user);
    setIsBankAccountDialogOpen(true);
  };

  const handleLockUser = (user) => {
    console.log('user', user);
    lockUserMutation(user.id, {
      onSuccess: () => {
        setSuccessMessage('Khóa/Mở khóa người dùng thành công');
      },
      onError: (error) => {
        setError('Khóa/Mở khóa người dùng thất bại');
        console.error('Lock user failed:', error);
      },
    });
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
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

      <>
        {listUser?.length === 0 && searchTerm ? (
          <p>Người dùng không tồn tại</p>
        ) : (
          <>
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">ID</th>
                  <th className="border border-gray-300 p-2">Tên</th>
                  <th className="border border-gray-300 p-2">Điểm</th>
                  <th className="border border-gray-300 p-2">Số điện thoại</th>
                  <th className="border border-gray-300 p-2"></th>
                </tr>
              </thead>
              <tbody>
                {listUser?.map((user) => (
                  <tr key={user?.id}>
                    <td className="border border-gray-300 p-2 text-center">
                      {user?.id}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {user?.fullName}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {formatNumber(user?.wallet?.money)}
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
                        color="primary"
                        onClick={() => handleOpenDepositDialog(user)}
                      >
                        Nạp
                      </Button> */}
                      <Button
                        variant="text"
                        color="warning"
                        onClick={() => handleLockUser(user)}
                      >
                        {user?.isLocked ? 'Mở khóa' : 'Khóa'}
                      </Button>
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
                variant="text"
                color="warning"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Trang trước
              </Button>
              <span>
                {page}/{totalPage}
              </span>
              <Button
                variant="text"
                color="warning"
                onClick={handleNextPage}
                disabled={page === totalPage}
              >
                Trang sau
              </Button>
            </div>
          </>
        )}
      </>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {isEditMode ? 'Sửa người dùng' : 'Thêm người dùng'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Họ và tên"
            variant="outlined"
            fullWidth
            margin="normal"
            name="fullName"
            value={newUser.fullName}
            onChange={handleInputChange}
          />
          <TextField
            label="Tên đăng nhập"
            variant="outlined"
            fullWidth
            margin="normal"
            name="username"
            value={newUser.username
              .trim()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')}
            onChange={handleInputChange}
          />
          <TextField
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            margin="normal"
            name="phone"
            value={newUser.phone}
            onChange={handleInputChange}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            label="Mã giới thiệu"
            variant="outlined"
            fullWidth
            margin="normal"
            name="code"
            value={newUser.code}
            onChange={handleInputChange}
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
        <Dialog
          open={Boolean(selectedUser)}
          onClose={handleCloseDetails}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Chi tiết người dùng
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Tên:</strong> {selectedUser.fullName}
              </Typography>
              <Typography variant="body1">
                <strong>Điểm:</strong> {selectedUser.wallet?.money || 0}
              </Typography>
              <Typography variant="body1">
                <strong>Số điện thoại:</strong> {selectedUser.phone}
              </Typography>

              <Typography variant="body1">
                <strong>Ngân hàng: </strong> {selectedUser.bank.bankName}
              </Typography>

              <Typography variant="body1">
                <strong>STK: </strong> {selectedUser.bank.accountNumber}
              </Typography>
            </Box>

            <Grid2 container spacing={2} justifyContent="start">
              <Grid2>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleViewHistory(selectedUser.id)}
                >
                  Lịch sử game
                </Button>
              </Grid2>
              <Grid2>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleViewInOutHistory(selectedUser.id)}
                >
                  Lịch sử nạp / rút
                </Button>
              </Grid2>

              <Grid2>
                <Button
                  variant="outlined"
                  color="success"
                  fullWidth
                  onClick={() => handleOpenDepositDialog(selectedUser)}
                >
                  Nạp
                </Button>
              </Grid2>
              <Grid2>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => handleOpenWidthdrawDialog(selectedUser)}
                >
                  Rút
                </Button>
              </Grid2>
            </Grid2>
          </DialogContent>

          <DialogContent sx={{ px: 3, pb: 2 }}>
            <Grid2 container spacing={2}>
              <Grid2>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleChangePassword}
                >
                  Đổi mật khẩu
                </Button>
              </Grid2>
              <Grid2>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleOpenBankAccountDialog(selectedUser)}
                >
                  Thay đổi tài khoản ngân hàng
                </Button>
              </Grid2>
            </Grid2>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDetails} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <RecentHistoryDialog
        open={isHistoryDialogOpen}
        onClose={handleCloseHistoryDialog}
        userId={history}
      />

      {/* Lịch sử nạp rút */}
      <InOutHistory
        open={isHistoryInOutOpen}
        onClose={handleCloseInOutHistory}
        userId={history}
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

      <BankEditCompoent
        userId={selectedUser?.id}
        isBankAccountDialogOpen={isBankAccountDialogOpen}
        setIsBankAccountDialogOpen={setIsBankAccountDialogOpen}
      />

      <InOutDialogComponent
        open={isDepositDialogOpen}
        onClose={() => setIsDepositDialogOpen(false)}
        title="Nhập số điểm cần nạp"
        value={newDeposit}
        onChange={(e) => setNewDeposit(Number(e.target.value))}
        onSave={handleDeposit}
      />

      {/* Modal nạp điểm */}
      <InOutDialogComponent
        open={isWithdrawDialogOpen}
        onClose={() => setIsWithdrawDialogOpen(false)}
        title="Nhập số điểm cần rút"
        value={newWithdraw}
        onChange={(e) => setNewWithdraw(Number(e.target.value))}
        onSave={handleWithdraw}
      />

      {/* Thông báo đổi mật khẩu thành công hoặc thất bại */}
      <SnackBarComponent
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={error}
        setErrorMessage={setError}
      />
    </div>
  );
}
