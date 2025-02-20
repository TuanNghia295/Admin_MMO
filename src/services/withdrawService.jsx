import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';
import { END_POINTS } from '../constant/endpoints';

// Lấy danh sách giao dịch
const getWithDrawList = async ({ queryKey }) => {
  const [_key, { limit, page, q, order = 'DESC', type = 'WITHDRAW' }] =
    queryKey;

  // Tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    page,
    order,
    type,
  });

  if (q) params.append('q', q); // Chỉ thêm q nếu có giá trị

  const response = await axiosClient.get(`/transactions?${params.toString()}`);
  return response; // Dữ liệu trả về có cấu trúc: { data: [...], pagination: { ... } }
};

// Chấp nhận giao dịch
const acceptWithDraw = async (transactionId) => {
  const response = await axiosClient.post(
    `/transactions/approve?transactionId=${transactionId}`
  );
  return response.data;
};

// Từ chối giao dịch
const rejectWithDraw = async (transactionId) => {
  const response = await axiosClient.post(
    `/transactions/reject?transactionId=${transactionId}`
  );
  return response.data;
};

export const useWithDraw = ({ limit, page, q, order }) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingListWithDraw } = useQuery({
    queryFn: getWithDrawList,
    queryKey: [
      'listWithDraw',
      { limit, page, q: q || '', order, type: 'WITHDRAW' },
    ],
    enabled: !!localStorage.getItem('role'),
    // staleTime: 10000, // thời gian cache để lấy dữ liệu mới
    // refetchOnWindowFocus: true, // tự động refetch khi focus vào tab
    // refetchInterval: 5000, // tự động refetch sau mỗi khoảng thời gian
  });

  const listWithDraws = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPage = pagination.totalPages || 0;

  // mutate việc chấp nhận giao dịch
  const { mutate: acceptWithDrawMutation, isLoading: isLoadingAcceptWithDraw } =
    useMutation({
      mutationFn: acceptWithDraw,
      onSuccess: () => {
        queryClient.invalidateQueries('listWithDraw');
      },
      onError: (error) => {
        console.log('Error when accepting withdrawal:', error);
      },
    });

  // mutate việc từ chối giao dịch
  const { mutate: rejectWithDrawMutation, isLoading: isLoadingRejectWithDraw } =
    useMutation({
      mutationFn: rejectWithDraw,
      onSuccess: () => {
        queryClient.invalidateQueries('listWithDraw');
      },
      onError: (error) => {
        console.log('Error when rejecting withdrawal:', error);
      },
    });

  return {
    listWithDraws,
    totalPage,
    isLoadingListWithDraw,
    acceptWithDrawMutation,
    isLoadingAcceptWithDraw,
    rejectWithDrawMutation,
    isLoadingRejectWithDraw,
  };
};
