import { useState, useEffect } from 'react';
import { TextField, Box, Typography, Modal, Button } from '@mui/material';
import { ChatState } from '../context/ChatProvider';
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

export default function SettingsModal({children}) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {user, setUser} = ChatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPassword("");
  }

  useEffect(() => {
    setUsername(JSON.parse(localStorage.getItem("userInfo")).user.username)
    console.log(JSON.parse(localStorage.getItem("userInfo")).user.username)
  },[open])

  const handleUpdateUsername = async() => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:4000/api/user/update`,
        {
          newUsername: username,
          password: password,
        },
        config
      );
      data.token = user.token
      data.success = user.sucess
      console.log("data", data)

      setUser(data)
      localStorage.setItem("userInfo", JSON.stringify(data));
      handleClose();
    } catch (error) {
      console.log(error)
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