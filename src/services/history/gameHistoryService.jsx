// Lấy danh sách lịch sử giao dịch game num-guess của người chơi theo id
import axiosClient from '../../apis/AxiosClient';
import { useQuery } from '@tanstack/react-query';

// Game đoán số
const getNumGuessHistory = async ({ queryKey }) => {
  const [_key, { limit, page, order = 'DESC', userId }] = queryKey;

  const params = new URLSearchParams({ limit, page, order, userId });
  const res = await axiosClient.get(`/num-guess?${params.toString()}`);
  // console.log('res doan so', res);
  return res;
};

export const useNumGuessHistory = ({ limit, page, order, userId }) => {
  const { data: numGuessHistory, isLoading: isLoadingNumGuessHistory } =
    useQuery({
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
  const totalPageDoanSo = pagination.totalPages || 0;

  return {
    numGuessHistory,
    isLoadingNumGuessHistory,
    listNumGuessHistory,
    totalPageDoanSo,
  };
};

// Game tài lộc
const getTaiLocHistory = async ({ queryKey }) => {
  const [_key, { limit, page, order = 'DESC', userId }] = queryKey;
  const params = new URLSearchParams({ limit, page, order, userId });
  const res = await axiosClient.get(`/sic-bo?${params.toString()}`);
  // console.log('res tai loc', res);
  return res;
};

export const useTaiLocHistory = ({ limit, page, order, userId }) => {
  const { data: taiLocHistory, isLoading: isLoadingTailoc } = useQuery({
    queryKey: [
      'taiLocHistory',
      {
        limit,
        page,
        order,
        userId,
      },
    ],
    queryFn: getTaiLocHistory,
    enabled: !!localStorage.getItem('role'),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const listTaiLocHistory = taiLocHistory?.data || [];
  const pagination = taiLocHistory?.pagination || {};
  const totalPageTaiLoc = pagination.totalPages || 0;

  return {
    taiLocHistory,
    isLoadingTailoc,
    pagination,
    listTaiLocHistory,
    totalPageTaiLoc,
  };
};
