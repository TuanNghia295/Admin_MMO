import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const initialSales = [
  { id: 1, name: 'John Doe', points: 100, phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', points: 200, phone: '987-654-3210' },
  { id: 3, name: 'Alice Johnson', points: 150, phone: '555-555-5555' },
  // Add more sales as needed
];

export default function Sale() {
  const [sales, setSales] = useState(initialSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSale, setNewSale] = useState({ name: '', points: '', phone: '' });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.phone.includes(searchTerm)
  );

  const handleAddSale = () => {
    setIsEditMode(false);
    setNewSale({ name: '', points: '', phone: '' });
    setIsDialogOpen(true);
  };

  const handleEditSale = (sale) => {
    setIsEditMode(true);
    setNewSale(sale);
    setIsDialogOpen(true);
  };

  const handleDeleteSale = (saleId) => {
    setSales(sales.filter((sale) => sale.id !== saleId));
    setIsDeleteConfirmOpen(false);
  };

  const handleSaveSale = () => {
    if (isEditMode) {
      setSales(sales.map((sale) => (sale.id === newSale.id ? newSale : sale)));
    } else {
      setSales([...sales, { ...newSale, id: sales.length + 1 }]);
    }
    setIsDialogOpen(false);
  };

  const handleViewDetails = (sale) => {
    setSelectedSale(sale);
  };

  const handleCloseDetails = () => {
    setSelectedSale(null);
  };

  const handleOpenDeleteConfirm = (sale) => {
    setSaleToDelete(sale);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setSaleToDelete(null);
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
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Tên</th>
            <th className="border border-gray-300 p-2">Điểm</th>
            <th className="border border-gray-300 p-2">Số điện thoại</th>
            <th className="border border-gray-300 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.id}>
              <td className="border border-gray-300 p-2 text-center">
                {sale.name}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {sale.points}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {sale.phone}
              </td>
              <td className="border border-gray-300 p-2 flex justify-around">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
            onChange={(e) => setNewSale({ ...newSale, name: e.target.value })}
          />
          <TextField
            label="Điểm"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSale.points}
            onChange={(e) => setNewSale({ ...newSale, points: e.target.value })}
          />
          <TextField
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newSale.phone}
            onChange={(e) => setNewSale({ ...newSale, phone: e.target.value })}
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

      {selectedSale && (
        <Dialog open={Boolean(selectedSale)} onClose={handleCloseDetails}>
          <DialogTitle>Chi tiết sale</DialogTitle>
          <DialogContent
            style={{
              minWidth: '500px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <p>Tên: {selectedSale.name}</p>
            <p>Điểm: {selectedSale.points}</p>
            <p>Số điện thoại: {selectedSale.phone}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={isDeleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn xóa sale này không?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Hủy
          </Button>
          <Button
            onClick={() => handleDeleteSale(saleToDelete.id)}
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
