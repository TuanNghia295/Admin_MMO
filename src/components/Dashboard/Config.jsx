import React, { useState } from 'react';
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';

export default function Config() {
  const [selectedGame, setSelectedGame] = useState('');
  const [betPercentage, setBetPercentage] = useState('');
  const [countdownTime, setCountdownTime] = useState('');

  const handleSave = () => {
    // Save the configuration for the selected game to the server or state management
    console.log(
      'Game:',
      selectedGame,
      'Bet percentage:',
      betPercentage,
      'Countdown time:',
      countdownTime
    );
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý trò chơi
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Trò chơi
        </Typography>
        <FormControl fullWidth sx={{ mb: 4 }}>
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
        </FormControl>

        {selectedGame && (
          <>
            <TextField
              label="Cấu hình % của ô cược"
              variant="outlined"
              fullWidth
              type="number"
              value={betPercentage}
              onChange={(e) => setBetPercentage(e.target.value)}
              sx={{ mb: 4 }}
            />
            <TextField
              label="Cấu hình thời gian đếm ngược của phiên (giây)"
              variant="outlined"
              fullWidth
              type="number"
              value={countdownTime}
              onChange={(e) => setCountdownTime(e.target.value)}
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
          </>
        )}
      </Paper>
    </Container>
  );
}
