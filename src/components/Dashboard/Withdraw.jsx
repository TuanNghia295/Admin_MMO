import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const initialWithdrawals = [
  { id: 1, user: 'John Doe', amount: 100, status: 'Pending' },
  { id: 2, user: 'Jane Smith', amount: 200, status: 'Pending' },
  { id: 3, user: 'Alice Johnson', amount: 150, status: 'Pending' },
  // Add more withdrawal requests as needed
];

export default function Withdraw() {
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApprove = (withdrawalId) => {
    setWithdrawals(
      withdrawals.map((withdrawal) =>
        withdrawal.id === withdrawalId
          ? { ...withdrawal, status: 'Approved' }
          : withdrawal
      )
    );
    setIsDialogOpen(false);
  };

  const handleReject = (withdrawalId) => {
    setWithdrawals(
      withdrawals.map((withdrawal) =>
        withdrawal.id === withdrawalId
          ? { ...withdrawal, status: 'Rejected' }
          : withdrawal
      )
    );
    setIsDialogOpen(false);
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedWithdrawal(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý yêu cầu rút điểm</h1>
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Người dùng</th>
            <th className="border border-gray-300 p-2">Số điểm</th>
            <th className="border border-gray-300 p-2">Trạng thái</th>
            <th className="border border-gray-300 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.id}>
              <td className="border border-gray-300 p-2 text-center">
                {withdrawal.user}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {withdrawal.amount}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {withdrawal.status}
              </td>
              <td className="border border-gray-300 p-2 text-center flex justify-around">
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleViewDetails(withdrawal)}
                >
                  Chi tiết
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedWithdrawal && (
        <Dialog open={isDialogOpen} onClose={handleCloseDetails}>
          <DialogTitle
            style={{ width: 400, display: 'flex', justifyContent: 'center' }}
          >
            Chi tiết yêu cầu rút điểm
          </DialogTitle>
          <DialogContent className="flex gap-2 flex-col">
            <p>Người dùng: {selectedWithdrawal.user}</p>
            <p>Số điểm: {selectedWithdrawal.amount}</p>
            <p>Trạng thái: {selectedWithdrawal.status}</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleApprove(selectedWithdrawal.id)}
              color="primary"
            >
              Chấp nhận
            </Button>
            <Button
              onClick={() => handleReject(selectedWithdrawal.id)}
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
