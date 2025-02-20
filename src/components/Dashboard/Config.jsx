import React, { useEffect, useState } from 'react';
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
  // const [selectedGame, setSelectedGame] = useState('');

  const [profitPercent, setProfitPercent] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const {
    setting,
    defaultSetting,
    isLoadingSetting,
    isDefaultLoading,
    configSuccess,
    configError,
  } = useSetting();

  const handleSave = async () => {
    setting({ profitPercent, sessionTime });
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
        {/* <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="game-select-label">Chọn loại trò chơi</InputLabel>
          <Select
            labelId="game-select-label"
            id="game-select"
            value={selectedGame}
            label="Chọn loại trò chơi"
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            <MenuItem value="Game Đoán Số">Game Đoán Số</MenuItem>
            <MenuItem value="Game Tài Lộc">Game Tài Lộc</MenuItem>
          </Select>
        </FormControl> */}
        {/* 
        {selectedGame && (
        )} */}
        <>
          <TextField
            label="Cấu hình % của ô cược"
            variant="outlined"
            fullWidth
            type="number"
            value={profitPercent}
            onChange={(e) => setProfitPercent(e.target.value)}
            sx={{ mb: 4 }}
          />
        </>
        <TextField
          label="Cấu hình thời gian đếm ngược của phiên (giây)"
          variant="outlined"
          fullWidth
          type="number"
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
    </Container>
  );
}
