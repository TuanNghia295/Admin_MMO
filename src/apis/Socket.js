import { io } from 'socket.io-client';
import { END_POINTS } from '../constant/endpoints';

let socket;

const connectSocket = (accessToken) => {
  socket = io(END_POINTS + '/session', {
    extraHeaders: {
      Authorization: `${accessToken}`,
    },
  });
};

export { socket, connectSocket };
