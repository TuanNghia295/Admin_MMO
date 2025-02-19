import { NAVIGATION_ADMIN, NAVIGATION_SALE, ROLE } from '../../constant';
import { useNavigate, NavLink, Outlet } from 'react-router';
import { Button } from '@mui/material';
import { useAuth } from '../../services/authService';
import { useEffect } from 'react';

export default function Dashboard() {
  const { logout, isLoggedOut } = useAuth();
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (isLoggedOut) {
      navigate('/');
    }
  }, [isLoggedOut, navigate]);

  return (
    <div className="flex h-screen">
      <ul className="w-1/5 bg-primary text-white h-full flex flex-col">
        <div className="font-bold text-2xl p-4 text-center">
          <NavLink to={'/dashboard/users'}>
            <h1>Quản lý</h1>
          </NavLink>
        </div>
        <div className="flex-grow">
          {(role === ROLE.ADMIN ? NAVIGATION_ADMIN : NAVIGATION_SALE).map(
            (item, index) => {
              const { title, icon, href } = item;
              return (
                <NavLink
                  to={href}
                  key={index}
                  className={({ isActive }) =>
                    isActive
                      ? 'flex w-full items-center p-4  text-primary bg-white cursor-pointer'
                      : 'flex w-full items-center p-4 hover:bg-grayf5 hover:text-primary cursor-pointer'
                  }
                >
                  {icon}
                  <span className="ml-2">{title}</span>
                </NavLink>
              );
            }
          )}
        </div>
        <div className="flex justify-start pl-4 ">
          <p>Chức vụ: {role}</p>
        </div>
        <div className="flex justify-center p-4">
          <Button
            className="w-full"
            variant="outlined"
            color="white"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </ul>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
