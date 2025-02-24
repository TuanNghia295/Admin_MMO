import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../apis/AxiosClient';

// Lịch sử nạp rút
const getTransactionList = async ({ queryKey }) => {
  const [_key, { limit, page, order = 'DESC', userId }] = queryKey;
  const params = new URLSearchParams({ limit, page, order, userId });
  const res = await axiosClient.get(`/transactions?${params.toString()}`);
  // console.log('res transactions', res);
  return res;
};

export const useTransaction = ({ limit, page, order, userId }) => {
  const { data: transactionHistory, isLoading: isLoadingTransaction } =
    useQuery({
      queryKey: [
        'transactionHistory',
        {
          limit,
          page,
          order,
          userId,
        },
      ],
      queryFn: getTransactionList,
      enabled: !!localStorage.getItem('role'),
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    });

  const listTransactionHistory = transactionHistory?.data || [];
  const pagination = transactionHistory?.pagination || {};
  const totalPageTransaction = pagination.totalPages || 0;

  return {
    transactionHistory,
    isLoadingTransaction,
    listTransactionHistory,
    totalPageTransaction,
  };
};
