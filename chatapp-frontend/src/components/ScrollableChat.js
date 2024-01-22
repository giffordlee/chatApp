import ScrollableFeed from 'react-scrollable-feed';
import { Typography } from '@mui/material';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../misc/ChatLogics";
import { ChatState } from '../context/ChatProvider';

function ScrollableChat({messages}) {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={i}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Typography 
                variant='caption' 
                sx={{display:'flex', alignItems:'center', fontWeight:'bold'}}
                mt="3px"
              >
                {m.sender.username}
              </Typography>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#E9F2EC"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                wordWrap:'break-word',
                fontFamily:'Lucida Sans Unicode',
                fontSize:'13px'
              }}
            >
              {m.content}
              <Typography sx={{fontSize:'10px', display:'flex', justifyContent:'flex-end'}}>{m.createdAt}</Typography>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat