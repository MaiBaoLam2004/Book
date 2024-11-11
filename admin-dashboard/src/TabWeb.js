import React, { useState } from 'react';
import { Grid, Paper, Typography, Tabs, Tab, useMediaQuery, useTheme, Box } from '@mui/material';
import Home from './Home';
import PaymentWeb from './PaymentWeb';

const TabWeb = () => {
    const [tabIndex, setTabIndex] = useState(() => {
        const savedIndex = localStorage.getItem('tabIndex');
        return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
    });
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
        localStorage.setItem('tabIndex', newValue);
    };

    const renderTabContent = () => {
        switch (tabIndex) {
            case 0:
                return <Home />;
            case 1:
                return <PaymentWeb />;
            default:
                return <Home />;
        }
    };

    return (

            <Box sx={{ height: '100vh', overflow: 'hidden' }}>
                <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Admin Dashboard
                        </Typography>
                    </Paper>
                </Box>
                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={12} sm={3} md={2} sx={{ position: 'fixed', top: 75, bottom: 0, zIndex: 1000 }}>
                        <Paper elevation={3} sx={{ height: 'calc(100vh - 64px)', padding: 2 }}>
                            <Tabs
                                orientation={isSmallScreen ? "horizontal" : "vertical"}
                                value={tabIndex}
                                onChange={handleTabChange}
                                aria-label="Tabs example"
                                variant={isSmallScreen ? "scrollable" : "standard"}
                            >
                                <Tab label="Home" />
                                <Tab label="PaymentWeb" />
                            </Tabs>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10} sx={{ marginLeft: isSmallScreen ? 0 : '16.67%', marginTop: 5 }}>
                        <Paper sx={{ overflow: 'auto' }}>
                            {renderTabContent()}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
    
    );
};

export default TabWeb;
