// Ví dụ thay đổi component Admin.js
import React from 'react';
import { Button, Grid, Paper, Typography } from '@mui/material';  // Thư viện Web cho React

const Admin = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>
            Admin Dashboard
          </Typography>
          <Button variant="contained" color="primary">Manage Users</Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Admin;
