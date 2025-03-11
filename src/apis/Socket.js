import { io } from 'socket.io-client';
import { END_POINTS } from '../constant/endpoints';

let socket;

// session và chat là namespace
const connectSocket = (accessToken) => {
  socket = io(END_POINTS + '/session', {
    extraHeaders: {
      Authorization: `${accessToken}`,
    },
  });
};

export { socket, connectSocket };
