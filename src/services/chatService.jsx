import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../apis/AxiosClient';
import { MessageTypeEnum } from '../constant';

// lấy danh sách tin nhắn, lấy full hội thoại với id
const getConversations = async ({ queryKey, pageParam = 1 }) => {
  const [_key, { limit, q, order = 'DESC' }] = queryKey;

  // tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    page: pageParam,
    order,
  });

  if (q) params.append('q', q); // chỉ thêm q nếu có giá trị

  const response = await axiosClient.get(`/conversations?${params.toString()}`);
  // console.log('response', response);

  return {
    data: response.data,
    nextCursor:
      response.pagination.currentPage < response.pagination.totalPages
        ? response.pagination.currentPage + 1
        : undefined,
  };
};

// Lấy chi tiết cuộc trò chuyện thông qua conversationId
const getConversationDetail = async ({ queryKey, pageParam = 1 }) => {
  const [_key, { limit, q, order = 'DESC', conversationId, guestId }] =
    queryKey;

  // tạo query params linh hoạt
  const params = new URLSearchParams({
    limit,
    page: pageParam,
    order,
    conversationId, // thêm conversationId vào params
  });

  if (q) params.append('q', q); // chỉ thêm q nếu có giá trị
  if (guestId) params.append('guestId', guestId);
  const response = await axiosClient.get(`/messages?${params.toString()}`);

  return {
    data: response.data,
    nextCursor:
      response.pagination.currentPage < response.pagination.totalPages
        ? response.pagination.currentPage + 1
        : undefined,
  };
};

// Gửi tin nhắn tới người dùng qua conversationId
const sendMessage = async ({ conversationId, text, file, type }) => {
  const formData = new FormData();
  formData.append('conversationId', conversationId);
  formData.append('text', text);
  formData.append('type', type || MessageTypeEnum.TEXT);
  if (file) {
    formData.append('file', file);
  }
  const response = await axiosClient.post(`/messages`, formData);
  return response.data;
};

// Sửa tin nhắn với messgageId
const editMessage = async ({ messageId, text }) => {
  const response = await axiosClient.put(`/messages/${messageId}`, { text });
  return response.data;
};

// Xóa tin nhắn với messageId
const deleteMessage = async ({ messageId }) => {
  const response = await axiosClient.delete(`/messages/${messageId}`);
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
  messageId,
  guestId,
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading: isLoadingConversationDetail } = useQuery({
    queryKey: [
      'conversationDetail',
      { limit, page, q: q || '', order, conversationId, guestId },
    ],
    queryFn: getConversationDetail,
    enabled: !!localStorage.getItem('role'),
  });

  const conversationDetail = data || [];

  const {
    mutate: sendMessageMutation,
    isLoading: isSendingMessage,
    isError: messageError,
    isSuccess: messageSuccess,
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

  // Sửa tin nhắn người dùngs
  const {
    mutate: editMessageMutation,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: 'editMessage',
    mutationFn: editMessage,
    onSuccess: (data) => {
      console.log('Message edited successfully', data);
      // sau khi sửa tin nhắn thành công, cần phải refresh lại dữ liệu
      queryClient.invalidateQueries({
        queryKey: ['conversationDetail', { messageId }],
      });
    },
  });

  // Xóa tin nhắn người dùng
  const {
    mutate: deleteMessageMutation,
    isPending: isDeletingMessage,
    isSuccess: deleteMessageSuccess,
    isError: deleteMessageError,
  } = useMutation({
    mutationKey: 'deleteMessage',
    mutationFn: deleteMessage,
    onSuccess: (data) => {
      console.log('Message deleted successfully', data);
      // sau khi xóa tin nhắn thành công, cần phải refresh lại dữ liệu
      queryClient.invalidateQueries({
        queryKey: ['conversationDetail', { messageId }],
      });
    },
  });

  return {
    conversationDetail,
    isLoadingConversationDetail,
    sendMessageMutation,
    isSendingMessage,
    messageError,
    messageSuccess,
    editMessageMutation,
    deleteMessageMutation,
  };
};

// Export getConversations để sử dụng trong Chat.jsx
export { getConversations, getConversationDetail };
