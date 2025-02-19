import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';

// Lấy danh sách user
const fetchListUser = async ({ queryKey }) => {
  const [_key, { limit, page, q, order }] = queryKey;

  // Tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    order,
  });

  if (q) params.append('q', q); // Chỉ thêm q nếu có giá trị

  const response = await axiosClient.get(`/users?${params.toString()}`);
  console.log(response.data);
  return response.data;
};

// Tạo user mới
const createUser = async ({ phone, password, code }) => {
  const response = await axiosClient.post('/users', {
    phone,
    password,
    code,
  });
  return response.data;
};

// Xóa user
const deleteUser = async (id) => {
  console.log('Delete user:', id);
  const response = await axiosClient.delete(`/users?userId=${id}`);
  console.log('Delete user response:', response);
  return response.data;
};

// Sửa mật khẩu cho user
const changePassword = async ({ userId, password }) => {
  console.log('Change password:', userId, password);
  const response = await axiosClient.put(`/users`, {
    userId,
    password,
  });
  return response.data;
};

export const useUser = ({ limit, page, q, order }) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingListUser } = useQuery({
    queryKey: ['listUser', { limit, page, q: q || '', order }],
    queryFn: fetchListUser,
    enabled: !!localStorage.getItem('role'),
  });

  const listUser = data || [];
  const totalUsers = data?.length || 0;

  const { mutate: createUserMutation, isLoading: isLoadingCreateUser } =
    useMutation({
      mutationFn: createUser,
      onSettled: () => {
        queryClient.invalidateQueries('listUser');
      },
      onSuccess: () => {
        console.log('Create user successfully');
      },
      onError: (error) => {
        console.log(
          'Create user failed:',
          error.response?.data?.message || error.message
        );
      },
    });

  const { mutate: deleteUserMutation, isLoading: isLoadingDeleteUser } =
    useMutation({
      mutationFn: deleteUser,
      onSettled: () => {
        queryClient.invalidateQueries('listUser');
      },
      onSuccess: () => {
        console.log('Delete user successfully');
      },
      onError: (error) => {
        console.log(
          'Delete user failed:',
          error.response?.data?.message || error.message
        );
      },
    });

  const { mutate: changePasswordMutation, isLoading: isLoadingChangePassword } =
    useMutation({
      mutationFn: changePassword,
      onSettled: () => {
        queryClient.invalidateQueries('listUser');
      },
      onSuccess: () => {
        console.log('Change password successfully');
      },
      onError: (error) => {
        console.log(
          'Change password failed:',
          error.response?.data?.message || error.message
        );
      },
    });

  return {
    listUser,
    totalUsers,
    isLoadingListUser,
    createUserMutation,
    isLoadingCreateUser,
    deleteUserMutation,
    isLoadingDeleteUser,
    changePasswordMutation,
    isLoadingChangePassword,
  };
};
