import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/signup",
        {
          "username": username,
          "password": password
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleError = (err) => {
    console.log("error: ", err)
  };
  const handleSuccess = (msg) => {
    console.log("success: ", msg)
    setUsername('');
    setPassword('');
  };

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
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: '1rem 0 2rem' }}
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </form>
        <Typography>Already have an account? <Link to={"/login"}>Log In</Link></Typography>
      </Paper>
    </Container>
  );
};

export default SignUp;
