import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const InOutDialogComponent = ({
  open,
  onClose,
  title,
  value,
  onChange,
  onSave,
}) => {
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
          onChange={onChange}
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
