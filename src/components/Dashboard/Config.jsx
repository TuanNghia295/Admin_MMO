import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useSetting } from '../../services/settingService';

export default function Config() {
  const [profitPercent, setProfitPercent] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [error, setError] = useState(null);
  const {
    setting,
    defaultSetting,
    isDefaultLoading,
    configSuccess,
    configError,
  } = useSetting();

  const handleSave = async () => {
    const profitPercentValue = parseFloat(profitPercent);
    const sessionTimeValue = parseInt(sessionTime);

    if (isNaN(profitPercentValue) || isNaN(sessionTimeValue)) {
      setError('Giá trị nhập vào không hợp lệ');
      return;
    }

    if (profitPercentValue < 1) {
      setError('Giá trị % lợi nhuận không được nhỏ hơn 1');
      return;
    }

    setting({
      profitPercent: profitPercentValue,
      sessionTime: sessionTimeValue,
    });
  };

  useEffect(() => {
    if (!isDefaultLoading) {
      setProfitPercent(defaultSetting.profitPercent);
      setSessionTime(defaultSetting.sessionTime);
    }
  }, [isDefaultLoading]);

  useEffect(() => {
    if (configSuccess) {
      setProfitPercent(profitPercent);
      setSessionTime(sessionTime);
    }
  }, [configSuccess]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý trò chơi
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Trò chơi
        </Typography>
        <TextField
          label="Cấu hình % của ô cược"
          variant="outlined"
          fullWidth
          type="text"
          value={profitPercent}
          onChange={(e) => setProfitPercent(e.target.value)}
          sx={{ mb: 4 }}
        />
        <TextField
          label="Cấu hình thời gian đếm ngược của phiên (giây)"
          variant="outlined"
          fullWidth
          type="text"
          value={sessionTime}
          onChange={(e) => setSessionTime(e.target.value)}
          sx={{ mb: 4 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          fullWidth
        >
          Lưu
        </Button>
      </Paper>

      <Snackbar open={configSuccess} autoHideDuration={6000} onClose={() => {}}>
        <Alert onClose={() => {}} severity="success" sx={{ width: '100%' }}>
          Cấu hình thành công!
        </Alert>
      </Snackbar>

      <Snackbar open={configError} autoHideDuration={6000} onClose={() => {}}>
        <Alert onClose={() => {}} severity="error" sx={{ width: '100%' }}>
          Cấu hình thất bại!
        </Alert>
      </Snackbar>

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
    </Container>
  );
}
