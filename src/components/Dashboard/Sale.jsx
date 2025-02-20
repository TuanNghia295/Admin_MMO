import { useEffect, useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import { useSale } from '../../services/saleService';
import { ErrorCode } from '../../constant';

export default function Sale() {
  const [page, setPage] = useState(1);
  const [desiredPage, setDesiredPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sales, setSales] = useState([]);
  const { listSales, totalPage, isLoadingListSales, createSaleMutation } =
    useSale({
      limit: 8,
      page: desiredPage,
      q: searchTerm,
      order: 'DESC',
    });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSale, setNewSale] = useState({
    fullName: '',
    phone: '',
    password: '',
  });
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setDesiredPage(1); // Reset to first page when searching
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale?.fullName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      sale?.phone?.includes(searchTerm)
  );

  const handleAddSale = () => {
    setIsEditMode(false);
    setNewSale({ fullName: '', phone: '', password: '' });
    setPhoneError('');
    setPasswordError('');
    setIsDialogOpen(true);
  };

  const getErrorMessage = (errorCode) => {
    console.log('Error code:', errorCode);
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

  const handleSaveSale = () => {
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(newSale.phone)) {
      setPhoneError(
        'Số điện thoại phải bắt đầu bằng số 0 và có độ dài từ 10 đến 11 số'
      );
      return;
    }
    if (/\s/.test(newSale.phone) || /\s/.test(newSale.password)) {
      setPasswordError('Số điện thoại và mật khẩu không được có khoảng trắng');
      return;
    }
    if (newSale.password.length < 6) {
      setPasswordError('Mật khẩu phải lớn hơn hoặc bằng 6 ký tự');
      return;
    }
    if (isEditMode) {
      setSales(sales.map((sale) => (sale.id === newSale.id ? newSale : sale)));
    } else {
      createSaleMutation(newSale, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSuccessMessage('Thêm sale thành công');
        },
        onError: (error) => {
          const errorMessage = getErrorMessage(error?.data?.errorCode);
          setError(errorMessage || 'Error creating sale');
          console.error('Error creating sale:', error);
        },
      });
    }
  };

  // Danh sách sale được cập nhật khi có dữ liệu mới từ API
  useEffect(() => {
    if (listSales) {
      setSales(listSales);
      setPage(desiredPage);
    }
  }, [listSales, desiredPage]);

  const handleNextPage = () => {
    setDesiredPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setDesiredPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý thông tin sale</h1>
      <div className="mb-4">
        <TextField
          label="Tìm kiếm theo tên hoặc số điện thoại"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <Button variant="contained" color="primary" onClick={handleAddSale}>
        Thêm sale
      </Button>
      {isLoadingListSales ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Tên</th>
                <th className="border border-gray-300 p-2">Mã giới thiệu</th>
                <th className="border border-gray-300 p-2">Số điện thoại</th>
                {/* <th className="border border-gray-300 p-2"></th> */}
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="border border-gray-300 p-2 text-center">
                    {sale.fullName}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {sale.code}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {sale.phone}
                  </td>
                  {/* <td className="border border-gray-300 p-2 flex justify-around">
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleViewDetails(sale)}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => handleEditSale(sale)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => handleOpenDeleteConfirm(sale)}
                    >
                      Xóa
                    </Button>
                  </td> */}
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
        </>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {isEditMode ? 'Chỉnh sửa thông tin sale' : 'Thêm sale'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSale.name}
            onChange={(e) =>
              setNewSale({ ...newSale, fullName: e.target.value })
            }
          />
          <TextField
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSale.phone}
            onChange={(e) => setNewSale({ ...newSale, phone: e.target.value })}
            error={!!phoneError}
            helperText={phoneError}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSale.password}
            onChange={(e) =>
              setNewSale({ ...newSale, password: e.target.value })
            }
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveSale} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
