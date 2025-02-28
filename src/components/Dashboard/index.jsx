import { NAVIGATION_ADMIN, NAVIGATION_SALE, ROLE } from '../../constant';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router';
import { Button } from '@mui/material';
import { useAuth } from '../../services/authService';
import { useEffect } from 'react';

export default function Dashboard() {
  const { logout, isLoggedOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // dùng để lấy đường dẫn hiện tại
  let role = localStorage.getItem('role');
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (isLoggedOut) {
      navigate('/');
    }
  }, [isLoggedOut, navigate]);

  const isChatPage = location.pathname.includes('/dashboard/chat');

  return (
    <div className="flex h-screen">
      <ul
        className={`${isChatPage ? 'w-[8%]' : 'xl:w-1/5'} transition-all duration-300 ease-linear bg-primary text-white h-full flex flex-col`}
      >
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
                      ? `flex w-full items-center p-4 ${!isChatPage ? 'xl:justify-start' : 'justify-center'} text-primary bg-white shadow-xl cursor-pointer`
                      : `flex w-full items-center p-4 ${!isChatPage ? 'xl:justify-start' : 'justify-center'} hover:bg-grayf4 hover:bg-opacity-80 hover:text-primary cursor-pointer`
                  }
                >
                  {icon}
                  <span
                    className={`ml-2 ${isChatPage ? 'hidden' : 'xl:inline'}`}
                  >
                    {title}
                  </span>
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
