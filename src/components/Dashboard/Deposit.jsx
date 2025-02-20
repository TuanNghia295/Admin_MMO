import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useDeposit } from '../../services/depositService';

export default function Deposit() {
  const [deposits, setDeposits] = useState([]);
  const [page, setPage] = useState(1);
  const [desiredPage, setDesiredPage] = useState(1);
  const {
    isLoadingListDeposit,
    listDeposits,
    totalPage,
    acceptDepositMutation,
    isLoadingAcceptDeposit,
    rejectDepositMutation,
    isLoadingRejectDeposit,
  } = useDeposit({
    limit: 8,
    page: desiredPage,
  });

  const handleAccept = (depositId) => {
    acceptDepositMutation(depositId);
    if (isLoadingAcceptDeposit) return;
  };

  const handleReject = (depositId) => {
    rejectDepositMutation(depositId);
    if (isLoadingRejectDeposit) return;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ';
      case 'ACCEPTED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Đã từ chối';
      default:
        return status;
    }
  };

  // chuyển trang
  const handleNextPage = () => {
    setDesiredPage((prev) => prev + 1);
  };
  const handlePreviousPage = () => {
    setDesiredPage((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    if (!isLoadingListDeposit) {
      setDeposits(listDeposits);
      setPage(desiredPage);
    }
  }, [isLoadingListDeposit, listDeposits, desiredPage]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý nạp điểm</h1>
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
          {deposits?.map((deposit) => (
            <tr key={deposit.id}>
              <td className="border border-gray-300 p-2 text-center">
                {deposit?.user?.fullName}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {deposit?.amount}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {getStatusText(deposit?.status)}
              </td>
              <td className="border border-gray-300 p-2 text-center flex justify-around">
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleAccept(deposit?.id)}
                  disabled={
                    deposit?.status === 'ACCEPTED' ||
                    deposit?.status === 'REJECTED'
                  }
                >
                  Chấp nhận
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleReject(deposit?.id)}
                  disabled={
                    deposit?.status === 'ACCEPTED' ||
                    deposit?.status === 'REJECTED'
                  }
                >
                  Từ chối
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4 text-center items-center">
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
    </div>
  );
}
