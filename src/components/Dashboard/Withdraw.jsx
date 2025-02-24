import { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useWithDraw } from '../../services/withdrawService';

export default function Withdraw() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState(1);
  const [desiredPage, setDesiredPage] = useState(1);
  const [error, setError] = useState(null);
  const {
    isLoadingListWithDraw,
    listWithDraws,
    totalPage,
    acceptWithDrawMutation,
    isLoadingAcceptWithDraw,
    rejectWithDrawMutation,
    isLoadingRejectWithDraw,
  } = useWithDraw({
    limit: 8,
    page: desiredPage,
  });

  const handleAccept = (withdrawId) => {
    acceptWithDrawMutation(withdrawId, {
      onError: (error) => {
        if (error.data?.errorCode === 'W003') {
          setError('Tài khoản không đủ tiền');
        } else {
          setError('Có lỗi xảy ra');
        }
      },
    });
    if (isLoadingAcceptWithDraw) return;
  };

  const handleReject = (withdrawId) => {
    rejectWithDrawMutation(withdrawId, {
      onError: (error) => {
        if (error.data?.errorCode === 'W003') {
          setError('Tài khoản không đủ tiền');
        } else {
          setError('Có lỗi xảy ra');
        }
      },
    });
    if (isLoadingRejectWithDraw) return;
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

  const formatNumber = (value) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
      return '';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    if (!isLoadingListWithDraw) {
      setWithdrawals(listWithDraws);
      setPage(desiredPage);
    }
  }, [isLoadingListWithDraw, listWithDraws, desiredPage]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý rút điểm</h1>
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
          {withdrawals?.map((withdraw) => (
            <tr key={withdraw.id}>
              <td className="border border-gray-300 p-2 text-center">
                {withdraw?.user?.fullName}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {formatNumber(withdraw?.amount)}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {getStatusText(withdraw?.status)}
              </td>
              <td className="border border-gray-300 p-2 text-center flex justify-around">
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleAccept(withdraw?.id)}
                  disabled={
                    withdraw?.status === 'ACCEPTED' ||
                    withdraw?.status === 'REJECTED'
                  }
                >
                  Chấp nhận
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleReject(withdraw?.id)}
                  disabled={
                    withdraw?.status === 'ACCEPTED' ||
                    withdraw?.status === 'REJECTED'
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
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
