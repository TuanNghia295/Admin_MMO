import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from '@mui/material';
import { useBank } from '../../services/bankService';
import SnackBarComponent from '../SnackBar';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useEffect } from 'react';

/**
 *
 * @param {{userId:Number, isBankAccountDialogOpen: boolean, setIsBankAccountDialogOpen: Function, }} props
 */
export default function BankEditCompoent({
  isBankAccountDialogOpen,
  setIsBankAccountDialogOpen,
  userId,
}) {
  const { bankList, bankMutation } = useBank();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [bankAccount, setBankAccount] = useState({
    accountNumber: '',
    bankName: '',
    accountName: '',
  });

  const handleChange = (event) => {
    const { value } = event.target;
    setBankAccount((prev) => ({
      ...prev,
      bankName: value,
    }));
  };

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
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Ngân hàng</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={bankAccount.bankName}
                onChange={handleChange}
              >
                {Array.isArray(bankList) &&
                  bankList.map((bank) => (
                    <MenuItem key={bank.name} value={bank.name}>
                      {bank.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
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
