import React, { useState } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
} from '@mui/material';

const gameTypes = [
  { id: 1, name: 'Game 1' },
  { id: 2, name: 'Game 2' },
  { id: 3, name: 'Game 3' },
  // Add more game types as needed
];

export default function Config() {
  const [selectedGame, setSelectedGame] = useState('');
  const [countdownTime, setCountdownTime] = useState('');
  const [betPercentage, setBetPercentage] = useState('');

  const handleSave = () => {
    // Save the countdown time and bet percentage for the selected game to the server or state management
    console.log(
      'Game:',
      selectedGame,
      'Countdown time saved:',
      countdownTime,
      'Bet percentage saved:',
      betPercentage
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cấu hình trò chơi
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel>Chọn loại trò chơi</InputLabel>
          <Select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            label="Chọn loại trò chơi"
          >
            {gameTypes.map((game) => (
              <MenuItem key={game.id} value={game.name}>
                {game.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Thời gian đếm ngược (giây)"
          variant="outlined"
          fullWidth
          type="number"
          value={countdownTime}
          onChange={(e) => setCountdownTime(e.target.value)}
          sx={{ mb: 4 }}
        />
        <TextField
          label="Phần trăm cược (%)"
          variant="outlined"
          fullWidth
          type="number"
          value={betPercentage}
          onChange={(e) => setBetPercentage(e.target.value)}
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
    </Box>
  );
}
