import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';

// Lấy thông tin settings
const fetchSettings = async () => {
  try {
    const response = await axiosClient.get(`/settings`);
    console.log('response', response);
    return response || {};
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return {};
  }
};

// Cài đặt tính năng cấu hình trò chơi
const fetchConfigGame = async ({ profitPercent, sessionTime }) => {
  try {
    const response = await axiosClient.put(`/settings`, {
      profitPercent,
      sessionTime,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to configure game settings:', error);
    throw error;
  }
};

export const useSetting = () => {
  const queryClient = useQueryClient();
  const { data: defaultSetting, isLoading: isDefaultLoading } = useQuery({
    queryKey: ['defaultSetting'],
    queryFn: fetchSettings,
    enabled: !!localStorage.getItem('token'),
  });

  const {
    mutate: setting,
    isLoading: isLoadingSetting,
    isSuccess: configSuccess,
    isError: configError,
  } = useMutation({
    mutationKey: ['defaultSetting'],
    mutationFn: fetchConfigGame,
    onSuccess: () => {
      // refresh lại dữ liệu
      console.log('success');
      queryClient.invalidateQueries('defaultSetting');
    },
  });

  return {
    setting,
    isLoadingSetting,
    configSuccess,
    configError,
    defaultSetting,
    isDefaultLoading,
  };
};
