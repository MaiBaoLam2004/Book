import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, Paper, Grid } from '@mui/material';
import axios from 'axios';

export default function PaymentWeb() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        axios.get('http://192.168.0.104:3000/payments')
            .then(response => {
                setPayments(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the payments!', error);
                setLoading(false);
            });
    }, []);

    const handlePaymentClick = (payment) => {
        setSelectedPayment(payment);
    };

    const handleClose = () => {
        setSelectedPayment(null);
    };

    return (
        <Grid container style={{ height: 'calc(100vh - 64px)', overflowY: 'auto', marginTop: 35, marginBottom: 30 }}>
            <Grid item xs={12} >
                <Paper >
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <List>
                            {payments.map((payment, index) => (
                                <ListItem
                                    button
                                    key={payment.id}
                                    onClick={() => handlePaymentClick(payment)}
                                    sx={{
                                        border: '1px solid #1976d2',
                                        borderRadius: '20px',
                                        marginBottom: '10px',
                                        '&:hover': {
                                            background: 'linear-gradient(to bottom, #05999E , #CBE7E3)', // Change background color on hover
                                        }
                                    }} // Add border color and margin
                                >
                                    <ListItemText
                                        secondary={
                                            <>
                                                <div style={{ color: 'black' }}>Email người dùng: {payment.userId.email}</div>
                                                <div style={{ color: 'black' }}>Tên người dùng: {payment.userId.username}</div>
                                                <div style={{ color: 'black' }}>Loại sân: {payment.fieldType}</div>
                                                <div style={{ color: 'black' }}>Thời gian sân: {payment.time}</div>
                                                <div style={{ color: 'black' }}>Ngày đặt: {new Date(payment.date).toLocaleDateString()}</div>
                                                <div style={{ color: 'black' }}>Giờ đặt: {new Date(payment.date).toLocaleTimeString()}</div>
                                                <div style={{ color: 'black' }}>Thông tin sân:</div>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', border: '1px solid #1976d2',
                                                    margin: '10px', gap: '10px', padding: '10px'
                                                }}>
                                                    <img src={payment.fieldId.image_url} alt={payment.fieldId.name} style={{ width: '15%', height: 'auto', marginRight: '10px' }} />
                                                    <div>
                                                        <div style={{ color: 'black' }}>Tên sân: {payment.fieldId.name}</div>
                                                        <div style={{ color: 'black' }}>Địa chỉ: {payment.fieldId.location}</div>
                                                        <div style={{ color: 'black' }}>Giá: {payment.fieldId.price_per_hour}</div>
                                                        <div style={{ color: 'black' }}>Số lượng người: {payment.fieldId.max_players}</div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}