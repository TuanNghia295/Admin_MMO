import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddCardIcon from '@mui/icons-material/AddCard';
import WalletIcon from '@mui/icons-material/Wallet';
import SettingsIcon from '@mui/icons-material/Settings';
import BadgeIcon from '@mui/icons-material/Badge';

export const NAVIGATION_ADMIN = [
  {
    title: 'Quản lý người dùng',
    href: '/dashboard/users',
    icon: <ManageAccountsIcon />,
  },
  {
    title: 'Quản lý sale',
    href: '/dashboard/sale',
    icon: <BadgeIcon />,
  },
  {
    title: 'Quản lý nạp',
    href: '/dashboard/deposit',
    icon: <AddCardIcon />,
  },
  {
    title: 'Quản lý rút',
    href: '/dashboard/withdraw',
    icon: <WalletIcon />,
  },
  {
    title: 'Cấu hình',
    href: '/dashboard/config',
    icon: <SettingsIcon />,
  },
];

export const NAVIGATION_SALE = [
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

export const ROLE = {
  ADMIN: 'MANAGER',
  SALE: 'SALE',
};
