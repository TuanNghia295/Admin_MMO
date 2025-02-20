import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';
// Lịch sử nạp rút
const getTransactionHistory = async ({ limit, page, order = 'DESC' }) => {
  const params = new URLSearchParams({
    limit,
    page,
    order,
  });
  const response = await axiosClient.get(
    `/transaction/history?${params.toString()}`
  );
  return response;
};

// Lịch sử game NumGuess của người dùng theo ID
const getTransactionNumGuess = async ({ limit, page, order = 'DESC' }) => {
  const params = new URLSearchParams({
    limit,
    page,
    order,
  });
  const response = await axiosClient.get(
    `/transaction/user?${params.toString()}`
  );
  return response;
};

export const useHistoryTransaction = ({ limit, page, order }) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ['transactionHistory', { limit, page, order }],
    queryFn: getTransactionHistory,
    enabled: !!localStorage.getItem('role'),
  });

  const listTransaction = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPage = pagination.totalPages || 0;

  return {
    listTransaction,
    totalPage,
    isLoadingTransaction,
  };
};
