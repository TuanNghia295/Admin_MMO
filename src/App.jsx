import { BrowserRouter, Route, Routes } from 'react-router';
import './index.css';
import LoginForm from './pages/Auth/LoginForm';
import HomePage from './pages/Home';
import Users from './components/Dashboard/Users';
import Deposit from './components/Dashboard/Deposit';
import Withdraw from './components/Dashboard/Withdraw';
import Config from './components/Dashboard/Config';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/dashboard" element={<HomePage />}>
          <Route path="users" element={<Users />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="config" element={<Config />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
