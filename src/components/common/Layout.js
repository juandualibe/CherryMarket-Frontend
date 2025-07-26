// frontend/src/components/Layout.js
import React, { useState } from 'react'; // Importa React y el hook useState para manejar el estado del drawer
import { Link as RouterLink } from 'react-router-dom'; // Importa Link de react-router-dom, renombrado como RouterLink
import {
  Box, // Contenedor flexible para layouts
  Drawer, // Componente para el menú lateral
  List, // Lista para los ítems del menú
  ListItem, // Ítem individual de la lista
  ListItemButton, // Botón interactivo dentro del ítem
  ListItemIcon, // Ícono dentro del ítem
  ListItemText, // Texto dentro del ítem
  AppBar, // Barra superior de la aplicación
  Toolbar, // Contenedor para el contenido de la AppBar
  Typography, // Componente para textos estilizados
  CssBaseline, // Normaliza estilos CSS
  Divider, // Separador visual
  Button, // Botón interactivo
  IconButton, // Botón con ícono
} from '@mui/material'; // Componentes de Material-UI para la interfaz
import MenuIcon from '@mui/icons-material/Menu'; // Ícono para abrir/cerrar el drawer en móviles
import DashboardIcon from '@mui/icons-material/Dashboard'; // Ícono para la sección Dashboard
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'; // Ícono para Punto de Venta
import InventoryIcon from '@mui/icons-material/Inventory'; // Ícono para Gestión
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'; // Ícono para Historial de Ventas
import CategoryIcon from '@mui/icons-material/Category'; // Ícono para Categorías
import logo from '../../assets/logo.png'; // Importa el logo de la aplicación

// Constantes para dimensiones del layout
const drawerWidth = 240; // Ancho del drawer en píxeles
const headerHeight = '90px'; // Altura del encabezado (AppBar)

// Componente Layout: Define la estructura principal de la aplicación con un menú lateral y barra superior
// Props:
// - onLogout: Función para cerrar sesión
// - children: Contenido principal que se renderiza dentro del layout
// - userRole: Rol del usuario (admin o cashier) para filtrar opciones del menú
const Layout = ({ onLogout, children, userRole }) => {
  // Estado para controlar si el drawer está abierto en dispositivos móviles
  const [mobileOpen, setMobileOpen] = useState(false);

  // Función para alternar el estado del drawer en móviles
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Lista completa de ítems del menú con sus propiedades
  const allMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['admin', 'cashier'], // Visible para admin y cashier
    },
    {
      text: 'Punto de Venta',
      icon: <PointOfSaleIcon />,
      path: '/pos',
      roles: ['admin', 'cashier'],
    },
    {
      text: 'Gestión',
      icon: <InventoryIcon />,
      path: '/management',
      roles: ['admin'], // Solo visible para admin
    },
    {
      text: 'Historial de Ventas',
      icon: <ReceiptLongIcon />,
      path: '/history',
      roles: ['admin'],
    },
    {
      text: 'Categorías',
      icon: <CategoryIcon />,
      path: '/categories',
      roles: ['admin'],
    },
  ];

  // Filtra los ítems del menú según el rol del usuario
  const visibleMenuItems = allMenuItems.filter((item) => item.roles.includes(userRole));

  // Contenido del drawer (menú lateral)
  const drawerContent = (
    <div>
      {/* Encabezado del drawer con el logo */}
      <Box
        sx={{
          height: headerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={logo}
          alt="Logo Cherry Market"
          style={{ height: 70, borderRadius: 50 }} // Estilo para el logo
        />
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} /> {/* Separador visual */}
      {/* Lista de ítems del menú */}
      <List>
        {visibleMenuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            component={RouterLink}
            to={item.path}
            sx={{ color: 'white' }} // Estilo para los ítems
          >
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
    <Box sx={{ display: 'flex' }}> {/* Contenedor principal con layout flexible */}
      <CssBaseline /> {/* Normaliza estilos CSS */}
      {/* Barra superior (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` }, // Ajusta el ancho en pantallas grandes
          ml: { md: `${drawerWidth}px` }, // Margen izquierdo para el drawer
        }}
      >
        <Toolbar sx={{ height: headerHeight }}>
          {/* Botón para abrir el drawer en móviles */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }} // Oculto en pantallas grandes
          >
            <MenuIcon />
          </IconButton>
          {/* Título de la barra superior */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel de Administración
          </Typography>
          {/* Botón para cerrar sesión */}
          <Button color="inherit" variant="outlined" onClick={onLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      {/* Navegación lateral (Drawer) */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Drawer temporal para móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Mejora el rendimiento en móviles
          sx={{
            display: { xs: 'block', md: 'none' }, // Visible solo en móviles
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'primary.main',
              color: 'white',
            },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Drawer permanente para pantallas grandes */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' }, // Visible solo en pantallas grandes
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'primary.main',
              color: 'white',
              borderRight: 'none',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` }, // Ajusta el ancho
        }}
      >
        <Box sx={{ height: headerHeight }} /> {/* Espacio para la AppBar */}
        {children} {/* Renderiza el contenido pasado como prop */}
      </Box>
    </Box>
  );
};

export default Layout;