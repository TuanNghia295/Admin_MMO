import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';

// Lấy danh sách user với thông tin phân trang
const fetchListUser = async ({ queryKey }) => {
  const [_key, { limit, page, q, order }] = queryKey;

  // Tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    page,
    order,
  });

  if (q) params.append('q', q); // Chỉ thêm q nếu có giá trị

  const response = await axiosClient.get(`/users?${params.toString()}`);
  console.log(response.data);
  return response; // Dữ liệu trả về có cấu trúc: { data: [...], pagination: { ... } }
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
  const response = await axiosClient.delete(`/users?userId=${id}`);
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

  // Nếu API trả về dạng: { data: [...], pagination: {...} }
  const listUser = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPage = pagination.totalPages || 0;

  console.log('List user:', listUser);
  console.log('Pagination:', pagination);
  console.log('Total users:', totalPage);

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
    pagination,
    totalPage,
    isLoadingListUser,
    createUserMutation,
    isLoadingCreateUser,
    deleteUserMutation,
    isLoadingDeleteUser,
    changePasswordMutation,
    isLoadingChangePassword,
  };
};
