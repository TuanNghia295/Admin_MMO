import React from 'react';
import { END_POINTS } from '../../constant/endpoints';

/**
 * @typedef {object} TextComponentProps
 * @property {string} text - Nội dung tin nhắn
 * @property {string} sender - Người gửi tin nhắn
 * @property {string} time - Thời gian gửi tin nhắn
 * @property {string} role - Vai trò của người gửi tin nhắn (MANAGER, SALE, USER, ADMIN, ...)
 * @property {string} [image] - URL của hình ảnh (nếu có)
 */
export default function TextComponent({ text, sender, time, role, image }) {
  const isMyMessage = role === 'MANAGER' || role === 'SALE';

  return (
    <div
      className={`flex items-start gap-2.5 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 
          ${isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'} 
          rounded-e-xl rounded-es-xl`}
      >
        <div className="flex items-center justify-between space-x-2">
          <span
            className={`text-sm font-semibold ${isMyMessage ? 'text-white' : 'text-gray-900'}`}
          >
            {sender}
          </span>
          <span
            className={`text-xs ${isMyMessage ? 'text-white' : 'text-gray-500'}`}
          >
            {time}
          </span>
        </div>
        {image && (
          <img
            src={`${END_POINTS}/${image}`}
            alt={`${image}`}
            className="my-2 max-w-full h-auto rounded"
          />
        )}
        <div
          className="flex justify-start flex-wrap text-sm font-normal py-2.5 break-words w-full max-w-full overflow-hidden"
          style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
        >
          {text === 'undefined' ? '' : text || ''}
        </div>
      </div>
    </div>
  );
}
