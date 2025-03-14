import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useBank } from '../../services/bankService';
import SnackBarComponent from '../SnackBar';
import { useState, useEffect } from 'react';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

/**
 *
 * @param {{userId:Number, isBankAccountDialogOpen: boolean, setIsBankAccountDialogOpen: Function, }} props
 */
export default function BankEditCompoent({
  isBankAccountDialogOpen,
  setIsBankAccountDialogOpen,
  userId,
}) {
  const { bankMutation } = useBank();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [bankAccount, setBankAccount] = useState({
    accountNumber: '',
    bankName: '',
    accountName: '',
  });

  const handleSaveBankAccount = () => {
    bankMutation(
      {
        userId,
        bankName: bankAccount.bankName,
        accountName: bankAccount.accountName,
        accountNumber: bankAccount.accountNumber,
      },
      {
        onSuccess: () => {
          setSuccessMessage(
            'Thay đổi thông tin tài khoản ngân hàng thành công'
          );
          setIsBankAccountDialogOpen(false);
        },
        onError: (error) => {
          setError('Thay đổi thông tin tài khoản ngân hàng thất bại');
          console.error('Update bank account failed:', error);
        },
      }
    );
  };

  useEffect(() => {
    setBankAccount({
      accountNumber: '',
      bankName: '',
      accountName: '',
    });
  }, [isBankAccountDialogOpen]);

  return (
    <>
      <Dialog
        open={isBankAccountDialogOpen}
        onClose={() => setIsBankAccountDialogOpen(false)}
      >
        <DialogTitle>Thay đổi thông tin tài khoản ngân hàng</DialogTitle>
        <DialogContent sx={{ minWidth: '400px' }}>
          <TextField
            label="Ngân hàng"
            variant="outlined"
            fullWidth
            type="text"
            margin="normal"
            value={bankAccount.bankName}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, bankName: e.target.value })
            }
          />
          <TextField
            label="Số tài khoản"
            variant="outlined"
            fullWidth
            type="text"
            margin="normal"
            value={bankAccount.accountNumber}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, accountNumber: e.target.value })
            }
          />
          <TextField
            label="Họ và tên"
            variant="outlined"
            fullWidth
            type="text"
            margin="normal"
            value={bankAccount.accountName}
            onChange={(e) =>
              setBankAccount({ ...bankAccount, accountName: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsBankAccountDialogOpen(false)}
            color="primary"
          >
            Hủy
          </Button>
          <Button onClick={handleSaveBankAccount} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <SnackBarComponent
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={error}
        setErrorMessage={setError}
      />
    </>
  );
}
