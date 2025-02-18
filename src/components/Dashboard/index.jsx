import React from 'react';
import { NAVIGATION_ADMIN } from '../../constant';
import { NavLink, Outlet } from 'react-router';
import { Button } from '@mui/material';

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <ul className="w-1/5 bg-white text-black h-full flex flex-col">
        <div className="font-bold text-2xl p-4 text-center">
          <NavLink to={'/dashboard'}>
            <h1>Quản lý</h1>
          </NavLink>
        </div>
        <div className="flex-grow">
          {NAVIGATION_ADMIN.map((item, index) => {
            const { title, icon, href } = item;
            return (
              <NavLink
                to={href}
                key={index}
                className={({ isActive }) =>
                  isActive
                    ? 'flex w-full items-center p-4  text-blue-800 cursor-pointer'
                    : 'flex w-full items-center p-4 hover:bg-grayf5 hover:text-black cursor-pointer'
                }
              >
                {icon}
                <span className="ml-2">{title}</span>
              </NavLink>
            );
          })}
        </div>
        <div className="flex justify-start pl-4 ">
          <p>Chức vụ: Admin</p>
        </div>
        <div className="flex justify-center p-4">
          <Button
            className="w-full"
            variant="contained"
            color="warning"
            href="/"
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
