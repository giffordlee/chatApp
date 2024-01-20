import {
  Modal, 
  Typography, 
  Button, 
  Box, 
  TextField, 
  List, 
  ListItem, 
  Checkbox, 
  ListItemButton, 
  ListItemText,
  Tab,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ChatState } from "../context/ChatProvider";
import axios from 'axios';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// import LoadingButton from '@mui/lab/LoadingButton';
import SnackBar from '../misc/SnackBar';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height:400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NewChatModal({children}) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("")
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const { user, chats, setChats, setSelectedChat } = ChatState();
  const [value, setValue] = useState("1");
  const [loadingChat, setLoadingChat] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");
  
  const handleFetchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('http://localhost:4000/api/user?search=', config);
      console.log("list", data);
      setUserList(data);
    } catch (error) {
      setSnackbarMessage("Error fetching user list")
      setSnackbarStatus("error")
      setOpenSnackbar(true)
    }
  }


  useEffect(() => {
    handleFetchUsers()
  },[])

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
      setSnackbarMessage("Fill all fields")
      setSnackbarStatus("warning")
      setOpenSnackbar(true)
      return;
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
      setChats([data, ...chats]);
      setSelectedChat(data);
      handleClose();
      setSnackbarMessage("New group chat created!")
      setSnackbarStatus("success")
      setOpenSnackbar(true)
    } catch (error) {
      console.log(error)
      setSnackbarMessage("Error occurred!")
      setSnackbarStatus("error")
      setOpenSnackbar(true)
    }
  };

  const handleCreatePersonalChat = async (userId) => {
    setLoadingChat(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4000/api/chat`,
        {
          "userId": userId
        },
        config
      );
      console.log('lol',data)

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      handleClose();

    } catch (error) {
      console.log(error)
      setSnackbarMessage("Error fetching the chat")
      setSnackbarStatus("error")
      setOpenSnackbar(true)
    }
    setLoadingChat(false)
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <>{children}</>
        )}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <TabContext value={value}>
        <Box sx={style}>
          
          <TabList onChange={handleChangeTab} centered>
            <Tab label="New Group" value="1"/>
            <Tab label="New Chat" value="2" />
          </TabList>
          <TabPanel value="1">
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
            <List dense sx={{ width: '100%', bgcolor: 'background.paper', maxHeight:"180px", overflowY:'auto', mb:1 }}>
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
          </TabPanel>
          <TabPanel value="2">
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Start New Chat
            </Typography>
            <List sx={{ overflowY: 'auto', maxHeight:"280px"}}>
              {userList.map((userData) =>
                <ListItem key={userData._id} button onClick={() => handleCreatePersonalChat(userData._id)}>
                  <ListItemText primary={userData.username}/>
                </ListItem>
              )}
            </List>
          </TabPanel>
        </Box>
        </TabContext>
      </Modal>
      <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
    </div>
  );
}