import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';

const fetchSaleListUser = async ({ queryKey }) => {
  const [_key, { limit, page, q, order }] = queryKey;

  // Tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    page,
    order,
  });

  if (q) params.append('q', q); // Chỉ thêm q nếu có giá trị

  const response = await axiosClient.get(`/sales?${params.toString()}`);
  console.log(response.data);
  return response; // Dữ liệu trả về có cấu trúc: { data: [...], pagination: { ... } }
};

const createSale = async ({ fullName, phone, password }) => {
  const response = await axiosClient.post('/sales', {
    fullName,
    phone,
    password,
  });
  return response.data;
};

export const useSale = ({ limit, page, q, order }) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingListSale } = useQuery({
    queryKey: ['listSales', { limit, page, q: q || '', order }],
    queryFn: fetchSaleListUser,
    enabled: !!localStorage.getItem('role'), // Chỉ gọi API khi đã đăng nhập
  });

  const listSales = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPage = pagination.totalPages || 0;

  const { mutate: createSaleMutation, isPending: isLoadingCreateSale } =
    useMutation({
      mutationFn: createSale,
      onSuccess: () => {
        queryClient.invalidateQueries('listSales');
      },
      onError: (error) => {
        console.log('Error when creating sale:', error);
      },
    });
  return {
    listSales,
    totalPage,
    isLoadingListSale,
    createSaleMutation,
    isLoadingCreateSale,
  };
};
