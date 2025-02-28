import { useParams } from 'react-router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';

export default function ChatDetails() {
  const { id } = useParams();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: 'Nguyen Tuan Nghia' },
    { id: 2, text: 'Hi there!', sender: 'Me' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: 'Me' },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="list-none w-full text-black border-b-2 mr-3 rounded-tr-md rounded-tl-md p-2 overflow-y-auto h-full flex flex-col">
      {/* Tên và option */}
      <div className="flex w-full items-center justify-start pl-2 border-b pb-2">
        <h5 className="flex-1">Nguyen Tuan Nghia</h5>
        <Button variant="text" color="black">
          <MoreVertIcon />
        </Button>
      </div>

      {/* Body để hiển thị tin nhắn */}
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'Me' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`p-2 rounded-lg ${message.sender === 'Me' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Form field nơi để nhập tin nhắn */}
      <div className="border-t pt-2">
        <div className="flex items-center">
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
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
