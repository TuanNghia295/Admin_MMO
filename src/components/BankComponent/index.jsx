import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

/**
 *
 * @param {{isBankAccountDialogOpen: boolean, setIsBankAccountDialogOpen: Function, handleSaveBankAccount: Function}} props
 */
export default function BankEditCompoent({
  isBankAccountDialogOpen,
  setIsBankAccountDialogOpen,
  handleSaveBankAccount,
}) {
  return (
    <Dialog
      open={isBankAccountDialogOpen}
      onClose={() => setIsBankAccountDialogOpen(false)}
    >
      <DialogTitle>Thay đổi thông tin tài khoản ngân hàng</DialogTitle>
      <DialogContent sx={{ minWidth: '400px' }}>
        <TextField
          label="Tên ngân hàng"
          variant="outlined"
          fullWidth
          type="text"
          margin="normal"
          // value={bankAccount.bankName}
          // onChange={(e) =>
          //   setBankAccount({ ...bankAccount, bankName: e.target.value })
          // }
        />
        <TextField
          label="Số tài khoản"
          variant="outlined"
          fullWidth
          type="text"
          margin="normal"
          // value={bankAccount.accountNumber}
          // onChange={(e) =>
          //   setBankAccount({ ...bankAccount, accountNumber: e.target.value })
          // }
        />
        <TextField
          label="Họ và tên"
          variant="outlined"
          fullWidth
          type="text"
          margin="normal"
          // value={bankAccount.accountNumber}
          // onChange={(e) =>
          //   setBankAccount({ ...bankAccount, accountNumber: e.target.value })
          // }
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
  );
}
