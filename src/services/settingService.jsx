import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';

// Lấy thông tin settings
const fetchSettings = async ({ queryKey }) => {
  const [_, type] = queryKey;
  try {
    const response = await axiosClient.get(`/settings?type=${type}`);
    console.log('response', response);
    return response || {};
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return {};
  }
};

// Cài đặt tính năng cấu hình trò chơi
const fetchConfigGame = async ({ profitPercent, sessionTime, type }) => {
  try {
    const response = await axiosClient.put(`/settings`, {
      profitPercent,
      sessionTime,
      type,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to configure game settings:', error);
    throw error;
  }
};

export const useSetting = (type) => {
  const queryClient = useQueryClient();
  const { data: defaultSetting, isLoading: isDefaultLoading } = useQuery({
    queryKey: ['defaultSetting', type],
    queryFn: fetchSettings,
    enabled: !!localStorage.getItem('token'),
  });

  const {
    mutate: setting,
    isLoading: isLoadingSetting,
    isSuccess: configSuccess,
    isError: configError,
  } = useMutation({
    mutationKey: ['defaultSetting', type],
    mutationFn: (data) => fetchConfigGame({ ...data, type }),
    onSuccess: () => {
      // refresh lại dữ liệu
      console.log('success');
      queryClient.invalidateQueries(['defaultSetting', type]);
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
