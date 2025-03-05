import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Button,
  TextField,
  IconButton,
  Avatar,
  styled,
  LinearProgress,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getConversationDetail,
  useConversationDetail,
} from '../../../services/chatService';
import TextComponent from '../../TextComponent';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ChatDetails() {
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // Trạng thái theo dõi quá trình tải lên
  const [uploadedFileName, setUploadedFileName] = useState(''); // Tên file đã tải lên
  const [uploadedFile, setUploadedFile] = useState(null); // File đã tải lên
  const queryParams = new URLSearchParams(location.search);
  const fullName = queryParams.get('fullName');
  const chatBodyRef = useRef(null); // Tham chiếu đến phần hiển thị tin nhắn

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [
      'conversationDetail',
      { limit: 10, q: '', order: 'DESC', conversationId: id },
    ],
    queryFn: getConversationDetail,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { sendMessageMutation, messageSuccess } = useConversationDetail({
    limit: 10,
    page: 1,
    q: '',
    order: 'DESC',
    conversationId: id,
  });

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if ((newMessage.trim() !== '' || uploadedFile) && !isUploading) {
      sendMessageMutation({
        conversationId: Number(id),
        file: uploadedFile,
      });
    } else if ((newMessage.trim() !== '' && !isUploading) || uploadedFile) {
      sendMessageMutation({
        conversationId: Number(id),
        text: newMessage,
        file: uploadedFile,
      });
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setIsUploading(true);
      setUploadedFileName(files[0].name); // Lưu tên file đã tải lên
      setUploadedFile(files[0]); // Lưu file đã tải lên
      // Giả lập quá trình tải lên
      const uploadInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(uploadInterval);
            setIsUploading(false);
            setProgress(0);
            return 100;
          }
          return prevProgress + 50;
        });
      }, 500);
    }
  };

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [data]);

  // Kiểm tra messageSuccess để cập nhật giao diện
  useEffect(() => {
    if (messageSuccess) {
      setNewMessage('');
      setUploadedFileName(''); // Xóa tên file sau khi gửi tin nhắn thành công
      setUploadedFile(null); // Xóa file sau khi gửi tin nhắn thành công
      queryClient.invalidateQueries([
        'conversationDetail',
        { conversationId: id },
      ]);
    }
  }, [messageSuccess, queryClient, id]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatBodyRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatBodyRef.current;
        const scrollPosition = scrollTop + clientHeight;
        if (
          scrollPosition <= scrollHeight * 0.5 &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      }
    };

    const chatBodyElement = chatBodyRef.current;
    if (chatBodyElement) {
      chatBodyElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatBodyElement) {
        chatBodyElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="flex items-center p-3 border-b shadow-sm">
        <Avatar src={data?.pages[0]?.data?.[0]?.creator?.avatar} />
        <h5 className="flex-1 ml-3 font-semibold">{fullName}</h5>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>

      {/* Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 p-3 flex flex-col-reverse gap-2 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 250px)' }} // Giới hạn chiều cao
      >
        {data?.pages?.map((page, pageIndex) =>
          page.data.map((message) => (
            <TextComponent
              key={message.id}
              text={message.text}
              sender={message.sender?.fullName}
              senderAvatar={message.senderAvatar}
              role={message.sender?.role}
              time={new Date(message.createdAt).toLocaleTimeString('vi-VN')}
              isMyMessage={message.sender === 'Me'}
              image={message?.attachments[0]?.url}
            />
          ))
        )}
        {isFetchingNextPage && (
          <div className="w-full flex justify-center p-3 mt-2">
            <span>Loading more...</span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t bg-white">
        <div className="flex items-center mb-2">
          <Button
            component="label"
            role={undefined}
            variant="text"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Tải lên
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileUpload}
              multiple
            />
          </Button>
          {isUploading && (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ width: '20%', marginLeft: 2 }}
            />
          )}
        </div>
        {uploadedFileName && !isUploading && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            File đã tải lên: {uploadedFileName}
          </Typography>
        )}
        <div className="flex items-center bg-white">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isUploading) {
                handleSendMessage();
              }
            }}
            className="mr-2"
            disabled={isUploading} // Vô hiệu hóa khi đang tải lên
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={isUploading}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
