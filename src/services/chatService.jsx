import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';

// lấy danh sách tin nhắn, lấy full hội thoại với id
const getConversations = async ({ queryKey }) => {
  const [_key, { limit, page, q, order = 'DESC' }] = queryKey;

  // tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    page,
    order,
  });

  if (q) params.append('q', q); // chỉ thêm q nếu có giá trị

  const response = await axiosClient.get(`/conversations?${params.toString()}`);
  return response.data; // dữ liệu trả về có cấu trúc: { data: [...], pagination: { ... } }
};

// Lấy chi tiết cuộc trò chuyện thông qua conversationId
const getConversationDetail = async ({ queryKey }) => {
  const [_key, { limit, page, q, order = 'DESC', conversationId }] = queryKey;

  // tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    page,
    order,
    conversationId, // thêm conversationId vào params
  });

  if (q) params.append('q', q); // chỉ thêm q nếu có giá trị
  const response = await axiosClient.get(`/messages?${params.toString()}`);
  return response.data;
};

// Gửi tin nhắn tới người dùng qua conversationId
const sendMessage = async ({ conversationId, text }) => {
  const response = await axiosClient.post(`/messages`, {
    conversationId,
    text,
  });
  return response.data;
};

// Hook sử dụng để lấy danh sách cuộc trò chuyện
export const useConversations = ({ limit, page, q, order }) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', { limit, page, q: q || '', order }],
    queryFn: getConversations,
    enabled: !!localStorage.getItem('role'),
  });

  const listConversations = data?.data || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination?.totalPages || 0;

  return { listConversations, totalPages, isLoadingConversations, pagination };
};

// Hook sử dụng để lấy chi tiết cuộc trò chuyện
export const useConversationDetail = ({
  limit,
  page,
  q,
  order,
  conversationId,
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingConversationDetail } = useQuery({
    queryKey: [
      'conversationDetail',
      { limit, page, q: q || '', order, conversationId },
    ],
    queryFn: getConversationDetail,
    enabled: !!localStorage.getItem('role'),
  });

  const conversationDetail = data || [];

  const {
    mutate: sendMessageMutation,
    isLoading: isSendingMessage,
    isError: messageError,
  } = useMutation({
    mutationKey: 'sendMessage',
    mutationFn: sendMessage,
    onSuccess: (data) => {
      console.log('Message sent successfully', data);
      // sau khi gửi tin nhắn thành công, cần phải refresh lại dữ liệu
      queryClient.invalidateQueries({
        queryKey: [
          'conversationDetail',
          { limit, page, q: q || '', order, conversationId },
        ],
      });
    },
  });

  return {
    conversationDetail,
    isLoadingConversationDetail,
    sendMessageMutation,
    isSendingMessage,
    messageError,
  };
};

// Export getConversations để sử dụng trong Chat.jsx
export { getConversations };
