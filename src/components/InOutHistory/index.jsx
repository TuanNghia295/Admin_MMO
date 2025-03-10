import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { useTransaction } from '../../services/history/transactionHistoryService';

const InOutHistory = ({ open, onClose, userId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { isLoadingTransaction, listTransactionHistory, totalPageTransaction } =
    useTransaction({
      limit: rowsPerPage,
      page: page + 1,
      order: 'DESC',
      userId,
    });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const statusMap = {
    ACCEPTED: { label: 'Chấp nhận', color: 'green' },
    REJECTED: { label: 'Từ chối', color: 'red' },
    PENDING: { label: 'Đang xử lý', color: 'orange' },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Lịch Sử Nạp Rút
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoadingTransaction ? (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    ID
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Thời Gian
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Loại
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Trạng Thái
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    Số Tiền
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    SĐT
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listTransactionHistory?.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell align="center">{transaction.id}</TableCell>
                    <TableCell align="center">
                      {dayjs(transaction.createdAt).format(
                        'DD/MM/YYYY HH:mm:ss'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.type === 'DEPOSIT' ? 'Nạp' : 'Rút'}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ color: statusMap[transaction.status]?.color }}
                    >
                      {statusMap[transaction.status]?.label}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      {transaction.user?.phone || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          component="div"
          count={totalPageTransaction * rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ mt: 2 }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InOutHistory;
