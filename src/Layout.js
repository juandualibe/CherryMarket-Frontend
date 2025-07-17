import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Divider, Button } from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';

import logo from './assets/logo.png';

const drawerWidth = 240;

const Layout = ({ onLogout }) => {
    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Punto de Venta', icon: <PointOfSaleIcon />, path: '/pos' },
        { text: 'Gestión', icon: <InventoryIcon />, path: '/management' },
    ];

    // Definimos una altura para la sección del logo, y la AppBar la igualará
    const headerHeight = '90px';

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                // 1. La AppBar NO ocupa el 100%. Empieza donde termina el menú lateral.
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                }}
            >
                {/* 2. Aplicamos la altura deseada al Toolbar para hacer la barra más alta */}
                <Toolbar sx={{ height: headerHeight }}>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Panel de Administración
                    </Typography>
                    <Button color="inherit" variant="outlined" onClick={onLogout}>Cerrar Sesión</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderRight: 'none', // Quitamos el borde derecho
                    },
                }}
            >
                {/* 3. NO hay Toolbar espaciador. El contenido empieza desde el borde superior. */}
                <Box sx={{ overflow: 'auto' }}>
                    {/* Contenedor del logo con la misma altura que la AppBar para alineación perfecta */}
                    <Box sx={{ height: headerHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={logo} alt="Logo Cherry Market" style={{ height: 60 }} />
                    </Box>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding component={RouterLink} to={item.path} sx={{ color: 'white' }}>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: 'white' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                {/* Espaciador para el contenido principal, debe coincidir con la altura de la AppBar */}
                <Box sx={{ height: headerHeight }}/>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;