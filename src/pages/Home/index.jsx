import React from 'react';
import Dashboard from '../../components/Dashboard';
import { Outlet } from 'react-router';

export default function HomePage() {
  return (
    <>
      <Dashboard />
      <Outlet />
    </>
  );
}
