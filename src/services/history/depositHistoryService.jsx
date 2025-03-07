import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../apis/AxiosClient.js';

// Lấy lịch sử nạp
const getDepositHistory = async ({ queryKey }) => {
  const [_key, { limit, page, q, order }] = queryKey;
  const params = new URLSearchParams({
    limit,
    page,
    order,
  });

  if (q) params.append('q', q); // Chỉ thêm q nếu có giá trị

  const res = await axiosClient.get(
    `/managers/transactions?${params.toString()}`
  );

  return res;
};

export const useDepositHistory = ({ limit, page, q, order = 'DESC' }) => {
  const { data, isLoading: isLoadingDepositHistory } = useQuery({
    queryKey: ['depositHistory', { limit, page, q, order }],
    queryFn: getDepositHistory,
    enabled: !!localStorage.getItem('role'),
  });

  const pagination = data?.pagination;
  const depositHistory = data?.data;
  const totalPage = pagination?.totalPages;

  return {
    depositHistory,
    pagination,
    totalPage,
    isLoadingDepositHistory,
  };
};
