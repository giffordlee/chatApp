import { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsModal from './SettingsModal';
import { ChatState } from '../context/ChatProvider';
import SnackBar from '../misc/SnackBar';

function NavigationBar({SignOut, username}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = ChatState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");

  const handleDropDown = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor:'black'}}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat App
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDropDown}
              color="inherit"
            >
              <AccountCircle />
              <Typography sx={{ml:1}}>
                {user.username}
              </Typography>
            </IconButton>
            <Menu
              // id="menu-appbar"
              anchorEl={anchorEl}
              // anchorOrigin={{
              //   vertical: 'bottom',
              //   horizontal: 'right',
              // }}
              keepMounted
              // transformOrigin={{
              //   vertical: 'top',
              //   horizontal: 'right',
              // }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <SettingsModal setOpenSnackbar={setOpenSnackbar} setSnackbarMessage={setSnackbarMessage} setSnackbarStatus={setSnackbarStatus}> 
                <MenuItem onClick={handleClose}>Settings</MenuItem>
              </SettingsModal>
              <MenuItem onClick={SignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
    </Box>
  )
}

export default NavigationBar