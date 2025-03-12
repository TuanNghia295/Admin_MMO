import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddCardIcon from '@mui/icons-material/AddCard';
import WalletIcon from '@mui/icons-material/Wallet';
import SettingsIcon from '@mui/icons-material/Settings';
import BadgeIcon from '@mui/icons-material/Badge';
import ChatIcon from '@mui/icons-material/Chat';
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
  {
    title: 'Trò chuyện',
    href: '/dashboard/chat',
    icon: <ChatIcon />,
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
  {
    title: 'Trò chuyện',
    href: '/dashboard/chat',
    icon: <ChatIcon />,
  },
];

export const ROLE = {
  ADMIN: 'MANAGER',
  SALE: 'SALE',
};

export const ErrorCode = {
  // Common Validation
  // Odd Even
  OD001: 'OD001',
  OD002: 'OD002',

  // Validation
  V001: 'V001',

  // User
  U002: 'U002',

  // Sale
  S001: 'S001',
  S002: 'S002',
  S003: 'S003',

  // SESSION
  SE001: 'SE001',

  // Wallet
  W003: 'W003',

  // Setting
  ST001: 'ST001',
};

export const MessageTypeEnum = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
};
