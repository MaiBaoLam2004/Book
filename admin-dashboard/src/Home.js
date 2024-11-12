import React, { useState, useEffect } from 'react';
import { Grid, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, ListItemAvatar, Avatar } from '@mui/material';
import { useMediaQuery } from '@mui/material';

const Home = () => {
    const [footballFields, setFootballFields] = useState([]);
    const isMobile = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(min-width:600px) and (max-width:960px)');
    const isDesktop = useMediaQuery('(min-width:960px)');

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('http://192.168.0.104:3000/football_fields').then(res => res.json());
            setFootballFields(data);
        };
        fetchData();
    }, []);

    return (
        <Grid container >
            <Grid item xs={12}>
                <Paper elevation={3} style={{ height: 'calc(100vh - 64px)', overflowY: 'auto', marginTop: 35, marginBottom: 30 }}>
                    <List>
                        {footballFields.map((field) => (
                            <ListItem
                                key={field.id}
                                alignItems="flex-start"
                                sx={{
                                    border: '1px solid #1976d2',
                                    marginBottom: '10px',
                                    '&:hover': {
                                        background: 'linear-gradient(to bottom, #05999E , #CBE7E3)', // Change background color on hover
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar variant="square" src={field.image_url} style={{ width: 100, height: 100 }} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={field.name}
                                    secondary={
                                        <>
                                            <div style={{ color: 'black', }}>Địa chỉ: {field.location}</div>
                                            <div style={{ color: 'black', }}>Giá: {field.price_per_hour}</div>
                                            <div style={{ color: 'black', }}>Chi tiết: {field.details}</div>
                                            <div style={{ color: 'black', }}>Loại cỏ: {field.surface_type}</div>
                                            <div style={{ color: 'black', }}>Số người: {field.max_players}</div>
                                        </>
                                    }
                                    style={{ marginLeft: 20 }}
                                />
                                <ListItemSecondaryAction>
                                    <div style={{margin:10, marginBottom:10}}>
                                        <div style={{ backgroundColor: 'green', color: 'white', width: 60, height: 40, textAlign: 'center' }}>
                                            Sửa
                                        </div>
                                        <div style={{ backgroundColor: 'red', color: 'white', width: 60, height: 40, textAlign: 'center' }}>
                                            Xoá
                                        </div>
                                    </div>

                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Home;
