import React, { useState } from 'react';
import { Button, TextField, Paper, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) {
      setError('Email không được để trống');
      return;
    }
    if (!password) {
      setError('Mật khẩu không được để trống');
      return;
    }

    try {
      const response = await fetch('http://192.168.0.104:3000/users');
      if (!response.ok) {
        throw new Error('Phản hồi mạng không ổn định');
      }
      const users = await response.json();
      console.log('Dữ liệu người dùng:', users);
      
      const user = users.find(u => u.email === email && u.password === password && u.role === 'admin');
      
      if (user) {
        navigate('/tabweb');
      } else {
        setError('Email hoặc mật khẩu không hợp lệ');
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>Đăng nhập quản trị viên</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Mật khẩu"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            style={{ marginTop: 20 }}
          >
            Đăng nhập
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
