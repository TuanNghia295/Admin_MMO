import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNumGuessHistory } from '../../services/history/gameHistoryService';

const RecentHistoryDialog = ({ open, onClose, userId }) => {
  const {
    numGuessHistory,
    isLoading: isLoadingNumGuessHistory,
    refetch,
  } = useNumGuessHistory({
    limit: 10,
    page: 1,
    userId: 21,
  });

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Lịch sử chơi gần đây
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoadingNumGuessHistory ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Thời gian</th>
                <th className="border border-gray-300 p-2">Trò chơi</th>
                <th className="border border-gray-300 p-2">Thắng/Thua</th>
                <th className="border border-gray-300 p-2">
                  Tiền thắng / Thua
                </th>
              </tr>
            </thead>
            <tbody>
              {numGuessHistory?.data?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.time}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.game}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {item?.result}
                  </td>
                  <td
                    className="border border-gray-300 p-2 text-center"
                    style={{ color: item.amount > 0 ? 'green' : 'red' }}
                  >
                    {item?.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecentHistoryDialog;
