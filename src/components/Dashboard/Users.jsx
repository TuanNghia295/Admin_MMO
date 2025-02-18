import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import RecentHistoryDialog from '../RecentHistoryDialog';

const initialUsers = [
  {
    id: 1,
    name: 'John Doe',
    points: 100,
    phone: '123-456-7890',
    balance: 500,
    recentHistory: [
      {
        time: '2025-02-18 10:00',
        game: 'Game 1',
        result: 'Thắng',
        amount: 100,
      },
      { time: '2025-02-18 11:00', game: 'Game 2', result: 'Thua', amount: -50 },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    points: 200,
    phone: '987-654-3210',
    balance: 300,
    recentHistory: [
      {
        time: '2025-02-18 12:00',
        game: 'Game 3',
        result: 'Thắng',
        amount: 200,
      },
      {
        time: '2025-02-18 13:00',
        game: 'Game 4',
        result: 'Thua',
        amount: -100,
      },
    ],
  },
  {
    id: 3,
    name: 'Alice Johnson',
    points: 150,
    phone: '555-555-5555',
    balance: 400,
    recentHistory: [
      {
        time: '2025-02-18 14:00',
        game: 'Game 5',
        result: 'Thắng',
        amount: 150,
      },
      { time: '2025-02-18 15:00', game: 'Game 6', result: 'Thua', amount: -75 },
    ],
  },
  // Add more users as needed
];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', points: '', phone: '' });
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  const handleAddUser = () => {
    setIsEditMode(false);
    setNewUser({ name: '', points: '', phone: '' });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditMode(true);
    setNewUser(user);
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
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleSaveUser = () => {
    if (isEditMode) {
      setUsers(users.map((user) => (user.id === newUser.id ? newUser : user)));
    } else {
      setUsers([...users, { ...newUser, id: users.length + 1 }]);
    }
    setIsDialogOpen(false);
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
    // Implement change password logic here
  };

  const handleViewHistory = (history) => {
    setHistory(history);
    setIsHistoryDialogOpen(true);
  };

  const handleCloseHistoryDialog = () => {
    setIsHistoryDialogOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      <div className="mb-4">
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
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Tên</th>
            <th className="border border-gray-300 p-2">Điểm</th>
            <th className="border border-gray-300 p-2">Số điện thoại</th>
            <th className="border border-gray-300 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-2 text-center">
                {user.name}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {user.points}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {user.phone}
              </td>
              <td className="border border-gray-300 p-2 text-center flex justify-around">
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleViewDetails(user)}
                >
                  Chi tiết
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => handleEditUser(user)}
                >
                  Sửa
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

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {isEditMode ? 'Sửa người dùng' : 'Thêm người dùng'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            label="Điểm"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newUser.points}
            onChange={(e) => setNewUser({ ...newUser, points: e.target.value })}
          />
          <TextField
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
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
            <p>Tên: {selectedUser.name}</p>
            <p>Điểm: {selectedUser.points}</p>
            <p>Số điện thoại: {selectedUser.phone}</p>
            <p>Số dư: {selectedUser.balance}</p>
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
    </div>
  );
}
