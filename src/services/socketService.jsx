import { connectSocket, socket } from '../apis/Socket';

export const socketConnect = (accessToken) => {
  return connectSocket(accessToken);
};

export const socketOn = (eventName, callback) => {
  if (socket) {
    return socket.on(eventName, callback);
  }
};

export const socketOff = (eventName) => {
  if (socket) {
    return socket.off(eventName);
  }
};

export const socketDisconnect = () => {
  if (socket) {
    return socket.disconnect();
  }
};

export const socketEmit = (eventName, data) => {
  if (socket) {
    return socket.emit(eventName, data);
  }
};
