import React, {  useState } from "react";
import {
  Typography,
  Box,
  Container,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Snackbar,
  Stack,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const theme = createTheme();
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get("email"),
        password: data.get("password"),
      });
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user/login`,
        {
          email: data.get("email"),
          password: data.get("password"),
        }
      );
      localStorage.setItem('accessToken', response.data.token);
      navigate('/campaigner', {replace: true})
    } catch (error) {
      setShowAlert(true);
      setMessage(error.response.data.message);
      console.log(error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowAlert(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
          </Box>
        </Box>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
             anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            open={showAlert}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
