import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const initialDeposits = [
  { id: 1, user: 'John Doe', amount: 100, status: 'Pending' },
  { id: 2, user: 'Jane Smith', amount: 200, status: 'Pending' },
  { id: 3, user: 'Alice Johnson', amount: 150, status: 'Pending' },
  // Add more deposit requests as needed
];

export default function Deposit() {
  const [deposits, setDeposits] = useState(initialDeposits);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAccept = (depositId) => {
    setDeposits(
      deposits.map((deposit) =>
        deposit.id === depositId ? { ...deposit, status: 'Accepted' } : deposit
      )
    );
    setIsDialogOpen(false);
  };

  const handleReject = (depositId) => {
    setDeposits(
      deposits.map((deposit) =>
        deposit.id === depositId ? { ...deposit, status: 'Rejected' } : deposit
      )
    );
    setIsDialogOpen(false);
  };

  const handleViewDetails = (deposit) => {
    setSelectedDeposit(deposit);
    setIsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedDeposit(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý nạp điểm</h1>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Người dùng</th>
            <th className="border border-gray-300 p-2">Số điểm</th>
            <th className="border border-gray-300 p-2">Trạng thái</th>
            <th className="border border-gray-300 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((deposit) => (
            <tr key={deposit.id}>
              <td className="border border-gray-300 p-2 text-center">
                {deposit.user}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {deposit.amount}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {deposit.status}
              </td>
              <td className="border border-gray-300 p-2 text-center flex justify-around">
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleViewDetails(deposit)}
                >
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDeposit && (
        <Dialog open={isDialogOpen} onClose={handleCloseDetails}>
          <DialogTitle>Chi tiết nạp điểm</DialogTitle>
          <DialogContent>
            <p>Người dùng: {selectedDeposit.user}</p>
            <p>Số điểm: {selectedDeposit.amount}</p>
            <p>Trạng thái: {selectedDeposit.status}</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleAccept(selectedDeposit.id)}
              color="primary"
            >
              Chấp nhận
            </Button>
            <Button
              onClick={() => handleReject(selectedDeposit.id)}
              color="secondary"
            >
              Từ chối
            </Button>
            <Button onClick={handleCloseDetails} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
