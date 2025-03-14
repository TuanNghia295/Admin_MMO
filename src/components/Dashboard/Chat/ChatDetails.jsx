import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Button,
  TextareaAutosize,
  IconButton,
  Avatar,
  styled,
  LinearProgress,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getConversationDetail,
  useConversationDetail,
} from '../../../services/chatService';
import TextComponent from '../../TextComponent';
import ImageIcon from '@mui/icons-material/Image';
import { MessageTypeEnum } from '../../../constant';
import { Modal, Box } from '@mui/material';
import { END_POINTS } from '../../../constant/endpoints';

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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  outline: 'none',
};

export default function ChatDetails() {
  const { id, guestId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileType, setFileType] = useState(MessageTypeEnum.TEXT); // State để kiểm soát type
  const queryParams = new URLSearchParams(location.search);
  const fullName = queryParams.get('fullName');
  const chatBodyRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null); // State để quản lý vị trí menu
  const [selectedMessage, setSelectedMessage] = useState(null); // State để lưu tin nhắn được chọn
  const [isEditing, setIsEditing] = useState(false); // State để kiểm soát chế độ chỉnh sửa
  const [editedMessage, setEditedMessage] = useState(''); // State để lưu nội dung chỉnh sửa
  const fileInputRef = useRef(null); // Tham chiếu đến input file

  const [messageUpdateId, setMessageUpdateId] = useState(null);

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

  const {
    sendMessageMutation,
    messageSuccess,
    editMessageMutation,
    deleteMessageMutation,
  } = useConversationDetail({
    limit: 10,
    page: 1,
    q: '',
    order: 'DESC',
    conversationId: id,
    guestId: guestId,
  });

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if ((newMessage.trim() !== '' || uploadedFile) && !isUploading) {
      const messagePayload = {
        conversationId: Number(id),
        file: uploadedFile,
        type: fileType, // Sử dụng fileType đã được set
      };

      if (newMessage.trim() !== '') {
        messagePayload.text = newMessage;
      }

      sendMessageMutation(messagePayload);
    }
  };

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setIsUploading(true);
      setUploadedFileName(files[0].name);
      setUploadedFile(files[0]);
      setFileType(MessageTypeEnum.IMAGE); // Set type là IMAGE
      simulateUpload();

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      setIsUploading(true);
      setUploadedFileName(file.name);
      setUploadedFile(file);

      // Kiểm tra loại file để set type
      if (file.type.startsWith('image/')) {
        setFileType(MessageTypeEnum.IMAGE); // File là ảnh
      } else {
        setFileType(MessageTypeEnum.FILE); // File là tệp khác (docx, pdf, v.v.)
      }

      simulateUpload();

      // Reset giá trị input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const simulateUpload = () => {
    const uploadInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          setProgress(0);
          return 100;
        }
        return prevProgress + 10;
      }, 500);
    });
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl); // Mở modal và set ảnh cần preview
  };

  const handleMenuOpen = (event, message) => {
    setMessageUpdateId(message.id);
    setAnchorEl(event.currentTarget); // Mở menu tại vị trí click
    setSelectedMessage(message); // Lưu tin nhắn được chọn
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Đóng menu
    setSelectedMessage(null); // Xóa tin nhắn được chọn
  };

  const handleDeleteMessage = () => {
    // Xử lý logic xóa tin nhắn (sẽ thêm sau)
    console.log('Xóa tin nhắn:', selectedMessage);
    deleteMessageMutation({ messageId: selectedMessage.id });
    handleMenuClose(); // Đóng menu sau khi xử lý
  };

  const handleEditMessage = () => {
    console.log('selectedMessage', selectedMessage.id);
    setMessageUpdateId(selectedMessage.id);
    setIsEditing(true); // Bật chế độ chỉnh sửa
    setEditedMessage(selectedMessage.text); // Set nội dung chỉnh sửa
    handleMenuClose(); // Đóng menu
  };

  const handleSaveEdit = () => {
    if (messageUpdateId && editedMessage.trim() !== '') {
      editMessageMutation({ messageId: messageUpdateId, text: editedMessage });
      setIsEditing(false); // Tắt chế độ chỉnh sửa
      setEditedMessage(''); // Xóa nội dung chỉnh sửa
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Tắt chế độ chỉnh sửa
    setEditedMessage(''); // Xóa nội dung chỉnh sửa
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [data]);

  useEffect(() => {
    if (messageSuccess) {
      console.log('da vao');

      setNewMessage('');
      setUploadedFileName('');
      setUploadedFile(null);
      setFileType(MessageTypeEnum.TEXT); // Reset type về TEXT
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
    <div className="flex flex-col h-full w-full bg-white relative">
      {/* Header */}
      <div className="flex items-center p-3 border-b shadow-sm">
        <Avatar src={data?.pages[0]?.data?.[0]?.creator?.avatar} />
        <h5 className="flex-1 ml-3 font-semibold">
          {fullName === 'undefined' ? 'Khách' : fullName}
        </h5>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>

      {/* Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 p-3 flex flex-col-reverse gap-2 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {data?.pages?.map((page, pageIndex) =>
          page.data.map((message) => (
            <TextComponent
              key={message.id}
              messageId={message.id}
              text={message.text}
              sender={message.sender?.fullName}
              senderAvatar={message.senderAvatar}
              role={message.sender?.role}
              time={new Date(message.createdAt).toLocaleTimeString('vi-VN')}
              isMyMessage={message.sender === 'Me'}
              image={message?.attachments[0]?.url}
              file={{
                url: message?.attachments[0]?.url,
                name: message?.attachments[0]?.name,
              }}
              type={message.type} // Loại tin nhắn (IMAGE, FILE, TEXT)
              onImageClick={handleImageClick}
              onMenuClick={handleMenuOpen}
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
      <div className="p-3 border-t bg-white absolute bottom-0 w-full ">
        <div className="flex items-center mb-2 max-h-[30%] overflow-y-scroll">
          {/* Nút upload ảnh */}
          <Button
            component="label"
            role={undefined}
            variant="text"
            tabIndex={-1}
            startIcon={<ImageIcon />}
          >
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              ref={fileInputRef}
            />
          </Button>

          {/* Nút upload file */}
          <Button
            component="label"
            role={undefined}
            variant="text"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileUpload}
              multiple
              ref={fileInputRef}
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
          <TextareaAutosize
            minRows={3}
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="mr-2 w-full p-2 border rounded"
            disabled={isUploading}
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

      <Modal
        open={!!previewImage} // Mở modal khi có ảnh preview
        onClose={() => setPreviewImage(null)} // Đóng modal khi click bên ngoài hoặc nút đóng
        aria-labelledby="image-preview-modal"
        aria-describedby="image-preview-modal-description"
      >
        <Box sx={style}>
          <img
            src={`${END_POINTS}/${previewImage}`}
            alt="Preview"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
          />
        </Box>
      </Modal>

      {/* Menu chính sửa và xóa tin nhắn */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditMessage}>Chỉnh sửa</MenuItem>
        <MenuItem onClick={handleDeleteMessage}>Xóa</MenuItem>
      </Menu>

      {/* UI Chỉnh Sửa Tin Nhắn */}
      {isEditing && (
        <div className="p-3 border-t bg-white absolute bottom-0 w-full">
          <TextareaAutosize
            minRows={3}
            placeholder="Chỉnh sửa tin nhắn..."
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
            className="mr-2 w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outlined" onClick={handleCancelEdit}>
              Hủy
            </Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Lưu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
