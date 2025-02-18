import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddCardIcon from '@mui/icons-material/AddCard';
import WalletIcon from '@mui/icons-material/Wallet';
import SettingsIcon from '@mui/icons-material/Settings';

export const NAVIGATION_ADMIN = [
  {
    title: 'Quản lý người dùng',
    href: '/dashboard/users',
    icon: <ManageAccountsIcon />,
  },
  {
    title: 'Nạp',
    href: '/dashboard/deposit',
    icon: <AddCardIcon />,
  },
  {
    title: 'Rút',
    href: '/dashboard/withdraw',
    icon: <WalletIcon />,
  },
  {
    title: 'Cấu hình',
    href: '/dashboard/config',
    icon: <SettingsIcon />,
  },
];

export const NAVIGATION_USER = [
  {
    title: 'Quản lý người dùng',
    href: '/dashboard/users',
    icon: <ManageAccountsIcon />,
  },
  {
    title: 'Nạp',
    href: '/dashboard/deposit',
    icon: <AddCardIcon />,
  },
  {
    title: 'Rút',
    href: '/dashboard/withdraw',
    icon: <WalletIcon />,
  },
];
