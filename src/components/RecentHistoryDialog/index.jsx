import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  useNumGuessHistory,
  useTaiLocHistory,
} from '../../services/history/gameHistoryService';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';

const RecentHistoryDialog = ({ open, onClose, userId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    numGuessHistory,
    isLoading: isLoadingNumGuessHistory,
    totalPageDoanSo,
  } = useNumGuessHistory({
    limit: rowsPerPage,
    page: page + 1,
    order: 'DESC',
    userId,
  });

  const {
    taiLocHistory,
    isLoading: isLoadingTaiLocHistory,
    totalPageTaiLoc,
  } = useTaiLocHistory({
    limit: rowsPerPage,
    page: page + 1,
    order: 'DESC',
    userId,
  });

  console.log('numGuessHistory', numGuessHistory);
  console.log('taiLocHistory', taiLocHistory);

  const options = ['Đoán số', 'Tài Lộc'];
  const [value, setValue] = useState(options[0]);
  const [inputValue, setInputValue] = useState('');

  const isLoading = isLoadingNumGuessHistory || isLoadingTaiLocHistory;

  const handleChangePage = (event, newPage) => {
    console.log('newPage', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getResultbyType = (result, type) => {
    console.log('type', type);
    console.log('result', result);

    switch (type) {
      case 'NUMGUESS':
        return result
          .map((item) => {
            const value = Number(item.value); // Chuyển đổi value thành số
            const isEven = value % 2 === 0; // Kiểm tra xem value là chẵn hay lẻ
            const isExact = item.isExact; // Kiểm tra xem có phải là kết quả chính xác không

            // Trả về kết quả dựa trên isExact và giá trị chẵn/lẻ
            if (isExact) {
              return `${isEven ? 'Chẵn' : 'Lẻ'}`;
            } else {
              return ` ${isEven ? 'Chẵn' : 'Lẻ'}`;
            }
          })
          .join(', ');

      case 'TAILOC':
        return result
          .map((item) => {
            const value = Number(item.value); // Chuyển đổi value thành số
            if (isNaN(value)) {
              return 'Giá trị không hợp lệ'; // Xử lý trường hợp value không phải là số
            }

            switch (item.type) {
              case 'num-guess': {
                const isEven = value % 2 === 0; // Kiểm tra xem value là chẵn hay lẻ
                return `${isEven ? 'Chẵn' : 'Lẻ'}`; // Trả về giá trị và kết quả kiểm tra
              }
              case 'sic-bo': {
                const isTai = value >= 11 && value <= 17; // Kiểm tra xem value là Tài
                const isXiu = value >= 4 && value <= 10; // Kiểm tra xem value là Xỉu
                if (isTai) {
                  return 'Tài';
                } else if (isXiu) {
                  return 'Xỉu';
                } else {
                  return `${value} (Không hợp lệ)`; // Trường hợp value nằm ngoài phạm vi Tài/Xỉu
                }
              }
            }
          })
          .join(', ');

      default:
        return result.reduce((a, b) => Number(a) + Number(b), 0);
    }
  };

  const renderHistory = (history, type) => (
    <table className="w-full border-collapse border border-gray-300 mt-4">
      {console.log('history', history)}
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Ngày tháng năm</th>
          <th className="border border-gray-300 p-2">Thời gian</th>
          <th className="border border-gray-300 p-2">Loại trò chơi</th>
          <th className="border border-gray-300 p-2">Lệnh đặt</th>
          <th className="border border-gray-300 p-2">Kết quả</th>
          <th className="border border-gray-300 p-2">Tiền thắng / Thua</th>
        </tr>
      </thead>
      <tbody>
        {history?.data?.map((item) => {
          const {
            id,
            result,
            value,
            input,
            time,
            amount,
            amountResult,
            createdAt,
            status,
            bets,
          } = item;
          const isResultArray = Array.isArray(result);
          let resultSum = 0;
          let resultTaiXiu = ''; // <= 10 là xỉu, >= 11 là tài
          let isWin = false;
          if (isResultArray) {
            resultSum = result.reduce((a, b) => Number(a) + Number(b), 0);
            resultTaiXiu = resultSum >= 11 ? 'Tài' : 'Xỉu'; // kết quả của mỗi phiên
            isWin =
              (resultTaiXiu === 'Tài' && value >= 11) ||
              (resultTaiXiu === 'Xỉu' && value <= 10);
          } else {
            isWin = result === value;
          }

          if (type === 'TAILOC') {
            return bets.map((bet, betIndex) => (
              <tr key={`${id}-${betIndex}`}>
                <td className="border border-gray-300 p-2 text-center">
                  {dayjs(createdAt).format('DD/MM/YYYY')}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {dayjs(createdAt).format('HH:mm:ss')}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {bet.type === 'num-guess' ? 'Đoán số' : 'Tài Lộc'}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {bet.value}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {type === 'TAILOC' ? resultTaiXiu : result}
                </td>
                <td
                  className="border border-gray-300 p-2 text-center"
                  style={{
                    color:
                      status === 1 ? 'green' : status === 2 ? 'red' : 'orange',
                  }}
                >
                  {status === 0
                    ? 'Đang chờ kết quả'
                    : status === 1
                      ? amountResult
                      : amount}
                </td>
              </tr>
            ));
          } else {
            return (
              <tr key={id}>
                <td className="border border-gray-300 p-2 text-center">
                  {dayjs(createdAt).format('DD/MM/YYYY')}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {dayjs(createdAt).format('HH:mm:ss')}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  Đoán số
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {Array.isArray(input)
                    ? getResultbyType(input, 'NUMGUESS')
                    : input}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {result}
                </td>
                <td
                  className="border border-gray-300 p-2 text-center"
                  style={{
                    color:
                      status === 1 ? 'green' : status === 2 ? 'red' : 'orange',
                  }}
                >
                  {status === 0
                    ? 'Đang chờ kết quả'
                    : status === 1
                      ? amountResult
                      : amountResult}
                </td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );

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
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="controllable-states-demo"
          options={options}
          sx={{ width: 300, mb: 2 }}
          renderInput={(params) => <TextField {...params} label="" />}
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : value === 'Đoán số' ? (
          renderHistory(numGuessHistory, 'NUMGUESS')
        ) : (
          renderHistory(taiLocHistory, 'TAILOC')
        )}
        <TablePagination
          component="div"
          count={
            value === 'Đoán số'
              ? totalPageDoanSo * rowsPerPage
              : totalPageTaiLoc * rowsPerPage
          } // Số lượng bản ghi
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecentHistoryDialog;
