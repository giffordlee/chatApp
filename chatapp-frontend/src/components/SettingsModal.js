import { useState, useEffect } from 'react';
import { TextField, Box, Typography, Modal, Button } from '@mui/material';
import { ChatState } from '../context/ChatProvider';
import SnackBar from '../misc/SnackBar';
import axios from 'axios';
import { io } from 'socket.io-client';

var socket
const ENDPOINT = "http://localhost:4000";

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

export default function SettingsModal({children, setSnackbarMessage ,setSnackbarStatus, setOpenSnackbar}) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {user, setUser} = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPassword("");
  }

  useEffect(() => {
    setUsername(user.username)
  },[user, open])

  const handleUpdateUsername = async() => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const oldUsername = user.username;

      const { data } = await axios.post(
        `http://localhost:4000/api/user/update`,
        {
          newUsername: username,
          password: password,
        },
        config
      );
      const { userData } = data
      console.log(userData)
      setUser(userData)
      localStorage.setItem("userInfo", JSON.stringify(userData));
      setSnackbarMessage("Username changed successfully!")
      setSnackbarStatus("success")
      setOpenSnackbar(true)
      handleClose();
      socket.emit("username updated", {oldUsername:oldUsername, newUsername:userData.username})
    } catch (error) {
      setSnackbarMessage(error.response.data.message)
      setSnackbarStatus("error")
      setOpenSnackbar(true)
      
    }
  };
  

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
    
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change username
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="New username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Enter password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleUpdateUsername}>
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
}