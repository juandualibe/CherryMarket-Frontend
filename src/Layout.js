import React, { useState } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Divider, Button, IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';

import logo from './assets/logo.png';

const drawerWidth = 240;
const headerHeight = '90px'; // La altura que definimos para el header

const Layout = ({ onLogout }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Punto de Venta', icon: <PointOfSaleIcon />, path: '/pos' },
        { text: 'Gestión', icon: <InventoryIcon />, path: '/management' },
    ];

    const drawerContent = (
        <div>
            <Box sx={{ height: headerHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logo} alt="Logo Cherry Market" style={{ height: 60 }} />
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding component={RouterLink} to={item.path} sx={{ color: 'white' }}>
                        <ListItemButton>
                            <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                // Lógica de posicionamiento condicional para la AppBar
                sx={{
                    // En pantallas 'md' y superiores, empieza DESPUÉS del drawer
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    // En pantallas pequeñas ('xs', 'sm'), ocupa el 100%
                }}
            >
                <Toolbar sx={{ height: headerHeight }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }} // Solo se muestra en móvil
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Panel de Administración
                    </Typography>
                    <Button color="inherit" variant="outlined" onClick={onLogout}>Cerrar Sesión</Button>
                </Toolbar>
            </AppBar>
            
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                {/* Drawer para móviles (temporal) */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'primary.main', color: 'white' },
                    }}
                >
                    {drawerContent}
                </Drawer>
                {/* Drawer para escritorio (permanente) */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'primary.main', color: 'white', borderRight: 'none' },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
                <Box sx={{ height: headerHeight }}/> {/* Espaciador */}
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;