import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import './index.css';
import LoginForm from './pages/Auth/LoginForm';
import HomePage from './pages/Home';
import Users from './components/Dashboard/Users';
import Deposit from './components/Dashboard/Deposit';
import Withdraw from './components/Dashboard/Withdraw';
import Config from './components/Dashboard/Config';
import Sale from './components/Dashboard/Sale';
import { useAuth } from './services/authService';
import { useEffect } from 'react';
import {
  socketConnect,
  socketDisconnect,
  socketOn,
} from './services/socketService';
import { useQueryClient } from '@tanstack/react-query';
import Chat from './components/Dashboard/Chat/Chat';
import ChatDetails from './components/Dashboard/Chat/ChatDetails';

function PrivateRoute({ children }) {
  const { user, isLoadingUser } = useAuth();
  const accessToken = localStorage.getItem('token');
  const client = useQueryClient();
  useEffect(() => {
    socketConnect(accessToken);

    socketOn('transaction.deposit', (data) => {
      client.invalidateQueries({
        queryKey: ['listDeposits'],
      });
    });

    socketOn('transaction.withdraw', (data) => {
      console.log('Withdraw:', data);
      client.invalidateQueries({
        queryKey: ['listWithDraw'],
      });
    });

    return () => {
      socketDisconnect();
    };
  }, [accessToken]);
  if (isLoadingUser) {
    return <div>Loading...</div>;
  }
  if (user) {
    localStorage.setItem('role', user.role);

    return children;
  } else {
    return <Navigate to="/" />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="sale" element={<Sale />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="chat" element={<Chat />}>
            <Route path=":id" element={<ChatDetails />} />
          </Route>
          <Route path="config" element={<Config />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
