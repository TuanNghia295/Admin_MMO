import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';

// hàm lấy ra danh sách ngân hàng
const getBankList = async () => {
  try {
    const res = await fetch('https://api.vietqr.io./v2/banks').then((res) =>
      res.json()
    );
    return res.data;
  } catch (error) {
    console.log('Error when getting bank list: ', error);
  }
};

// hàm cập nhật thông tin ngân hàng của người dùng theo userId
const updateBankAccount = async ({
  userId,
  bankName,
  accountName,
  accountNumber,
}) => {
  const response = await axiosClient.post(`/banks`, {
    userId,
    bankName,
    accountName,
    accountNumber,
  });
  return response.data;
};

export const useBank = () => {
  const queryClient = useQueryClient();

  const {
    data: bankList,
    isLoading: gettingBankList,
    isError,
  } = useQuery({
    queryKey: ['updateBankAccount'],
    queryFn: getBankList,
    enabled: !!localStorage.getItem('role'),
  });

  const { mutate: bankMutation, isLoading: isBankLoading } = useMutation({
    mutationKey: ['updateBankAccount'],
    mutationFn: updateBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries('updateBankAccount');
    },
    onError: (error) => {
      console.log('Update bank account failed: ', error);
    },
  });
  return { bankList, gettingBankList, bankMutation, isBankLoading };
};
