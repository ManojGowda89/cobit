import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(isLogin ? "Login Data:" : "Signup Data:", { email, password });
    // 👉 Replace with API call
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          component={motion.div}
          key={isLogin ? "login" : "signup"}
          initial={{ x: isLogin ? -200 : 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isLogin ? 200 : -200, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            {isLogin ? "Login" : "Signup"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, borderRadius: 2, py: 1.2 }}
            >
              {isLogin ? "Login" : "Signup"}
            </Button>
          </Box>

          <Typography
            align="center"
            sx={{ mt: 3, cursor: "pointer", color: "primary.main" }}
            onClick={toggleForm}
          >
            {isLogin
              ? "Don't have an account? Signup Today"
              : "Already have an account? Login"}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
