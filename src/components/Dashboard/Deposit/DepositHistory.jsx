import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDepositHistory } from '../../../services/history/depositHistoryService';

const formatMoney = (money) => {
  return new Intl.NumberFormat('vi-VN').format(money);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const getRoleDisplayName = (role) => {
  return role === 'MANAGER' ? 'ADMIN' : role;
};

export default function DepositHistory() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { depositHistory, pagination, totalPage } = useDepositHistory({
    limit: rowsPerPage,
    page: page + 1,
    q: '',
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div className="flex justify-start items-center mb-4 border-b pb-4">
        <div className="flex-1">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} />
        </div>
        <h1 className="font-[500] text-primary text-xl">Lịch sử nạp</h1>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Người nạp</TableCell>
            <TableCell>Chức Vụ</TableCell>
            <TableCell>Số tiền</TableCell>
            <TableCell>Người dùng</TableCell>
            <TableCell>Ngày nạp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {depositHistory?.map((deposit) => (
            <TableRow key={deposit.id}>
              <TableCell>
                {getRoleDisplayName(deposit?.manager?.role) === 'ADMIN'
                  ? 'ADMIN'
                  : deposit.manager?.fullName}
              </TableCell>
              <TableCell>
                {getRoleDisplayName(deposit?.manager?.role)}
              </TableCell>
              <TableCell>{formatMoney(deposit.amount)}</TableCell>
              <TableCell>{deposit?.user?.fullName}</TableCell>
              <TableCell>{formatDate(deposit?.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalPage}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
