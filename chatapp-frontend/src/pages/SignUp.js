import { useState, useEffect } from 'react';
import {
  TextField,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SnackBar from '../misc/SnackBar';

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");

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

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true)
    if (!username || !password || !confirmPassword) {
      setSnackbarMessage("Please Fill all Fields")
      setSnackbarStatus("warning")
      setOpenSnackbar(true);
      setLoading(false)
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords Do Not Match")
      setSnackbarStatus("warning")
      setOpenSnackbar(true);
      setLoading(false)
      return;
    }
    console.log(username, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data, status } = await axios.post(
        "http://localhost:4000/api/user/signup",
        {
          "username": username,
          "password": password
        },
        config
      );

      if (status !== 201) {
        setSnackbarMessage("Error Occured!!")
        setSnackbarStatus("error")
        setOpenSnackbar(true)
        setLoading(false);
        return;
      }
      console.log(data);
      setSnackbarMessage("Registration Successful")
      setSnackbarStatus("success")
      setOpenSnackbar(true);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      setSnackbarMessage(error.response.data.message)
      setSnackbarStatus("error")
      setOpenSnackbar(true)
      setLoading(false);
    }
    // if (password === confirmPassword) {
    //   try {
    //     const { data } = await axios.post(
    //       "http://localhost:4000/api/user/signup",
    //       {
    //         "username": username,
    //         "password": password
    //       },
    //       { withCredentials: true }
    //     );
    //     const { success, message } = data;
    //     if (success) {
    //       handleSuccess(data);
    //       setTimeout(() => {
    //         navigate("/chats");
    //       }, 1000);
    //       localStorage.setItem("userInfo", JSON.stringify(data));
    //     } else {
    //       handleError(message);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } else {
    //   console.log("Password dont match")
    // }
  };

  // const handleError = (err) => {
  //   console.log("error: ", err)
  // };
  // const handleSuccess = (msg) => {
  //   console.log("success: ", msg)
  //   setUsername('');
  //   setPassword('');
  //   setConfirmPassword('');
  // };

  return (
    <Container component="main" maxWidth="xs" style={{ marginTop: '8vh'}}>
      <Paper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2vh'}}>
        <Typography component="h1" variant="h5">
          Sign Up
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
            type={showPassword? "text" : "password"}
            id="password"
            autoComplete="new-password"
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Confirm Password"
            type={showPassword? "text" : "password"}
            id="confirm_password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
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
            onClick={handleSignup}
          >
            Sign Up
          </LoadingButton>
        </form>
        <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
        <Typography>Already have an account? <Link to={"/"}>Log In</Link></Typography>
      </Paper>
    </Container>
  );
};

export default SignUp;
