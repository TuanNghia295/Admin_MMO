import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';
import { END_POINTS } from '../constant/endpoints';

// Lấy danh sách giao dịch
const getDepositList = async ({ queryKey }) => {
  const [_key, { limit, page, q, order = 'DESC', type = 'DEPOSIT' }] = queryKey;

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
const acceptDeposit = async (transactionId) => {
  const response = await axiosClient.post(
    `/transactions/approve?transactionId=${transactionId}`
  );
  return response.data;
};

// Nạp tiền thủ công
const depositManually = async ({ userId, amount }) => {
  console.log('userId, amount', userId);
  console.log('userId, amount', parseFloat(amount));

  const res = await axiosClient.post(`/wallets/deposit?userId=${userId}`, {
    amount,
  });
  console.log('res 😎😎😎😎', res.data);
  return res.data;
};

// Từ chối giao dịch
const rejectDeposit = async (transactionId) => {
  const response = await axiosClient.post(
    `/transactions/reject?transactionId=${transactionId}`
  );
  return response.data;
};

export const useDeposit = ({ limit, page, q, order }) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingListDeposit } = useQuery({
    queryFn: getDepositList,
    queryKey: [
      'listDeposits',
      { limit, page, q: q || '', order, type: 'DEPOSIT' },
    ],
    enabled: !!localStorage.getItem('role'),
    // staleTime: 10000, // thời gian cache để lấy dữ liệu mới
    // refetchOnWindowFocus: true, // tự động refetch khi focus vào tab
    // refetchInterval: 5000, // tự động refetch sau mỗi khoảng thời gian
  });

  const listDeposits = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPage = pagination.totalPages || 0;

  //   mutate việc chấp nhận giao dịch
  const { mutate: acceptDepositMutation, isPending: isLoadingAcceptDeposit } =
    useMutation({
      mutationFn: acceptDeposit,
      onSuccess: () => {
        queryClient.invalidateQueries('listDeposits');
      },
      onError: (error) => {
        console.log('Error when accepting deposit:', error);
      },
    });

  // mutate việc từ chối giao dịch
  const { mutate: rejectDepositMutation, isPending: isLoadingRejectDeposit } =
    useMutation({
      mutationFn: rejectDeposit,
      onSuccess: () => {
        queryClient.invalidateQueries('listDeposits');
      },
      onError: (error) => {
        console.log('Error when rejecting deposit:', error);
      },
    });

  return {
    listDeposits,
    totalPage,
    isLoadingListDeposit,
    acceptDepositMutation,
    isLoadingAcceptDeposit,
    rejectDepositMutation,
    isLoadingRejectDeposit,
  };
};

export const useDepositManually = () => {
  // mutate việc nạp tiền thủ công
  const queryClient = useQueryClient();
  const {
    mutate: depositManuallyMutation,
    isPending: isLoadingDepositManually,
  } = useMutation({
    mutationFn: depositManually,
    onSuccess: () => {
      queryClient.invalidateQueries('listDeposits');
    },
    onError: (error) => {
      console.log('Error when deposit manually:', error);
    },
  });

  return {
    depositManuallyMutation,
    isLoadingDepositManually,
  };
};
