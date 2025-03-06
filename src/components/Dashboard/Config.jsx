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
  const [profitPercentLocPhat, setProfitPercentLocPhat] = useState(0);
  const [profitPercentTaiXiu, setProfitPercentTaiXiu] = useState(0);
  const [sessionTime, setSessionTime] = useState(299); // Đặt mặc định là 299 giây
  const [error, setError] = useState(null);

  const {
    setting: settingLocPhat,
    defaultSetting: defaultSettingLocPhat,
    isDefaultLoading: isDefaultLoadingLocPhat,
    configSuccess: configSuccessLocPhat,
    configError: configErrorLocPhat,
  } = useSetting(1); // 1 là game Lộc phát 5d

  const {
    setting: settingTaiXiu,
    defaultSetting: defaultSettingTaiXiu,
    isDefaultLoading: isDefaultLoadingTaiXiu,
    configSuccess: configSuccessTaiXiu,
    configError: configErrorTaiXiu,
  } = useSetting(2); // 2 là game Tài xỉu

  const handleSave = async () => {
    const profitPercentLocPhatValue = parseFloat(profitPercentLocPhat);
    const profitPercentTaiXiuValue = parseFloat(profitPercentTaiXiu);

    if (isNaN(profitPercentLocPhatValue) || isNaN(profitPercentTaiXiuValue)) {
      setError('Giá trị nhập vào không hợp lệ');
      return;
    }

    if (profitPercentLocPhatValue < 1 || profitPercentTaiXiuValue < 1) {
      setError('Giá trị % lợi nhuận không được nhỏ hơn 1');
      return;
    }

    settingLocPhat({
      profitPercent: profitPercentLocPhatValue,
      sessionTime: sessionTime, // Sử dụng giá trị mặc định
    });

    settingTaiXiu({
      profitPercent: profitPercentTaiXiuValue,
      sessionTime: sessionTime, // Sử dụng giá trị mặc định
    });
  };

  useEffect(() => {
    if (!isDefaultLoadingLocPhat) {
      setProfitPercentLocPhat(defaultSettingLocPhat.profitPercent);
    }
    if (!isDefaultLoadingTaiXiu) {
      setProfitPercentTaiXiu(defaultSettingTaiXiu.profitPercent);
    }
    setSessionTime(299); // Đặt mặc định là 299 giây
  }, [isDefaultLoadingLocPhat, isDefaultLoadingTaiXiu]);

  useEffect(() => {
    if (configSuccessLocPhat || configSuccessTaiXiu) {
      setProfitPercentLocPhat(profitPercentLocPhat);
      setProfitPercentTaiXiu(profitPercentTaiXiu);
      setSessionTime(299); // Đặt mặc định là 299 giây
    }
  }, [configSuccessLocPhat, configSuccessTaiXiu]);

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
          label="Cấu hình % của ô cược Lộc phát 5D"
          variant="outlined"
          fullWidth
          type="text"
          value={profitPercentLocPhat}
          onChange={(e) => setProfitPercentLocPhat(e.target.value)}
          sx={{ mb: 4 }}
        />
        <TextField
          label="Cấu hình % của ô cược Tài xỉu"
          variant="outlined"
          fullWidth
          type="text"
          value={profitPercentTaiXiu}
          onChange={(e) => setProfitPercentTaiXiu(e.target.value)}
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

      <Snackbar
        open={configSuccessLocPhat || configSuccessTaiXiu}
        autoHideDuration={6000}
        onClose={() => {}}
      >
        <Alert onClose={() => {}} severity="success" sx={{ width: '100%' }}>
          Cấu hình thành công!
        </Alert>
      </Snackbar>

      <Snackbar
        open={configErrorLocPhat || configErrorTaiXiu}
        autoHideDuration={6000}
        onClose={() => {}}
      >
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
