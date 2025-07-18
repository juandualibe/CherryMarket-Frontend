import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Divider, Button, IconButton } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CategoryIcon from '@mui/icons-material/Category';

import logo from './assets/logo.png';

const drawerWidth = 240;
const headerHeight = '90px';

// 1. Ahora Layout recibe 'userRole' como prop
const Layout = ({ onLogout, children, userRole }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // 2. Definimos qué roles pueden ver cada item del menú
    const allMenuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'cashier'] },
        { text: 'Punto de Venta', icon: <PointOfSaleIcon />, path: '/pos', roles: ['admin', 'cashier'] },
        { text: 'Gestión', icon: <InventoryIcon />, path: '/management', roles: ['admin'] },
        { text: 'Historial de Ventas', icon: <ReceiptLongIcon />, path: '/history', roles: ['admin'] },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/categories', roles: ['admin'] },
    ];

    // 3. Filtramos el menú para mostrar solo los items permitidos para el rol actual
    const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

    const drawerContent = (
        <div>
            <Box sx={{ height: headerHeight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logo} alt="Logo Cherry Market" style={{ height: 60 }} />
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
            <List>
                {/* 4. Usamos la lista filtrada 'visibleMenuItems' */}
                {visibleMenuItems.map((item) => (
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
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ height: headerHeight }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
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
                <Box sx={{ height: headerHeight }}/>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;