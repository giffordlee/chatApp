import { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChatState } from '../context/ChatProvider';
import SnackBar from '../misc/SnackBar';

function LogIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");
  const { setUser } = ChatState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) navigate("/chats");
  }, [navigate]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleError = (err) => {
    console.log("error: ", err)
  };
  
  const handleSuccess = (msg) => {
    console.log("success: ", msg)
    setUsername('');
    setPassword('')
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (!username || !password) {
      setSnackbarMessage("Please Fill all Fields")
      setSnackbarStatus("warning")
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/user/login",
        { username, password },
        config
      );

      setSnackbarMessage("Log In Successful")
      setSnackbarStatus("success")
      setOpenSnackbar(true);

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      setSnackbarMessage("Error Occured!")
      setSnackbarStatus("error")
      setOpenSnackbar(true)
      setLoading(false);
    }

    // try {
    //   const { data } = await axios.post(
    //     "http://localhost:4000/api/user/login",
    //     {
    //       "username": username,
    //       "password": password
    //     },
    //     { withCredentials: true }
    //   );
    //   console.log('pop',data);
    //   const { success, message } = data;
    //   if (success) {
    //     handleSuccess(message);
    //     setTimeout(() => {
    //       navigate("/");
    //     }, 1000);
    //     localStorage.setItem("userInfo", JSON.stringify(data));
    //   } else {
    //     handleError(message);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    
  };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '8vh'}}>
      <Paper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2vh'}}>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <form style={{ width: '100%', marginTop: '1rem' }} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleUsernameChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: '1rem 0 2rem' }}
            loading={loading}
            onClick={handleLogin}
          >
            Log In
          </LoadingButton>
        </form>
        <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
        <Typography>Do not have an account? <Link to={"/signup"}>Sign Up</Link></Typography>
      </Paper>
    </Container>
  );
};

export default LogIn;
