import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';
import { useState } from 'react';

const fetchUser = async () => {
  const response = await axiosClient.get('/managers/me');
  return response;
};

const loginUser = async ({ phone, password }) => {
  const response = await axiosClient.post('/auth/managers/login', {
    phone,
    password,
  });
  return response;
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: !!localStorage.getItem('token') && !isLoggedOut,
  });

  const { mutate: login, isLoading: isLoadingLogin } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      setIsLoggedOut(false);
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      console.error(
        'Login failed:',
        error.response?.data?.message || error.message
      );
    },
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedOut(true);
  };

  return {
    user,
    isLoadingUser,
    isLoadingLogin,
    login,
    logout,
    isLoggedOut,
  };
};
