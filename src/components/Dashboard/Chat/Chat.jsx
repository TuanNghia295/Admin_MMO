import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AvatarClone from '../../../assets/images/avatartClone.jpg';
import { Link, Outlet, useLocation } from 'react-router';
import { useConversations } from '../../../services/chatService';
import { useState } from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '30px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  marginTop: '1rem',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Chat() {
  const [limit, useLimit] = useState(100000000);
  const { listConversations, isLoadingConversations } = useConversations({
    limit,
    page: 1,
    q: '',
    order: 'DESC',
  });
  const location = useLocation(); // Sử dụng useLocation để lấy đường dẫn hiện tại
  console.log('listConversations', listConversations);

  return (
    <div className="flex">
      {/* ListChat dashboard */}
      <ul className="list-none w-[28%] text-black bg-white shadow-md mr-3 rounded-lg p-4 h-[96vh] overflow-y-auto">
        <h1 className=" font-[500] text-2xl">Đoạn chat</h1>
        {/* search */}
        {/* <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search> */}

        {/* chat list of user */}
        {Array.isArray(listConversations) &&
          listConversations.map((conversation) => {
            const { id, lastMessage, creator } = conversation;
            const isActive = location.pathname === `/dashboard/chat/${id}`; // Kiểm tra nếu đường dẫn hiện tại là đường dẫn của cuộc trò chuyện
            return (
              <Link
                to={`/dashboard/chat/${id}?fullName=${creator?.fullName}`}
                key={id}
              >
                <li
                  className={`w-full flex justify-evenly p-3 mt-2 rounded-md cursor-pointer ${
                    isActive ? 'bg-blue-500 text-white' : 'hover:bg-grayf5'
                  }`}
                >
                  <article className="flex justify-start w-full items-center">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={AvatarClone}
                      alt="avatar"
                    />
                    &nbsp;&nbsp;
                    <div className="flex flex-col justify-start overflow-hidden w-full  whitespace-nowrap overflow-x-hidden">
                      <h5>{creator?.fullName}</h5>
                      <p>{lastMessage?.text}</p>
                    </div>
                  </article>
                </li>
              </Link>
            );
          })}
      </ul>
      <div className="flex-grow bg-white rounded-md shadow-lg">
        <Outlet /> {/* Hiển thị các tuyến đường con */}
      </div>
    </div>
  );
}
