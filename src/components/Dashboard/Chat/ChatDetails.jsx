import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, TextField, IconButton, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useConversationDetail } from '../../../services/chatService';
import { debounce } from 'lodash';
import TextComponent from '../../TextComponent';

export default function ChatDetails() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fullName = queryParams.get('fullName');
  const {
    conversationDetail,
    isLoadingConversationDetail,
    sendMessageMutation,
  } = useConversationDetail({
    limit: 10,
    page: 1,
    q: '',
    order: 'DESC',
    conversationId: id,
  });

  const [newMessage, setNewMessage] = useState('');
  const chatBodyRef = useRef(null); // Tham chiếu đến phần hiển thị tin nhắn

  const debouncedSendMessage = useCallback(
    debounce((message) => {
      if (message.trim() !== '') {
        sendMessageMutation({
          conversationId: Number(id),
          text: message,
        });
        setNewMessage('');
      }
    }, 500),
    [sendMessageMutation, id]
  );

  const handleSendMessage = () => {
    debouncedSendMessage(newMessage);
  };

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [conversationDetail]);

  if (isLoadingConversationDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="flex items-center p-3 border-b shadow-sm">
        <Avatar src={conversationDetail?.creator?.avatar} />
        <h5 className="flex-1 ml-3 font-semibold">{fullName}</h5>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </div>

      {/* Chat Body */}
      <div
        ref={chatBodyRef}
        className="flex-1 p-3 flex flex-col-reverse gap-2  overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 200px)' }} // Giới hạn chiều cao
      >
        {conversationDetail.map((message, index) => (
          <TextComponent
            key={message.id}
            text={message.text}
            sender={message.sender?.fullName}
            senderAvatar={message.senderAvatar}
            role={message.sender?.role}
            time={new Date(message.createdAt).toLocaleTimeString('vi-VN')}
            isMyMessage={message.sender === 'Me'}
          />
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-3 border-t flex items-center bg-white">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          className="mr-2"
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}
