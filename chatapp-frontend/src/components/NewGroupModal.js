import {Modal, Typography, Button, Box, TextField, List, ListItem, Checkbox, ListItemButton, Snackbar, Alert, ListItemText} from '@mui/material';
import { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ChatState } from "../context/ChatProvider";
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NewGroupModal({children}) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("")
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const { user, chats, setChats } = ChatState();

  const handleFetchUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get('http://localhost:4000/api/user?search=', config);
    console.log("data", data);
    setUserList(data);
  }


  useEffect(() => {
    if (user) {
      handleFetchUsers()
    }
  },[user])

  const handleToggle = (value) => () => {
    const currentIndex = checkedUsers.indexOf(value);
    const newChecked = [...checkedUsers];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedUsers(newChecked);
    console.log(newChecked)
  };

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
    setCheckedUsers([])
    setGroupChatName("")
  }
  const handleCreateGroupChat = async () => {
    if (!groupChatName || !checkedUsers) {
      console.log("Fill all fields");
      return
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(checkedUsers.map((u) => u._id)),
        },
        config
      );
      console.log(data)
      setChats([data, ...chats]);
      handleClose();

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
            Create New Group Chat
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Group Chat Name"
            variant="outlined"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {userList.map((userDetail) => {
              const labelId = `checkbox-list-secondary-label-${userDetail._id}`;
              return (
                <ListItem
                  key={userDetail._id}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(userDetail)}
                      checked={checkedUsers.indexOf(userDetail) !== -1}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  }
                  disablePadding
                >
                  <ListItemButton sx={{marginRight:1}}>
                    
                      <AccountCircleIcon />
                    
                    <ListItemText id={labelId} primary={userDetail.username} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Button variant="contained" color="primary" onClick={handleCreateGroupChat}>
            Create Group Chat
          </Button>
        </Box>
      </Modal>
    </div>
  );
}