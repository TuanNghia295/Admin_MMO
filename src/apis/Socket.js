import { io } from 'socket.io-client';
import { END_POINTS } from '../constant/endpoints';

let socket;

const connectSocket = (accessToken) => {
  console.log('Connecting socket', accessToken);
  socket = io(END_POINTS + '/manager', {
    extraHeaders: {
      Authorization: `${accessToken}`,
    },
  });
};

export { socket, connectSocket };
