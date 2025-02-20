import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const formatNumber = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const InOutDialogComponent = ({
  open,
  onClose,
  title,
  value,
  onChange,
  onSave,
}) => {
  const handleInputChange = (e) => {
    const formattedValue = formatNumber(e.target.value.replace(/\./g, ''));
    onChange({ target: { value: formattedValue } });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <TextField
          label="Số điểm"
          variant="outlined"
          fullWidth
          type="text"
          margin="normal"
          value={value}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={onSave} color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InOutDialogComponent;
