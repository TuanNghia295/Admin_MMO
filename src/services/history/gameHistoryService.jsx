// Lấy danh sách lịch sử giao dịch game num-guess của người chơi theo id
import axiosClient from '../../apis/AxiosClient';
import { useQuery } from '@tanstack/react-query';

// Game đoán số
const getNumGuessHistory = async ({ queryKey }) => {
  const [_key, { limit, page, order = 'DESC', userId }] = queryKey;

  const params = new URLSearchParams({ limit, page, order, userId });
  const res = await axiosClient.get(`/num-guess?${params.toString()}`);
  console.log('res', res);
  return res;
};

export const useNumGuessHistory = ({ limit, page, order, userId }) => {
  const {
    data: numGuessHistory,
    isLoading: isLoadingNumGuessHistory,
    refetch,
  } = useQuery({
    queryKey: [
      'numGuessHistory',
      {
        limit,
        page,
        order,
        userId,
      },
    ],
    queryFn: getNumGuessHistory,
    enabled: !!localStorage.getItem('role'),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const listNumGuessHistory = numGuessHistory?.data || [];
  const pagination = numGuessHistory?.pagination || {};
  const totalPage = pagination.totalPages || 0;

  return {
    numGuessHistory,
    isLoadingNumGuessHistory,
    refetch,
    listNumGuessHistory,
    totalPage,
  };
};

// Game tài lộc
const getTaiLocHistory = async ({ queryKey }) => {
  const [_key, { limit, page, order = 'DESC', userId }] = queryKey;
  const params = new URLSearchParams({ limit, page, order, userId });
  const res = await axiosClient.get(`/sic-bo?${params.toString()}`);
  console.log('res tai loc', res);
  return res;
};

export const useTaiLocHistory = ({ limit, page, order, userId }) => {
  const { data: taiLocHistory, isLoading: isLoadingTailoc } = useQuery({});
};
